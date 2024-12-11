<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FileStorageService;
use App\Models\Report;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Display a listing of the reports.
     *
     */
    public function index($projectId)
    {

    }

    /**
     * Store a newly created report in storage.
     *
     * @param  Request  $request
     */
    public function store(Request $request, FileStorageService $fileStorageService)
    {
        return DB::transaction(function () use ($request, $fileStorageService) {
            try {
                $validatedData = $request->validate([
                    'report_by_user_id' => 'required|exists:users,id',
                    'project_id' => 'required|exists:projects,project_id',
                    'task_id' => 'nullable|exists:tasks,task_id',
                    'completion_goal' => 'nullable|string',
                    'today_work' => 'nullable|string',
                    'next_steps' => 'nullable|string',
                    'issues' => 'nullable|string',
                    'isLink' => 'required|boolean',
                    'documents' => 'nullable',
                ]);

                // Create report
                $report = Report::create($validatedData);

                // Handle files or link
                if ($request->isLink) {
                    // Handle link
                    $file = File::create([
                        'name' => $request->documents,
                        'uploaded_by' => $request->report_by_user_id,
                        'project_id' => $report->project_id,
                        'type' => 'link',
                        'path' => $request->documents,
                    ]);
                    $report->files()->attach($file->file_id);
                } else {
                    // Handle file upload
                    foreach ($request->documents as $uploadedFile) {
                        $filePath = $fileStorageService->storeFile($uploadedFile);
                        $file = File::create([
                            'name' => $uploadedFile->getClientOriginalName(),
                            'uploaded_by' => $request->report_by_user_id,
                            'project_id' => $report->project_id,
                            'type' => $uploadedFile->getClientMimeType(),
                            'path' => $filePath,
                        ]);
                        $report->files()->attach($file->file_id);
                    }
                }

                // Log success message
                \Log::info('Report created successfully', ['report_id' => $report->id]);

                return response()->json(['message' => 'Report created successfully!', 'report' => $report]);
            } catch (\Exception $e) {
                // Log error message if an exception occurs
                \Log::error('Error creating report', [
                    'error' => $e->getMessage(),
                    'stack' => $e->getTraceAsString(),
                ]);

                // Return error response
                return response()->json(['error' => 'Failed to create report'], 500);
            }
        });
    }


    /**
     * Display the specified report.
     *
     * @param  Report  $report
     */
    public function show(Request $request)
    {
        $validatedData = $request->validate([
            'project_id' => 'required|exists:projects,project_id',
            'task_id' => 'required|exists:tasks,task_id',
        ]);
    
        // Tìm report dựa trên project_id và task_id
        $report = Report::where('project_id', $validatedData['project_id'])
                        ->where('task_id', $validatedData['task_id'])
                        ->with([
                            'files', 
                            'user:id,name'
                        ])
                        ->first();
        if(!$report)
        {
            return response()->json();
        }
        // Trả về report và file liên quan
        return response()->json($report);
    }

    /**
     * Update the specified report in storage.
     *
     * @param  Request  $request
     */
    public function update($report_id, Request $request, FileStorageService $fileStorageService)
    {
        return DB::transaction(function () use ($report_id, $request, $fileStorageService) {
            try {
                $report = Report::find($report_id);
                if (!$report) {
                    \Log::warning('Report not found', ['report_id' => $report_id]);
                    return response()->json(['error' => 'Report not found'], 404);
                }

                $validatedData = $request->validate([
                    'report_by_user_id' => 'required|exists:users,id',
                    'project_id' => 'required|exists:projects,project_id',
                    'task_id' => 'nullable|exists:tasks,task_id',
                    'completion_goal' => 'nullable|string',
                    'today_work' => 'nullable|string',
                    'next_steps' => 'nullable|string',
                    'issues' => 'nullable|string',
                    'isLink' => 'required|boolean',
                    'documents' => 'nullable',
                ]);

                $report->update($validatedData);

                if ($request->isLink) {
                    // Remove old files and handle link
                    if ($report->isLink) {
                        foreach ($report->files as $file) {
                            $fileStorageService->deleteFile($file->path);
                            $file->delete();
                        }
                    }
                    $report->files()->delete();

                    $file = File::create([
                        'name' => $request->documents,
                        'uploaded_by' => $request->report_by_user_id,
                        'project_id' => $report->project_id,
                        'type' => 'link',
                        'path' => $request->documents,
                    ]);
                    $report->files()->attach($file->file_id);
                } else {
                    if (!$request->documents) {
                        return response()->json(['message' => 'Report updated successfully!']);
                    }

                    foreach ($report->files as $file) {
                        $fileStorageService->deleteFile($file->path);
                        $file->delete();
                    }

                    foreach ($request->documents as $uploadedFile) {
                        $filePath = $fileStorageService->storeFile($uploadedFile);
                        $file = File::create([
                            'name' => $uploadedFile->getClientOriginalName(),
                            'uploaded_by' => $request->report_by_user_id,
                            'project_id' => $report->project_id,
                            'type' => $uploadedFile->getClientMimeType(),
                            'path' => $filePath,
                        ]);
                        $report->files()->attach($file->file_id);
                    }
                }

                // Log success message
                \Log::info('Report updated successfully', ['report_id' => $report->id]);

                return response()->json(['message' => 'Report updated successfully!']);
            } catch (\Exception $e) {
                // Log error message if an exception occurs
                \Log::error('Error updating report', [
                    'error' => $e->getMessage(),
                    'stack' => $e->getTraceAsString(),
                ]);

                // Return error response
                return response()->json(['error' => 'Failed to update report'], 500);
            }
        });
    }

    

    /**
     * Remove the specified report from storage.
     *
     */
    public function destroy($id, FileStorageService $fileStorageService)
    {
        try {
            // Find and delete report with related files
            $report = Report::findOrFail($id);

            // Delete files related to the report
            foreach ($report->files as $file) {
                $fileStorageService->deleteFile($file->path);
                $file->delete();
            }

            // Delete the report
            $report->delete();

            // Log success message
            \Log::info('Report deleted successfully', ['report_id' => $id]);

            return response()->json(['message' => 'Report deleted successfully!']);
        } catch (\Exception $e) {
            // Log error message if an exception occurs
            \Log::error('Error deleting report', [
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Failed to delete report'], 500);
        }
    }

    
}

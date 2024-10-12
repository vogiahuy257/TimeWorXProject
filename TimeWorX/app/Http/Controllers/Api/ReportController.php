<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FileStorageService;
use App\Models\Report;
use App\Models\File;
use Illuminate\Http\Request;

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
    public function store(Request $request ,FileStorageService $fileStorageService)
    {
        
        $validatedData = $request->validate([
            'report_by_user_id' => 'required|exists:users,id',
            'project_id' => 'required|exists:projects,project_id',
            'task_id' => 'nullable|exists:tasks,task_id',
            'completion_goal' => 'nullable|string',
            'today_work' => 'nullable|string',
            'next_steps' => 'nullable|string',
            'issues' => 'nullable|string',
            'isLink' => 'required|boolean',
            'documents' => 'nullable|array',
        ]);

        // Tạo mới report
        $report = Report::create($validatedData);

        // Xử lý tài liệu
        if ($request->isLink) {
            // Nếu là link, tạo mới file với kiểu 'link'
            $file = File::create([
                'file_name' => $request->documents,  // Ở đây, documents là link tài liệu
                'uploaded_by' => $request->report_by_user_id,
                'project_id' => $report->project_id,
                'file_type' => 'link',
                'file_path' => $request->documents,
            ]);

            // Gắn file với report
            $report->files()->attach($file->file_id);

        } else {
            // Nếu không phải link, xử lý file tải lên
            foreach ($request->documents as $uploadedFile) {
                // Sử dụng FileStorageService để lưu file
                $filePath = $fileStorageService->storeFile($uploadedFile);
                $file = File::create([
                    'file_name' => $uploadedFile->getClientOriginalName(),
                    'uploaded_by' => $request->report_by_user_id,
                    'project_id' => $report->project_id,
                    'file_type' => $uploadedFile->getClientMimeType(),
                    'file_path' => $filePath,
                ]);

                // Gắn file với report
                $report->files()->attach($file->file_id);
            }
        }

        return response()->json();
    }

    /**
     * Display the specified report.
     *
     * @param  Report  $report
     */
    public function show(Report $report)
    {
        
    }

    /**
     * Update the specified report in storage.
     *
     * @param  Request  $request
     * @param  Report  $report
     */
    public function update(Request $request, Report $report)
    {
       
    }

    /**
     * Remove the specified report from storage.
     *
     * @param  Report  $report
     */
    public function destroy(Report $report)
    {
        $report->delete();
        return response()->json();
    }
}

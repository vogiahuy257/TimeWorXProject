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
            'documents' => 'nullable',
        ]);

        // Tạo mới report
        $report = Report::create($validatedData);

        // Xử lý tài liệu
        if ($request->isLink) {
            // Nếu là link, tạo mới file với kiểu 'link'
            $file = File::create([
                'name' => $request->documents,  // Ở đây, documents là link tài liệu
                'uploaded_by' => $request->report_by_user_id,
                'project_id' => $report->project_id,
                'type' => 'link',
                'path' => $request->documents,
            ]);

            // Gắn file với report
            $report->files()->attach($file->file_id);

        } else {
            // Nếu không phải link, xử lý file tải lên
            foreach ($request->documents as $uploadedFile) {
                // Sử dụng FileStorageService để lưu file
                $filePath = $fileStorageService->storeFile($uploadedFile);
                $file = File::create([
                    'name' => $uploadedFile->getClientOriginalName(),
                    'uploaded_by' => $request->report_by_user_id,
                    'project_id' => $report->project_id,
                    'type' => $uploadedFile->getClientMimeType(),
                    'path' => $filePath,
                ]);

                // Gắn file với report
                $report->files()->attach($file->file_id);
            }
        }

        return response()->json(['message' => 'Report create successfully!']);
    }

    /**
     * Display the specified report.
     *
     * @param  Report  $report
     */
    public function show(Request $request, $id)
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
            return response()->json(['message' => 'Report not found'], 404);
        }
    
        // Trả về report và file liên quan
        return response()->json($report);
    }

    /**
     * Update the specified report in storage.
     *
     * @param  Request  $request
     */
    public function update($report_id,Request $request, FileStorageService $fileStorageService)
    {
        $report = Report::find($report_id);
        if (!$report) {
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
    
        // Cập nhật report
        $report->update($validatedData);
    
        // Xử lý tài liệu
        if ($request->isLink) 
        {
            if($report->isLink)
            {
                foreach ($report->files as $file) 
                {
                    $fileStorageService->deleteFile($file->path);
                    $file->delete(); 
                }
            }
            // Xóa các file cũ
            $report->files()->delete(); 
    
            // Tạo mới file dạng link
            $file = File::create([
                'name' => $request->documents,  
                'uploaded_by' => $request->report_by_user_id,
                'project_id' => $report->project_id,
                'type' => 'link',
                'path' => $request->documents,
            ]);
    
            // Gắn file với report
            $report->files()->attach($file->file_id);
    
        } 
        else 
        {
            
            if($request->documents == null)
            {
                return response()->json(['message' => 'Report updated successfully!']);
            }
            foreach ($report->files as $file) 
            {
                $fileStorageService->deleteFile($file->path);
                $file->delete(); 
            }
            
            foreach ($request->documents as $uploadedFile) 
            {
                $filePath = $fileStorageService->storeFile($uploadedFile);
                $file = File::create([
                        'name' => $uploadedFile->getClientOriginalName(),
                        'uploaded_by' => $request->report_by_user_id,
                        'project_id' => $report->project_id,
                        'type' => $uploadedFile->getClientMimeType(),
                        'path' => $filePath,
                    ]);

                // Gắn file với report
                $report->files()->attach($file->file_id);
            }
            
        }
    
        return response()->json(['message' => 'Report updated successfully!']);
    }
    

    /**
     * Remove the specified report from storage.
     *
     */
    public function destroy($id,FileStorageService $fileStorageService)
    {
        // Tìm và xóa report cùng với các file liên quan
        $report = Report::findOrFail($id);
        
        // Xóa các file liên quan trước
        foreach ($report->files as $file) {
            $fileStorageService->deleteFile($file->path);
            $file->delete();
        }
        
        // Xóa report
        $report->delete(); 

        return response()->json(['message' => 'Report deleted successfully!']);
    }
}

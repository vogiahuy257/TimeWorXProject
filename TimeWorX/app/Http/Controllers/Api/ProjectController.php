<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_name' => 'required|string|max:100',
            'project_description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'user_id' => 'required|uuid',
            'project_status'=>'nullable|string|max:200',
        ]);

        // Gán project_manager là user_id
        $validated['project_manager'] = $request->user_id;

        // Tạo dự án mới
        Project::create($validated);

        return response()->json();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $user_id)
    {
        $projects = Project::nonDeleted()
        ->where(function ($query) use ($user_id) 
        {
            $query->where('project_manager', $user_id)
                  ->orWhereHas('users', function ($query) use ($user_id) 
                  {
                      $query->where('user_id', $user_id)
                            ->where('is_project_manager', true);
                  });
        })
        ->get();

        // Cập nhật trạng thái và thông tin cho từng dự án
        foreach ($projects as $project) {
            $project->updateProjectStatus();
            $project->late_tasks_count = $project->countLateTasks();
            $project->near_deadline_tasks_count = $project->countNearDeadlineTasks();
            $project->completed_tasks_ratio = $project->countTasksAndCompleted();
        }

        return response()->json($projects);
    }

    //show all user delete

    public function getDeletedProjects(string $user_id)
    {
        // Lấy các dự án đã bị xóa cho người quản lý dự án
        $deletedProjects = Project::deletedProjectsByUser($user_id)->get();

        // Trả về danh sách dự án đã bị xóa hoặc thông báo không tìm thấy dự án
        return response()->json($deletedProjects);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $project = Project::findOrFail($id);

        if (!$project->isUserProjectManager($request->user_id)) {
            return response()->json(['error' => 'Update false'], 403);
        }

        $validated = $request->validate([
            'project_name' => 'required|string|max:100',
            'project_description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'user_id' => 'required|uuid',
            'project_status'=>'nullable|string|max:200',
        ]);

        $project->update($validated);

        return response()->json($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $project = Project::findOrFail($id);

        $project->delete();
        return response()->json(null, 204);
    }

    public function permanentlyDeleteProject(string $id)
    {
        $project = Project::onlyTrashed()->findOrFail($id);
        $project->forceDelete();
        
        return response()->json(['message' => 'Project permanently deleted'], 200);
    }

    public function restoreProject(string $id)
    {
        $project = Project::onlyTrashed()->findOrFail($id);
        $project->restore();
    
        return response()->json(['message' => 'Project restored successfully'], 200);
    }

    public function addUserToProject(Request $request, $projectId)
    {
        $userId = $request->input('user_id');

        // Kiểm tra xem người dùng đã có trong dự án chưa
        $project = Project::find($projectId);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        if ($project->users()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'User already added to this project'], 400);
        }

        // Thêm người dùng vào dự án
        $project->users()->attach($userId);

        return response()->json();
    }

    public function updateUserRoleInProject(Request $request, string $projectId)
    {
        $validated = $request->validate([
            'user_id' => 'required|uuid',
            'is_project_manager' => 'required|boolean',
        ]);

        $project = Project::findOrFail($projectId);
        
        // Cập nhật quyền cho người dùng
        $project->users()->updateExistingPivot($validated['user_id'], [
            'is_project_manager' => $validated['is_project_manager']
        ]);

        return response()->json(['message' => 'User role updated successfully']);
    }

    public function getStatisticsOfTasks($user_id)
    {
        $projects = Project::nonDeleted()
        ->where(function ($query) use ($user_id) {
            $query->where('project_manager', $user_id)
                  ->orWhereHas('users', function ($query) use ($user_id) {
                      $query->where('user_id', $user_id)
                            ->where('is_project_manager', true);
                  });
        })
        ->get();

        foreach ($projects as $project) {
            $project->updateProjectStatus();
            $project->statistics = $project->countTasksByStatus();;
        }
    
        return response()->json($projects);
    }

    public function getProjectStatistics(Request $request, $project_id)
    {
        $user_id = $request->input('user_id');
    
        $project = Project::select('project_id')
            ->nonDeleted()
            ->where('project_id', $project_id)
            ->where(function ($query) use ($user_id) {
                $query->where('project_manager', $user_id)
                    ->orWhereHas('users', function ($query) use ($user_id) {
                        $query->where('user_id', $user_id)
                              ->where('is_project_manager', true);
                    });
            })
            ->first();
    
        // Kiểm tra nếu không tìm thấy project
        if (!$project) {
            return response()->json(['message' => 'Project not found or access denied.'], 404);
        }
    
        $statistics = $project->countTasksByStatus();
    
        return response()->json(['statistics' => $statistics]);
    }
    

}

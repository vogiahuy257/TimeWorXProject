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
            'user_id' => 'required|integer',
            'project_status'=>'nullable|string|max:200',
        ]);
        
        $validated['project_manager'] = $request->user_id;

        $project = Project::create($validated);
        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $user_id)
    {
        $projects = Project::nonDeleted()->where('project_manager', $user_id)->get();

        foreach ($projects as $project) {
            $project->updateProjectStatus(); 
            $project->late_tasks_count = $project->countLateTasks();
            $project->near_deadline_tasks_count = $project->countNearDeadlineTasks();
        }       

        return response()->json($projects);
    }

    //show all user delete

    public function getDeletedProjects(string $user_id)
    {
        $projects = Project::onlyTrashed()->where('project_manager', $user_id)->get();
        return response()->json($projects);
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

        // Check if the authenticated user is the project manager
        if ($request->user_id != $project->project_manager) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'project_name' => 'required|string|max:100',
            'project_description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'user_id' => 'required|integer',
            'project_status'=>'nullable|string|max:200',
        ]);

        // Ghi giá trị vào log
        $validated['project_manager'] = $request->user_id;
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
}

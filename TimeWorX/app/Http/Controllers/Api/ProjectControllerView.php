<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class ProjectControllerView extends Controller
{

    public function index()
    {
    }

    public function show($id)
    {
        $project = Project::findOrFail($id);

        $tasks = Task::where('project_id', $id)->get();

        $response = [
            'project' => [
                'id' => $project->project_id, 
                'name' => $project->project_name, 
                'description' => $project->project_description, 
            ],
            'tasks' => [
                'to-do' => [],
                'in-progress' => [],
                'verify' => [],
                'done' => [],
            ],
        ];

        foreach ($tasks as $task) {
            $statusKey = $task->status_key ?? 'to-do'; 
            if (array_key_exists($statusKey, $response['tasks'])) {
                $response['tasks'][$statusKey][] = [
                    'id' => strval($task->task_id), 
                    'content' => $task->task_name, 
                    'user_count' => $task->users->count(), 
                    'deadline' => $task->deadline,
                ];
            }
        }

        return response()->json($response);
    }

    // Tạo dự án mới
    public function store(Request $request)
    {
        $request->validate([
            'project_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $project = Project::create($request->all());

        return response()->json($project, 201);
    }

    // Cập nhật dự án
    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $request->validate([
            'status' => 'required|string',
        ]);

        $task->status_key = $request->input('status');
        $task->save();

        return response()->json();
    }

    // Xóa dự án
    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}

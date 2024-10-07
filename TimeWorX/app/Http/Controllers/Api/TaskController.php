<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use App\Models\PersonalPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     */

    public function index()
    {
        $userId = Auth::id();
        $tasks = Task::where('assigned_to_user_id', $userId)->get();

        return response()->json($tasks);
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(Request $request)
    {
        // Validate các dữ liệu được gửi từ form
        $validatedData = $request->validate([
            'project_id' => 'required',
            'task_name' => 'required|string|max:255',
            'task_description' => 'nullable|string',
            'status_key' => 'required',
            'assigned_to_user_id' => 'nullable|exists:users,id',
            'deadline' => 'nullable|date',
        ]);

        // Tạo task mới
        $task = Task::create($validatedData);
        return response()->json($task, 201);
    }

    /**
     * Display the specified task.
     */
    public function show($id)
    {
        $userId = $id;
        $user = User::find($userId);
        $tasks = $user->tasks; 
        $personalPlans = PersonalPlan::where('user_id', $userId)->get();

        $response = [
            'tasks' => [
                'to-do' => [],
                'in-progress' => [],
                'verify' => [],
                'done' => [],
            ],
            'personalPlans' => [
                'to-do' => [],
                'in-progress' => [],
                'verify' => [],
                'done' => [],
            ],
        ];

        foreach ($tasks as $task) {
            
            $task->checkDeadlineStatus();

            $statusKey = $task->status_key ?? 'to-do'; 
            if (array_key_exists($statusKey, $response['tasks'])) {
                $response['tasks'][$statusKey][] = [
                    'id' => strval($task->task_id), 
                    'content' => $task->task_name, 
                    'description' => $task->task_description,
                    'user_count' => $task->users->count(), 
                    'users' => $task->users->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'name' => $user->name, 
                        ];
                    }),
                    'deadline' => $task->formatted_deadline,
                    'status' => $task->status_key,
                    'is_late' => $task->is_late,
                    'is_near_deadline' => $task->is_near_deadline,
                ];
            }
        }

        foreach ($personalPlans as $plan) {
            $statusKey = $plan->plan_status ?? 'to-do'; 

            if (array_key_exists($statusKey, $response['personalPlans'])) {
                $response['personalPlans'][$statusKey][] = [
                    'id' => strval($plan->plan_id),
                    'name' => $plan->plan_name,
                    'description' => $plan->plan_description,
                    'start_date' => $plan->formatted_start_date,
                    'end_date' => $plan->formatted_end_date,
                    'status' => $plan->plan_status,
                    'priority' => $plan->plan_priority,
                ];
            }
        }

        return response()->json($response);
    }

    /**
     * Update the specified task in storage.
     */
    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $request->validate([
            'task_name' => 'sometimes|string|max:255',
            'deadline' => 'sometimes|date',
            'description' => 'nullable|string',
            'status' => 'sometimes|string',
        ]);

        $task->status_key = $request->input('status');
        $task->save();

        return response()->json();
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Task $task)
    {
        // Xóa mềm task
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}

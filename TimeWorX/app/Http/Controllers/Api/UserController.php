<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        $users->each(function($user) {
            $user->active_tasks_count = $user->countActiveTasks();
        });
    
        return response()->json($users);
    }

    /**
     * Tìm kiếm người dùng theo tên hoặc email.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $searchTerm = $request->input('search');

        $users = User::where('name', 'like', "%{$searchTerm}%")
                     ->orWhere('email', 'like', "%{$searchTerm}%")
                     ->take(20) 
                     ->get(['id', 'name']);

        return response()->json($users);
    }


    public function showUserToTask($task_id)
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

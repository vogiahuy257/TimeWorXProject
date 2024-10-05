<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\TaskComment;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskCommentController extends Controller
{
    /**
     * Display a listing of the comments for a specific task.
     */
    public function index($taskId)
    {
         // Lấy task cụ thể và các user tham gia task đó
         $task = Task::with('users')->findOrFail($taskId);

         // Lấy tất cả các bình luận cho task đó
         $comments = TaskComment::where('task_id', $taskId)
             ->with('user') // Bao gồm thông tin user liên quan đến comment
             ->get();
 
         // Gộp dữ liệu các user và comment lại
         $data = $task->users->map(function ($user) use ($comments) {
             return [
                 'user' => $user, // Thông tin user
                 'comments' => $comments->where('user_id', $user->id)->values(), // Lọc comment theo user_id
             ];
         });
 
         return response()->json($data);
    }

    /**
     * Store a newly created comment in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'task_id' => 'required|integer|exists:tasks,task_id',
            'user_id' => 'required|integer|exists:users,id',
            'comment_text' => 'required|string',
            'is_manager_comment' => 'boolean',
        ]);

        // Tạo bình luận mới
        $comment = TaskComment::create($validatedData);

        return response()->json($comment, 201);
    }

    /**
     * Display the specified comment.
     */
    public function show($id)
    {
        $comment = TaskComment::with('user')->findOrFail($id);

        return response()->json($comment);
    }

    /**
     * Update the specified comment in storage.
     */
    public function update(Request $request, $id)
    {
        $comment = TaskComment::findOrFail($id);

        $request->validate([
            'comment_text' => 'required|string',
            'is_manager_comment' => 'required|boolean',
        ]);

        // Cập nhật bình luận
        $comment->update($request->all());

        return response()->json($comment);
    }

    /**
     * Remove the specified comment from storage.
     */
    public function destroy($id)
    {
        $comment = TaskComment::findOrFail($id);

        // Soft delete bình luận
        $comment->delete();

        return response()->json(null, 204);
    }
}

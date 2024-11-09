<?php

namespace App\Http\Controllers\Api;

use App\Models\ReportComment;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Models\TaskUser;
use Illuminate\Support\Facades\DB;

class ReportCommentController extends Controller
{
    // Xem danh sách bình luận của một báo cáo
    public function index($taskId,$userId)
    {
        // Đánh dấu các bình luận là đã xem bằng cách đặt has_seen_comment thành false cho user hiện tại
        DB::table('task_user')
            ->where('task_id', $taskId)
            ->where('user_id', $userId)
            ->update(['has_seen_comment' => false]);

        // Lấy danh sách các bình luận của task kèm thông tin user
        $comments = ReportComment::with(['user' => function($query) {
            $query->select('id', 'name', 'profile_picture');
        }])
        ->where('task_id', $taskId)
        ->get();

        if ($comments->isEmpty()) {
            return response()->json(['message' => 'No comments found'], 200);
        }
    
        return response()->json($comments);
    }


    // Thêm bình luận vào báo cáo
    public function store(Request $request, $taskId ,$userId)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'required|string',
            'is_project_manager' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Đặt cờ đã xem cho tất cả người dùng khác
        ReportComment::markOtherUsersCommentsAsSeen($taskId, $userId);

        // Tạo mới bình luận
        $comment = new ReportComment();
        $comment->task_id = $taskId;
        $comment->comment_by_user_id = $userId;
        $comment->comment = $request->comment;
        $comment->is_project_manager = $request->is_project_manager;
        $comment->save();

        $comment = ReportComment::with(['user' => function($query) {
            $query->select('id', 'name', 'profile_picture');
        }])
        ->where('task_id', $taskId)
        ->get();

        return response()->json($comment);
    }


    // Xóa bình luận của báo cáo
    public function destroy($commentId,$userId)
    {
        $comment = ReportComment::findOrFail($commentId);

        if ($comment->comment_by_user_id !== $userId && !request()->user()->is_project_manager) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();
        
        return response()->json(['message' => 'Comment deleted successfully']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Models\ReportComment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class ReportCommentController extends Controller
{
    // Xem danh sách bình luận của một báo cáo
    public function index($reportId)
    {
        Report::findOrFail($reportId);
        
        $comments = ReportComment::with(['user' => function($query) {
            $query->select('id', 'name', 'profile_picture');
        }]) 
            ->where('report_id', $reportId)
            ->get();
        
        return response()->json($comments);
    }

    // Thêm bình luận vào báo cáo
    public function store(Request $request, $reportId)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'required|string',
            'is_project_manager' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        Report::findOrFail($reportId);

        // Thay vì Auth::user(), lấy user_id từ request
        $userId = $request->user()->id; // Lấy thông tin người dùng từ token hoặc session

        $comment = new ReportComment();
        $comment->report_id = $reportId;
        $comment->comment_by_user_id = $userId; // Sử dụng user_id
        $comment->comment = $request->comment;
        $comment->is_project_manager = $request->is_project_manager;
        $comment->save();

        return response()->json(['message' => 'Comment added successfully', 'comment' => $comment], 201);
    }

    // Xóa bình luận của báo cáo
    public function destroy($commentId)
    {
        $comment = ReportComment::findOrFail($commentId);

        // Kiểm tra xem người dùng có quyền xóa bình luận này không (chỉ người tạo hoặc quản lý mới có thể xóa)
        $userId = request()->user()->id; // Lấy thông tin người dùng từ token hoặc session
        
        if ($comment->comment_by_user_id !== $userId && !request()->user()->is_project_manager) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();
        
        return response()->json(['message' => 'Comment deleted successfully']);
    }
}

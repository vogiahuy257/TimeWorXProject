<?php

namespace App\Http\Controllers\Api;

use App\Models\ReportComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class ReportCommentController extends Controller
{
    // Xem danh sách bình luận của một báo cáo
    public function index($taskId, $userId)
    {
        try {
            // Lấy bình luận được ghim kèm thông tin người dùng
            $pinnedComments = ReportComment::with(['user' => function($query) {
                // Chỉ lấy các trường cần thiết từ bảng user
                $query->select('id', 'name', 'profile_picture');
            }])
            ->where('task_id', $taskId) // Lọc theo ID task
            ->where('is_pinned', true) // Chỉ lấy bình luận được ghim
            ->get();

            // Lấy các bình luận thông thường kèm thông tin người dùng
            $regularComments = ReportComment::with(['user' => function($query) {
                // Chỉ lấy các trường cần thiết từ bảng user
                $query->select('id', 'name', 'profile_picture');
            }])
            ->where('task_id', $taskId) // Lọc theo ID task
            ->get();

            // Trả về danh sách bình luận dạng JSON
            return response()->json([
                'pinned_comments' => $pinnedComments, // Bình luận được ghim
                'regular_comments' => $regularComments // Bình luận thường
            ]);
        } catch (\Exception $e) {
            // Xử lý lỗi và trả về thông báo lỗi
            return response()->json(['error' => 'Failed to retrieve comments', 'message' => $e->getMessage()], 500);
        }
    }

    // Thêm bình luận vào báo cáo
    public function store(Request $request, $taskId, $userId)
    {
        try {
            // Xác thực dữ liệu từ request
            $validator = Validator::make($request->all(), [
                'comment' => 'required|string', // Bình luận là chuỗi và bắt buộc
                'is_project_manager' => 'required|boolean', // Xác định vai trò của người dùng
            ]);

            if ($validator->fails()) {
                // Trả về lỗi xác thực nếu không hợp lệ
                return response()->json($validator->errors(), 400);
            }

            // Tạo mới một bình luận
            $comment = new ReportComment();
            $comment->task_id = $taskId; // Gắn bình luận với task cụ thể
            $comment->comment_by_user_id = $userId; // ID người dùng tạo bình luận
            $comment->comment = $request->comment; // Nội dung bình luận
            $comment->is_project_manager = $request->is_project_manager; // Vai trò người dùng
            $comment->is_pinned = false; // Mặc định không ghim
            $comment->save(); // Lưu bình luận vào database

            // Lấy lại danh sách bình luận để trả về
            $comment = ReportComment::with(['user' => function($query) {
                // Chỉ lấy các trường cần thiết từ bảng user
                $query->select('id', 'name', 'profile_picture');
            }])
            ->where('task_id', $taskId) // Lọc theo ID task
            ->get();

            // Trả về danh sách bình luận dạng JSON
            return response()->json($comment);
        } catch (\Exception $e) {
            // Xử lý lỗi và trả về thông báo lỗi
            return response()->json(['error' => 'Failed to create comment', 'message' => $e->getMessage()], 500);
        }
    }

    // Xóa bình luận của báo cáo
    public function destroy($commentId, $userId)
    {
        try {
            // Tìm bình luận theo ID
            $comment = ReportComment::findOrFail($commentId);

            // Kiểm tra quyền xóa bình luận
            if ($comment->comment_by_user_id !== $userId && !request()->user()->is_project_manager) {
                return response()->json(['message' => 'Unauthorized'], 403); // Không có quyền
            }

            // Xóa bình luận
            $comment->delete();

            // Trả về thông báo thành công
            return response()->json(['message' => 'Comment deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Xử lý lỗi khi không tìm thấy bình luận
            return response()->json(['error' => 'Comment not found', 'message' => $e->getMessage()], 404);
        } catch (\Exception $e) {
            // Xử lý lỗi khác và trả về thông báo lỗi
            return response()->json(['error' => 'Failed to delete comment', 'message' => $e->getMessage()], 500);
        }
    }

    // Ghim bình luận
    public function pinComment($commentId)
    {
        try {
            // Tìm bình luận theo ID
            $comment = ReportComment::findOrFail($commentId);
            $comment->is_pinned = true; // Đánh dấu là đã ghim
            $comment->save(); // Lưu lại thay đổi

            // Trả về bình luận đã được ghim
            return response()->json($comment);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Xử lý lỗi khi không tìm thấy bình luận
            return response()->json(['error' => 'Comment not found', 'message' => $e->getMessage()], 404);
        } catch (\Exception $e) {
            // Xử lý lỗi khác và trả về thông báo lỗi
            return response()->json(['error' => 'Failed to pin comment', 'message' => $e->getMessage()], 500);
        }
    }

    // Gỡ ghim bình luận
    public function unpinComment($commentId)
    {
        try {
            // Tìm bình luận theo ID
            $comment = ReportComment::findOrFail($commentId);
            $comment->is_pinned = false; // Bỏ đánh dấu ghim
            $comment->save(); // Lưu lại thay đổi

            // Trả về bình luận đã được gỡ ghim
            return response()->json($comment);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Xử lý lỗi khi không tìm thấy bình luận
            return response()->json(['error' => 'Comment not found', 'message' => $e->getMessage()], 404);
        } catch (\Exception $e) {
            // Xử lý lỗi khác và trả về thông báo lỗi
            return response()->json(['error' => 'Failed to unpin comment', 'message' => $e->getMessage()], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    /**
     * Lấy danh sách thông báo của người dùng.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id; // Lấy ID người dùng hiện tại từ token hoặc session
        $notifications = Notification::where('user_id', $userId)->orderBy('notification_date', 'desc')->get();

        return response()->json($notifications, 200);
    }

    /**
     * Đánh dấu thông báo là đã đọc.
     */
    public function markAsRead(Request $request)
    {
        $request->validate([
            'notification_ids' => 'required|array',
            'notification_ids.*' => 'exists:notifications,notification_id',
        ]);

        Notification::whereIn('notification_id', $request->notification_ids)
            ->update(['read_status' => true]);

        return response()->json(['message' => 'Thông báo đã được đánh dấu là đã đọc'], 200);
    }


    /**
     * Xóa thông báo.
     */
    public function destroy($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['message' => 'Thông báo không tồn tại'], 404);
        }

        $notification->delete();

        return response()->json(['message' => 'Thông báo đã được xóa'], 200);
    }

    /**
     * Tạo thông báo mới (cho admin hoặc hệ thống).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|uuid|exists:users,id',
            'notification_type' => 'required|string|max:50',
            'message' => 'required|string',
            'link' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $notification = Notification::create([
            'user_id' => $request->user_id,
            'notification_type' => $request->notification_type,
            'message' => $request->message,
            'link' => $request->link,
        ]);

        return response()->json(['message' => 'Thông báo đã được tạo', 'notification' => $notification], 201);
    }
}

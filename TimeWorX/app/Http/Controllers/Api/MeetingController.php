<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\User;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    /**
     * Lấy tất cả các cuộc họp mà user_id tham gia.
     */
    public function getUserMeetings(Request $request)
    {
        $userId = $request->user()->id; // Lấy user ID từ Auth

        $meetings = Meeting::where(function ($query) use ($userId) {
            $query->whereHas('users', function ($query) use ($userId) {
                $query->where('user_id', $userId); // Kiểm tra nếu user tham gia cuộc họp
            })
            ->orWhere('created_by_user_id', $userId); // Hoặc user là người tạo cuộc họp
        })
        ->with(['users' => function($query) {
            $query->select('id', 'name'); // Lấy id và name của người tham gia
        }, 'creator' => function($query) {
            $query->select('id', 'name'); // Lấy id và name của người tạo cuộc họp
        }])
        ->get();

        return response()->json($meetings);
    }



    /**
     * Tạo một cuộc họp mới với đầy đủ thông tin và danh sách user_id tham gia.
     */
    public function createMeeting(Request $request)
    {
        $validated = $request->validate([
            'meeting_name' => 'required|string|max:400',
            'meeting_description' => 'nullable|string',
            'meeting_date' => 'required|date',
            'meeting_time' => 'required|date_format:H:i',
            'meeting_type' => 'nullable|string|max:60',
            'created_by_user_id' => 'required|uuid|exists:users,id',
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'required|uuid|exists:users,id',
        ]);

        $meeting = Meeting::create([
            'meeting_name' => $validated['meeting_name'],
            'meeting_description' => $validated['meeting_description'],
            'meeting_date' => $validated['meeting_date'],
            'meeting_time' => $validated['meeting_time'],
            'meeting_type' => $validated['meeting_type'],
            'created_by_user_id' => $validated['created_by_user_id'],
        ]);

        // Thêm các user vào cuộc họp
        $meeting->users()->attach($validated['user_ids']);

        return response()->json([
            'message' => 'Cuộc họp đã được tạo thành công.',
            'meeting' => $meeting->load('users'),
        ]);
    }

    /**
     * Cập nhật thông tin cuộc họp và danh sách user_id tham gia.
     */
    public function updateMeeting(Request $request, $meetingId)
    {   
        $userId = $request->user()->id;
        $meeting = Meeting::findOrFail($meetingId);
        if ($meeting->created_by_user_id !== $userId) {
            return response()->json([
                'message' => 'Bạn không có quyền chỉnh sửa cuộc họp này.',
            ], 403); // Trả về mã lỗi 403 nếu người dùng không phải là người tạo
        }
        $validated = $request->validate([
            'meeting_name' => 'required|string|max:400',
            'meeting_description' => 'nullable|string',
            'meeting_date' => 'required|date',
            'meeting_time' => 'required|date_format:H:i:s',
            'meeting_type' => 'nullable|string|max:60',
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'uuid|exists:users,id',
        ]);

        $meeting->update([
            'meeting_name' => $validated['meeting_name'],
            'meeting_description' => $validated['meeting_description'],
            'meeting_date' => $validated['meeting_date'],
            'meeting_time' => $validated['meeting_time'],
            'meeting_type' => $validated['meeting_type'],
        ]);

        // Cập nhật danh sách user tham gia
        $meeting->users()->sync($validated['user_ids']);

        return response()->json([
            'message' => 'Cuộc họp đã được cập nhật thành công.',
            'meeting' => $meeting->load('users'),
        ]);
    }

    /**
     * Xóa một cuộc họp với đầy đủ thông tin và danh sách các user_id tham gia.
     */
    public function deleteMeeting($meetingId)
    {
        $meeting = Meeting::with('users')->findOrFail($meetingId);

        // Lưu thông tin cuộc họp trước khi xóa
        $meetingData = $meeting->toArray();
        $meeting->delete();

        return response()->json([
            'message' => 'Cuộc họp đã được xóa thành công.',
            'deleted_meeting' => $meetingData,
        ]);
    }
}

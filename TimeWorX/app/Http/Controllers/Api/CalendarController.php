<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CalendarController extends Controller
{
    public function updateEvent(Request $request, $eventId)
    {
        // Lấy thông tin từ request
        $start = Carbon::parse($request->start);
        $end = Carbon::parse($request->end);
        $isProject = $request->isProject; // Kiểm tra xem sự kiện là Project hay Task

        // Cập nhật thời gian cho Project hoặc Task
        if ($isProject) {
            // Cập nhật Project
            $project = Project::find($eventId);
            if ($project) {
                $project->start_date = $start;
                $project->end_date = $end;
                $project->save();
                return response()->json(['message' => 'Project updated successfully!']);
            } else {
                return response()->json(['error' => 'Project not found'], 404);
            }
        } else {
            // Cập nhật Task
            $task = Task::find($eventId);
            if ($task) {

                $project = $task->project;
                if ($end >= $project->end_date) {
                    // Nếu thời gian kết thúc của Task vượt quá thời gian kết thúc của Project, trả về lỗi
                    return response()->json(['error' => 'Task end time cannot be later than the project end time'], 400);
                }
                $task->deadline = $end; // Giả sử deadline là ngày kết thúc
                $task->save();
                return response()->json(['message' => 'Task updated successfully!']);
            } else {
                return response()->json(['error' => 'Task not found'], 404);
            }
        }
    }
}

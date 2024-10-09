<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Display a listing of the reports.
     *
     *
     */
    public function index($projectId)
    {
        // Kiểm tra xem project_id có hợp lệ không
        $reports = Report::with(['user', 'project', 'task'])
            ->where('project_id', $projectId)
            ->get();

        return response()->json($reports);
    }

    /**
     * Store a newly created report in storage.
     *
     * @param  Request  $request
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'report_by_user_id' => 'required|exists:users,id',
            'project_id' => 'required|exists:projects,project_id',
            'task_id' => 'nullable|exists:tasks,task_id',
            'report_title' => 'required|string|max:100',
            'status_report' => 'required|string|max:100',
            'completion_goal' => 'nullable|string',
            'today_work' => 'nullable|string',
            'next_steps' => 'nullable|string',
            'issues' => 'nullable|string',
        ]);

        $report = Report::create($validatedData);
        return response()->json($report);
    }

    /**
     * Display the specified report.
     *
     * @param  Report  $report
     */
    public function show(Report $report)
    {
        return response()->json($report->load(['user', 'project', 'task']));
    }

    /**
     * Update the specified report in storage.
     *
     * @param  Request  $request
     * @param  Report  $report
     */
    public function update(Request $request, Report $report)
    {
        $validatedData = $request->validate([
            'report_by_user_id' => 'sometimes|exists:users,id',
            'project_id' => 'sometimes|exists:projects,project_id',
            'task_id' => 'nullable|exists:tasks,task_id',
            'report_title' => 'sometimes|string|max:100',
            'status_report' => 'sometimes|string|max:100',
            'completion_goal' => 'nullable|string',
            'today_work' => 'nullable|string',
            'next_steps' => 'nullable|string',
            'issues' => 'nullable|string',
        ]);

        $report->update($validatedData);
        return response()->json($report);
    }

    /**
     * Remove the specified report from storage.
     *
     * @param  Report  $report
     */
    public function destroy(Report $report)
    {
        $report->delete();
        return response()->json();
    }
}

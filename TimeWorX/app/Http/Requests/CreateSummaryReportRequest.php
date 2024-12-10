<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateSummaryReportRequest extends FormRequest
{
    /**
     * Xác định người dùng có quyền thực hiện yêu cầu này hay không.
     */
    public function authorize(): bool
    {
        return true; // Để kiểm tra quyền, có thể thêm logic tại đây
    }

    /**
     * Quy tắc xác thực cho yêu cầu này.
     */
    public function rules(): array
    {
        return [
            'project_id' => 'required|exists:projects,project_id',
            'name' => 'required|string',
            'report_date' => 'required|date',
            'summary' => 'required|string',
            'completed_tasks' => 'nullable|string',
            'upcoming_tasks' => 'nullable|string',
            'project_issues' => 'nullable|string',
            'report_files' => 'required|array',
            'report_files.*' => 'required|string',
        ];
    }


    /**
     * Tùy chỉnh thông báo lỗi (nếu cần).
     */
    public function messages(): array
    {
        return [
            'project_id.required' => 'Dự án là bắt buộc.',
            'project_id.exists' => 'Dự án không tồn tại.',
            'name.required' => 'Tên báo cáo là bắt buộc.',
            'reported_by_user_id.required' => 'Người báo cáo là bắt buộc.',
            'reported_by_user_id.exists' => 'Người báo cáo không tồn tại.',
            'report_date.required' => 'Ngày báo cáo là bắt buộc.',
            'report_date.date' => 'Ngày báo cáo không đúng định dạng.',
            'summary.required' => 'Tóm tắt báo cáo là bắt buộc.',
            'report_files.required' => 'Danh sách file báo cáo là bắt buộc.',
            'report_files.array' => 'Danh sách file báo cáo phải là một mảng.',
            'report_files.*.required' => 'File báo cáo không được để trống.',
            'report_files.*.string' => 'File báo cáo phải là một chuỗi ký tự.',
        ];
    }
}

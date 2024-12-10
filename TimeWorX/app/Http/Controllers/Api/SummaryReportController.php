<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SummaryReport;
use App\Http\Requests\CreateSummaryReportRequest;
use Illuminate\Http\Request;
use App\Services\ReportZipper;

class SummaryReportController extends Controller
{
    protected ReportZipper $zipper;

    public function __construct(ReportZipper $zipper)
    {
        $this->zipper = $zipper;
    }

    /**
     * Tạo báo cáo tổng hợp và nén file.
     *
     * @param CreateSummaryReportRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createSummaryReport(CreateSummaryReportRequest $request)
    {
        try {
            $validated = $request->validated();

            // Lấy user_id từ Auth
            $userId = $request->user()->id; // Lấy ID của người dùng đã xác thực qua Sanctum

            // Thêm user_id vào dữ liệu validated
            $validated['reported_by_user_id'] = $userId;

            // Gọi hàm createWithZip để tạo báo cáo và file ZIP
            $summaryReport = SummaryReport::createWithZip($validated, $this->zipper);

            return response()->json([
                'message' => 'Summary report created successfully!',
                'summary_report' => $summaryReport,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create summary report.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Lấy danh sách summary reports với tìm kiếm và bộ lọc.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSummaryReports(Request $request)
    {
        $userId = $request->user()->id; // Lấy user ID từ Auth
        if (!$userId) {
            return response()->json([
                'message' => 'Unauthorized access. User not authenticated.',
            ], 401); // Trả về mã lỗi 401 nếu không xác thực
        }

        // Lấy dữ liệu tìm kiếm và lọc
        $search = $request->input('search', null); // Tìm kiếm theo tên báo cáo
        $startDate = $request->input('start_date', null); // Ngày bắt đầu
        $endDate = $request->input('end_date', null); // Ngày kết thúc

        // Query cơ bản
        $query = SummaryReport::where('reported_by_user_id', $userId);

        // Tìm kiếm theo tên
        if ($search) {
            $query->where('name', 'LIKE', '%' . $search . '%');
        }

        // Bộ lọc theo ngày
        if ($startDate) {
            $query->where('report_date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('report_date', '<=', $endDate);
        }

        // Phân trang kết quả
        $summaryReports = $query->orderBy('report_date', 'desc')->paginate(10);

        return response()->json($summaryReports);
    }

    /**
     * Lấy thông tin chi tiết của một summary report.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSummaryReportById(Request $request,int $id)
    {
        $userId = $request->user()->id; // Lấy user ID từ Auth
        if (!$userId) {
            return response()->json([
                'message' => 'Unauthorized access. User not authenticated.',
            ], 401); // Trả về mã lỗi 401 nếu không xác thực
        }
        try {
            // Tìm summary report theo id
            $summaryReport = SummaryReport::where('summary_report_id', $id)
            ->where('reported_by_user_id', $userId)
            ->first();

            // Kiểm tra nếu không tìm thấy báo cáo hoặc báo cáo không thuộc về user này
            if (!$summaryReport) {
                return response()->json([
                    'message' => 'Forbidden. You do not have access to this report.',
                ], 403); // Trả về mã lỗi 403 nếu không có quyền truy cập
            }

            return response()->json([
                'message' => 'Summary report fetched successfully!',
                'summary_report' => $summaryReport,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch summary report.',
                'error' => $e->getMessage(),
            ], 404); // 404 nếu không tìm thấy
        }
    }

}

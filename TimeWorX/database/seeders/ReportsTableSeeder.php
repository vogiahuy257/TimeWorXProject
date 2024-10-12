<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReportsTableSeeder extends Seeder
{
    /**
     * Seed the 'reports' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('reports')->insert([
            [
                'report_by_user_id' => 1,
                'project_id' => 1, // Liên kết với project_id 1
                'completion_goal' => 'Hoàn thành dự án thiết kế thiệp.', // Mục tiêu cần hoàn thành
                'today_work' => "Đọc tài liệu: 80%\n+ Thêm chức năng của trang tạo thiết kế : Done\n+ Cho phép người dùng kéo thả các field và các text nhập từ ô textarea vào trang canvas : Done\n+ Cho phép người dùng kéo để điều chỉnh vị trí trong canvas : Done", // Công việc hôm nay
                'next_steps' => 'Hoàn thiện trang tạo thiết kế', // Các việc sẽ làm tiếp
                'issues' => 'Không', // Vấn đề gặp phải/khó khăn
            ],
            [
                'report_by_user_id' => 2,
                'project_id' => 2, // Liên kết với project_id 2
                'completion_goal' => 'Hoàn thành báo cáo thường niên.', // Mục tiêu cần hoàn thành
                'today_work' => "Nghiên cứu dữ liệu: 70%\n+ Tạo báo cáo tài chính : Done\n+ Tổng hợp thông tin từ các phòng ban : Done", // Công việc hôm nay
                'next_steps' => 'Xem xét và chỉnh sửa báo cáo', // Các việc sẽ làm tiếp
                'issues' => 'Cần thêm thời gian để tổng hợp dữ liệu.', // Vấn đề gặp phải/khó khăn
            ],
        ]);
    }
}

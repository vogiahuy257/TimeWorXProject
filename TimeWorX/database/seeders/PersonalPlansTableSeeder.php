<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;  // Đảm bảo đã import model User

class PersonalPlansTableSeeder extends Seeder
{
    /**
     * Seed the 'personal_plans' table.
     *
     * @return void
     */
    public function run()
    {
        // Lấy user_id của user 1 và user 2
        $user1 = User::where('name', 'Cheese')->first();  // Tìm User 1
        $user2 = User::where('name', 'Huy')->first();  // Tìm User 2

        // Kiểm tra xem các user có tồn tại không trước khi insert dữ liệu
        if ($user1 && $user2) {
            // Dùng Eloquent để thêm các kế hoạch cá nhân
            DB::table('personal_plans')->insert([
                [
                    'user_id' => $user1->id,
                    'plan_name' => 'Plan A',
                    'plan_description' => 'Description for Plan A.',
                    'start_date' => '2024-01-01',
                    'end_date' => '2024-06-30',
                    'plan_status' => 'to-do',
                    'plan_priority' => 'High',
                ],
                [
                    'user_id' => $user2->id,
                    'plan_name' => 'Plan B',
                    'plan_description' => 'Description for Plan B.',
                    'start_date' => '2024-03-01',
                    'end_date' => '2024-12-31',
                    'plan_status' => 'in-progress',
                    'plan_priority' => 'Medium',
                ],
            ]);
        }
    }
}

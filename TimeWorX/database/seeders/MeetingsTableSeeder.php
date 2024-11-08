<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;  // Đảm bảo đã import model User

class MeetingsTableSeeder extends Seeder
{
    /**
     * Seed the 'meetings' table.
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
            // Dùng Eloquent để thêm meeting
            DB::table('meetings')->insert([
                [
                    'meeting_name' => 'Kickoff Meeting',
                    'meeting_description' => 'Initial meeting for project kickoff.',
                    'meeting_date' => '2024-01-10',
                    'meeting_time' => '10:00:00',
                    'created_by_user_id' => $user1->id,  // user_id từ user1
                    'meeting_type' => 'Project',
                ],
                [
                    'meeting_name' => 'Weekly Standup',
                    'meeting_description' => 'Weekly team standup meeting.',
                    'meeting_date' => '2024-01-17',
                    'meeting_time' => '09:00:00',
                    'created_by_user_id' => $user2->id,  // user_id từ user2
                    'meeting_type' => 'Team',
                ],
            ]);
        }
    }
}

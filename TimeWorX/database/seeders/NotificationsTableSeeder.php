<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;  // Đảm bảo đã import model User

class NotificationsTableSeeder extends Seeder
{
    /**
     * Seed the 'notifications' table.
     *
     * @return void
     */
    public function run()
    {
        // Lấy user_id của user 1 và user 2
        $user1 = User::find(1);  // Tìm user với user_id = 1
        $user2 = User::where('name', 'Huy')->first();   // Tìm user với user_id = 2

        // Kiểm tra xem các user có tồn tại không trước khi insert dữ liệu
        if ($user1 && $user2) {
            // Dùng Eloquent để thêm thông báo
            DB::table('notifications')->insert([
                [
                    'user_id' => $user1->id,  // user_id từ user1
                    'notification_type' => 'Task',
                    'message' => 'You have a new task assigned.',
                    'notification_date' => now(),
                    'read_status' => false,
                    'link' => '/tasks/1',
                ],
                [
                    'user_id' => $user2->id,  // user_id từ user2
                    'notification_type' => 'Meeting',
                    'message' => 'New meeting scheduled for tomorrow.',
                    'notification_date' => now(),
                    'read_status' => false,
                    'link' => '/meetings/1',
                ],
            ]);
        }
    }
}

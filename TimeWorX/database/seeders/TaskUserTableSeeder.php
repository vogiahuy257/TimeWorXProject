<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class TaskUserTableSeeder extends Seeder
{
    /**
     * Seed the 'task_user' table.
     *
     * @return void
     */
    public function run()
    {
        // Lấy user_id của User 1, 2, 3
        $user1 = User::find(1);  // Tìm User 1
        $user2 = User::where('name', 'Huy')->first()->id;  // Tìm User 2
        $user3 = User::find(3);  // Tìm User 3

        // Kiểm tra nếu các User tồn tại
        if ($user1 && $user2 && $user3) {
            DB::table('task_user')->insert([
                [
                    'task_id' => 1,
                    'user_id' => $user1->id,  // Giao cho User 1
                ],
                [
                    'task_id' => 1,
                    'user_id' => $user2->id,  // Giao cho User 2
                ],
                [
                    'task_id' => 2,
                    'user_id' => $user2->id,  // Giao cho User 2
                ],
                [
                    'task_id' => 3,
                    'user_id' => $user3->id,  // Giao cho User 3
                ],
                [
                    'task_id' => 4,
                    'user_id' => $user1->id,  // Giao cho User 1
                ],
                [
                    'task_id' => 5,
                    'user_id' => $user2->id,  // Giao cho User 2
                ],
                [
                    'task_id' => 6,
                    'user_id' => $user3->id,  // Giao cho User 3
                ],
                [
                    'task_id' => 7,
                    'user_id' => $user2->id,  // Giao cho User 2
                ],
                [
                    'task_id' => 8,
                    'user_id' => $user1->id,  // Giao cho User 1
                ],
            ]);
        }
    }
}

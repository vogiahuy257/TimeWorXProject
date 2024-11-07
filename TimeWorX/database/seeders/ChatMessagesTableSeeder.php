<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;  // Đảm bảo đã import model User

class ChatMessagesTableSeeder extends Seeder
{
    /**
     * Seed the 'chat_messages' table.
     *
     * @return void
     */
    public function run()
    {
        // Lấy user_id của user 1 và user 2
        $user1 = User::find(1);  // Tìm user với user_id = 1
        $user2 = User::where('name', 'Huy')->first();    // Tìm user với user_id = 2

        // Kiểm tra sự tồn tại của user
        if ($user1 && $user2) {
            // Thêm các tin nhắn chat
            DB::table('chat_messages')->insert([
                [
                    'sender_id' => $user1->id,  // Lấy sender_id từ user1
                    'receiver_id' => $user2->id,  // Lấy receiver_id từ user2
                    'message_content' => 'Hello! How are you?',
                    'sent_at' => now(),
                    'is_read' => false,
                ],
                [
                    'sender_id' => $user2->id,  // Lấy sender_id từ user2
                    'receiver_id' => $user1->id,  // Lấy receiver_id từ user1
                    'message_content' => 'I am good, thank you!',
                    'sent_at' => now(),
                    'is_read' => false,
                ],
            ]);
        }
    }
}

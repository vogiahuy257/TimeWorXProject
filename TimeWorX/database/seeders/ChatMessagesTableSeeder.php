<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChatMessagesTableSeeder extends Seeder
{
    /**
     * Seed the 'chat_messages' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('chat_messages')->insert([
            [
                'sender_id' => 1,
                'receiver_id' => 2,
                'message_content' => 'Hello! How are you?',
                'sent_at' => now(),
                'is_read' => false,
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 1,
                'message_content' => 'I am good, thank you!',
                'sent_at' => now(),
                'is_read' => false,
            ],
        ]);
    }
}

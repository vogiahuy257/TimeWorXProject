<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationsTableSeeder extends Seeder
{
    /**
     * Seed the 'notifications' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('notifications')->insert([
            [
                'user_id' => 1,
                'notification_type' => 'Task',
                'message' => 'You have a new task assigned.',
                'notification_date' => now(),
                'read_status' => false,
                'link' => '/tasks/1',
            ],
            [
                'user_id' => 2,
                'notification_type' => 'Meeting',
                'message' => 'New meeting scheduled for tomorrow.',
                'notification_date' => now(),
                'read_status' => false,
                'link' => '/meetings/1',
            ],
        ]);
    }
}

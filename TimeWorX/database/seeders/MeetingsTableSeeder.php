<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MeetingsTableSeeder extends Seeder
{
    /**
     * Seed the 'meetings' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('meetings')->insert([
            [
                'meeting_name' => 'Kickoff Meeting',
                'meeting_description' => 'Initial meeting for project kickoff.',
                'meeting_date' => '2024-01-10',
                'meeting_time' => '10:00:00',
                'created_by_user_id' => 1,
                'meeting_type' => 'Project',
            ],
            [
                'meeting_name' => 'Weekly Standup',
                'meeting_description' => 'Weekly team standup meeting.',
                'meeting_date' => '2024-01-17',
                'meeting_time' => '09:00:00',
                'created_by_user_id' => 2,
                'meeting_type' => 'Team',
            ],
        ]);
    }
}

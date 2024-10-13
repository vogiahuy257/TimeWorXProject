<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UsersTableSeeder::class,
            ProjectsTableSeeder::class,
            TasksTableSeeder::class,
            TaskCommentsTableSeeder::class,
            MeetingsTableSeeder::class,
            NotificationsTableSeeder::class,
            ChatMessagesTableSeeder::class,
            EmployeePerformanceTableSeeder::class,
            PersonalPlansTableSeeder::class,
            ReportsTableSeeder::class,
            TaskUserTableSeeder::class
        ]);
    }
}

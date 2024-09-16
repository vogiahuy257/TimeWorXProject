<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TasksTableSeeder extends Seeder
{
    /**
     * Seed the 'tasks' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tasks')->insert([
            [
                'project_id' => 1,
                'task_name' => 'Task 1',
                'task_description' => 'Description for Task 1.',
                'status_id' => 1,
                'assigned_to_user_id' => 1,
                'task_status_name' => 'In Progress',
            ],
            [
                'project_id' => 2,
                'task_name' => 'Task 2',
                'task_description' => 'Description for Task 2.',
                'status_id' => 2,
                'assigned_to_user_id' => 2,
                'task_status_name' => 'Not Started',
            ],
        ]);
    }
}

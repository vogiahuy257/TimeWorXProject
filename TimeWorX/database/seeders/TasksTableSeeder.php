<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
                'status_key' => 'in-progress', 
                'assigned_to_user_id' => 2,
                'deadline' => Carbon::now()->addDays(5),  
            ],
            [
                'project_id' => 1,
                'task_name' => 'Task 2',
                'task_description' => 'Description for Task 2.',
                'status_key' => 'to-do',
                'assigned_to_user_id' => 2,
                'deadline' => Carbon::now()->addDays(7),  
            ],
            [
                'project_id' => 1,
                'task_name' => 'Task 3',
                'task_description' => 'Description for Task 3.',
                'status_key' => 'done',
                'assigned_to_user_id' => 2,
                'deadline' => Carbon::now()->addDays(10), 
            ],
            [
                'project_id' => 2,
                'task_name' => 'Task 4',
                'task_description' => 'Description for Task 4.',
                'status_key' => 'in-progress',
                'assigned_to_user_id' => 2,
                'deadline' => Carbon::now()->addDays(3), 
            ],
            [
                'project_id' => 1,
                'task_name' => 'Task 5',
                'task_description' => 'Description for Task 5.',
                'status_key' => 'to-do',
                'assigned_to_user_id' => 2,
                'deadline' => Carbon::now()->addDays(8), 
            ],
            [
                'project_id' => 1,
                'task_name' => 'Task 6',
                'task_description' => 'Description for Task 6.',
                'status_key' => 'done',
                'assigned_to_user_id' => 2,
                'deadline' => Carbon::now()->addDays(15),
            ],
            [
                'project_id' => 1,
                'task_name' => 'Task 7',
                'task_description' => 'Description for Task 7.',
                'status_key' => 'in-progress',
                'assigned_to_user_id' => 2,
                'deadline' => Carbon::now()->addDays(2),  
            ],
            [
                'project_id' => 2,
                'task_name' => 'Task 8',
                'task_description' => 'Description for Task 8.',
                'status_key' => 'to-do',
                'assigned_to_user_id' => 1,
                'deadline' => Carbon::now()->addDays(20), 
            ],
        ]);
    }
}

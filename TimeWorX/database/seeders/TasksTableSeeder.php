<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use App\Models\Task;
use App\Models\User;
use App\Models\Project;

class TasksTableSeeder extends Seeder
{
    /**
     * Seed the 'tasks' table.
     *
     * @return void
     */
    public function run()
    {
        // Lấy user_id của các user
        $user1 = User::where('name', 'Cheese')->first();  // Tìm User 1
        $user2 = User::where('name', 'Huy')->first();  // Tìm User 2
        $user3 = User::where('name', 'Heotest')->first();

        // Lấy project_id của các project
        $project1 = Project::find(1);  // Project 1
        $project2 = Project::find(2);  // Project 2

        // Kiểm tra xem các user và project có tồn tại không
        if ($user1 && $user2 && $user3 && $project1 && $project2) {
            // Dùng Eloquent để tạo các task
            Task::create([
                'project_id' => $project1->project_id,
                'task_name' => 'Task 1',
                'task_description' => 'Description for Task 1.',
                'status_key' => 'in-progress',
                'assigned_to_user_id' => $user2->id,
                'deadline' => Carbon::now()->addDays(5),
            ]);

            Task::create([
                'project_id' => $project1->project_id,
                'task_name' => 'Task 2',
                'task_description' => 'Description for Task 2.',
                'status_key' => 'to-do',
                'assigned_to_user_id' => $user2->id,
                'deadline' => Carbon::now()->addDays(7),
            ]);

            Task::create([
                'project_id' => $project1->project_id,
                'task_name' => 'Task 3',
                'task_description' => 'Description for Task 3.',
                'status_key' => 'done',
                'assigned_to_user_id' => $user2->id,
                'deadline' => Carbon::now()->addDays(10),
            ]);

            Task::create([
                'project_id' => $project2->project_id,
                'task_name' => 'Task 4',
                'task_description' => 'Description for Task 4.',
                'status_key' => 'in-progress',
                'assigned_to_user_id' => $user2->id,
                'deadline' => Carbon::now()->addDays(3),
            ]);

            Task::create([
                'project_id' => $project1->project_id,
                'task_name' => 'Task 5',
                'task_description' => 'Description for Task 5.',
                'status_key' => 'to-do',
                'assigned_to_user_id' => $user2->id,
                'deadline' => Carbon::now()->addDays(8),
            ]);

            Task::create([
                'project_id' => $project1->project_id,
                'task_name' => 'Task 6',
                'task_description' => 'Description for Task 6.',
                'status_key' => 'done',
                'assigned_to_user_id' => $user2->id,
                'deadline' => Carbon::now()->addDays(15),
            ]);

            Task::create([
                'project_id' => $project1->project_id,
                'task_name' => 'Task 7',
                'task_description' => 'Description for Task 7.',
                'status_key' => 'in-progress',
                'assigned_to_user_id' => $user2->id,
                'deadline' => Carbon::now()->addDays(2),
            ]);

            Task::create([
                'project_id' => $project2->project_id,
                'task_name' => 'Task 8',
                'task_description' => 'Description for Task 8.',
                'status_key' => 'to-do',
                'assigned_to_user_id' => $user1->id,
                'deadline' => Carbon::now()->addDays(20),
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskUserTableSeeder extends Seeder
{
    /**
     * Seed the 'task_user' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('task_user')->insert([
            [
                'task_id' => 1, // Task 1
                'user_id' => 1, // Giao cho User 1
            ],
            [
                'task_id' => 1, // Task 1
                'user_id' => 2,
            ],
            [
                'task_id' => 2, // Task 2
                'user_id' => 2, 
            ],
            [
                'task_id' => 3, // Task 3
                'user_id' => 3, 
            ],
            [
                'task_id' => 4, // Task 4
                'user_id' => 1, 
            ],
            [
                'task_id' => 5, // Task 5
                'user_id' => 2, 
            ],
            [
                'task_id' => 6, // Task 6
                'user_id' => 3,
            ],
            [
                'task_id' => 7, // Task 7
                'user_id' => 2, 
            ],
            [
                'task_id' => 8, // Task 8
                'user_id' => 1,
            ],
        ]);
    }
}

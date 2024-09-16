<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskCommentsTableSeeder extends Seeder
{
    /**
     * Seed the 'task_comments' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('task_comments')->insert([
            [
                'task_id' => 1,
                'comment_text' => 'This is a comment on Task 1.',
                'user_id' => 1,
            ],
            [
                'task_id' => 2,
                'comment_text' => 'This is a comment on Task 2.',
                'user_id' => 2,
            ],
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeePerformanceTableSeeder extends Seeder
{
    /**
     * Seed the 'employee_performance' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('employee_performance')->insert([
            [
                'user_id' => 1,
                'task_id' => 1,
                'performance_score' => 85.50,
                'feedback' => 'Good performance on Task 1.',
                'review_date' => now(),
            ],
            [
                'user_id' => 2,
                'task_id' => 2,
                'performance_score' => 90.75,
                'feedback' => 'Excellent work on Task 2.',
                'review_date' => now(),
            ],
        ]);
    }
}

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
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReportsTableSeeder extends Seeder
{
    /**
     * Seed the 'reports' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('reports')->insert([
            [
                'report_by_user_id' => 1,
                'project_id' => 1, // Liên kết với project_id 1
                'report_title' => 'Monthly Report',
                'report_description' => 'Description for Monthly Report.',
                'status_report' => 'A', // Status can be 'A' for Active or other values
            ],
            [
                'report_by_user_id' => 2,
                'project_id' => 2, // Liên kết với project_id 2
                'report_title' => 'Annual Report',
                'report_description' => 'Description for Annual Report.',
                'status_report' => 'I', // Status can be 'I' for Inactive or other values
            ],
        ]);
    }
}

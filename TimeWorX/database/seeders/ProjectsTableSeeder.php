<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectsTableSeeder extends Seeder
{
    /**
     * Seed the 'projects' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('projects')->insert([
            [
                'project_name' => 'Project Alpha',
                'project_description' => 'Description for Project Alpha.',
                'start_date' => '2024-01-01',
                'end_date' => '2024-12-31',
                'project_priority' => 'High',
                'project_status' => 'verify',
                'project_manager' => 2,
            ],
            [
                'project_name' => 'Project Beta',
                'project_description' => 'Description for Project Beta.',
                'start_date' => '2024-06-01',
                'end_date' => '2024-12-31',
                'project_priority' => 'Medium',
                'project_status' => 'in-progress',
                'project_manager' => 2,
            ],
            [
                'project_name' => 'Project Gamma',
                'project_description' => 'Description for Project Gamma.',
                'start_date' => '2024-08-01',
                'end_date' => '2024-12-15',
                'project_priority' => 'Low',
                'project_status' => 'to-do',
                'project_manager' => 2,
            ],
            [
                'project_name' => 'Project Delta',
                'project_description' => 'Description for Project Delta.',
                'start_date' => '2024-02-01',
                'end_date' => '2024-11-30',
                'project_priority' => 'High',
                'project_status' => 'done',
                'project_manager' => 2,
            ],
        ]);
        
    }
}

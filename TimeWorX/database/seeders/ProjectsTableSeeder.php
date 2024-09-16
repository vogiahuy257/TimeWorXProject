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
                'project_status' => 'Ongoing',
                'project_manager' => 1,
            ],
            [
                'project_name' => 'Project Beta',
                'project_description' => 'Description for Project Beta.',
                'start_date' => '2024-06-01',
                'end_date' => '2024-12-31',
                'project_priority' => 'Medium',
                'project_status' => 'Planning',
                'project_manager' => 2,
            ],
        ]);
    }
}

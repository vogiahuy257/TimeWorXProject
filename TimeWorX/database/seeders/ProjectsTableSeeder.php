<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
                'start_date' => Carbon::now()->addDays(5),
                'end_date' => Carbon::now()->addDays(15),
                'project_priority' => 'High',
                'project_status' => 'verify',
                'project_manager' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'project_name' => 'Project Beta',
                'project_description' => 'Description for Project Beta.',
                'start_date' => Carbon::now()->addDays(5),
                'end_date' => Carbon::now()->addDays(15),
                'project_priority' => 'Medium',
                'project_status' => 'done',
                'project_manager' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'project_name' => 'Project Gamma',
                'project_description' => 'Description for Project Gamma.',
                'start_date' => Carbon::now()->addDays(5),
                'end_date' => Carbon::now()->addDays(15),
                'project_priority' => 'Low',
                'project_status' => 'done',
                'project_manager' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'project_name' => 'Project Delta',
                'project_description' => 'Description for Project Delta.',
                'start_date' => Carbon::now()->addDays(5),
                'end_date' => Carbon::now()->addDays(15),
                'project_priority' => 'High',
                'project_status' => 'done',
                'project_manager' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
        
    }
}

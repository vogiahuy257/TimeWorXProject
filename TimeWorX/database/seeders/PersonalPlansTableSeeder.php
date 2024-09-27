<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PersonalPlansTableSeeder extends Seeder
{
    /**
     * Seed the 'personal_plans' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('personal_plans')->insert([
            [
                'user_id' => 1,
                'plan_name' => 'Plan A',
                'plan_description' => 'Description for Plan A.',
                'start_date' => '2024-01-01',
                'end_date' => '2024-06-30',
                'plan_status' => 'Active',
                'plan_priority' => 'High',
            ],
            [
                'user_id' => 2,
                'plan_name' => 'Plan B',
                'plan_description' => 'Description for Plan B.',
                'start_date' => '2024-03-01',
                'end_date' => '2024-12-31',
                'plan_status' => 'Pending',
                'plan_priority' => 'Medium',
            ],
        ]);
    }
}

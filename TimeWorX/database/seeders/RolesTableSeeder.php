<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
{
    /**
     * Seed the 'roles' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            [
                'role_name' => 'Admin',
                'role_description' => 'Administrator with full access.',
            ],
            [
                'role_name' => 'User',
                'role_description' => 'Regular user with limited access.',
            ]
        ]);
    }
}

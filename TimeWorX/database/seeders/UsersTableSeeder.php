<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Seed the 'users' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'Heotest',
                'email' => '2224802010822@student.tdmu.edu.vn',
                'password' => Hash::make('12345678'),
                'profile_picture' => 'path/to/profile.jpg',
                'role' => 'Admin',
            ],
            [
                'name' => 'Huy',
                'email' => 'vogiahuy257@gmail.com',
                'password' => Hash::make('22042004'),
                'profile_picture' => 'path/to/profile2.jpg',
                'role' => 'Admin',
            ],
            [
                'name' => 'Cheese',
                'email' => '2224802010476@student.tdmu.edu.vn',
                'password' => Hash::make('22042004'),
                'profile_picture' => 'path/to/profile2.jpg',
                'role' => 'Admin',
            ],
        ]);
    }
}

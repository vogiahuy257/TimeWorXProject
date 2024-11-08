<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


class UsersTableSeeder extends Seeder
{
    /**
     * Seed the 'users' table.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Heotest',
            'email' => '2224802010822@student.tdmu.edu.vn',
            'password' => Hash::make('12345678'),
            'profile_picture' => 'path/to/profile.jpg',
            'role' => 'User',
        ]);

        User::create([
            'name' => 'Huy',
            'email' => 'vogiahuy257@gmail.com',
            'password' => Hash::make('22042004'),
            'profile_picture' => 'path/to/profile2.jpg',
            'role' => 'Admin',
        ]);

        User::create([
            'name' => 'Cheese',
            'email' => '2224802010476@student.tdmu.edu.vn',
            'password' => Hash::make('30082004'),
            'profile_picture' => 'path/to/profile2.jpg',
            'role' => 'Admin',
        ]);

        User::create([
            'name' => 'Trân',
            'email' => 'lngbaotran2204@gmail.com',
            'password' => Hash::make('30082004'),
            'profile_picture' => 'path/to/profile2.jpg',
            'role' => 'User',
        ]);

        // Tạo thêm 10 người dùng bằng create()
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => "User$i",  // String interpolation
                'email' => "user$i@example.com",  // String interpolation
                'password' => Hash::make("password$i"),  // String interpolation
                'profile_picture' => "path/to/profile$i.jpg",  // String interpolation
                'role' =>  'User',  // String interpolation
            ]);
        }
    }
}

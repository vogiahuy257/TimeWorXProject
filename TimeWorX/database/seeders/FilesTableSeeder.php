<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FilesTableSeeder extends Seeder
{
    /**
     * Seed the 'files' table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('files')->insert([
            [
                'file_name' => 'Document1.pdf',
                'uploaded_by' => 1,
                'uploaded_at' => now(),
                'project_id' => 1,
                'file_type' => 'pdf',
                'file_path' => 'path/to/document1.pdf',
            ],
            [
                'file_name' => 'Image1.jpg',
                'uploaded_by' => 2,
                'uploaded_at' => now(),
                'project_id' => 2,
                'file_type' => 'jpg',
                'file_path' => 'path/to/image1.jpg',
            ],
        ]);
    }
}

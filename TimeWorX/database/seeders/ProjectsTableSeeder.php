<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\User;  // Import model User

class ProjectsTableSeeder extends Seeder
{
    /**
     * Seed the 'projects' table.
     *
     * @return void
     */
    public function run()
    {
        // Lấy user thứ 2
        $user = User::where('name', 'Huy')->first(); 

        // Kiểm tra nếu user thứ 2 tồn tại
        if ($user) {
            // Gán user_id của user thứ 2 vào project_manager
            $projectManagerId = $user->id;

            // Chèn dữ liệu vào bảng projects
            DB::table('projects')->insert([
                [
                    'project_name' => 'Project Alpha',
                    'project_description' => 'Description for Project Alpha.',
                    'start_date' => Carbon::now()->addDays(5),
                    'end_date' => Carbon::now()->addDays(15),
                    'project_priority' => 'High',
                    'project_status' => 'verify',
                    'project_manager' => $projectManagerId, // Gán project_manager là user_id của user thứ 2
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
                    'project_manager' => $projectManagerId, // Gán project_manager là user_id của user thứ 2
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
                    'project_manager' => $projectManagerId, // Gán project_manager là user_id của user thứ 2
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
                    'project_manager' => $projectManagerId, // Gán project_manager là user_id của user thứ 2
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ],
            ]);
        } else {
            // Nếu không tìm thấy user thứ 2
            echo "User thứ 2 không tồn tại.\n";
        }
    }
}

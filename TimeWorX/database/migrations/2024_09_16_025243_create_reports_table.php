<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id('report_id'); // Primary key
            $table->foreignId('report_by_user_id')->constrained('users', 'id')->onDelete('cascade'); // Foreign key to 'users' table
            $table->foreignId('project_id')->constrained('projects', 'project_id')->onDelete('cascade'); // Foreign key to 'projects' table
            $table->foreignId('task_id')->nullable()->constrained('tasks', 'task_id')->onDelete('set null');// report không nhất tiết phải mang task_id 
            $table->timestamps(); // created_at, updated_at
            $table->softDeletes();

            $table->boolean('isLink');
            $table->string('completion_goal')->nullable(); // Mục tiêu cần hoàn thành
            $table->string('today_work')->nullable(); // Công việc hôm nay
            $table->string('next_steps')->nullable(); // Các việc sẽ làm tiếp
            $table->string('issues')->nullable(); // Vấn đề gặp phải/khó khăn
        });

        // Schema::create('summary_reports', function (Blueprint $table) {
        //     $table->id('summary_report_id');
        //     $table->unsignedBigInteger('report_id')->nullable();
        //     $table->unsignedBigInteger('project_id')->nullable();
        //     $table->string('status')->nullable(); //trạng thái
        //     $table->string('priority')->nullable();// Độ ưu tiên của báo cáo
        //     $table->string('drive_link')->nullable(); // Đường dẫn Google Drive cho tài liệu báo cáo
        //     $table->timestamps(); // ngày tạo báo cáo
        //     $table->softDeletes();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};

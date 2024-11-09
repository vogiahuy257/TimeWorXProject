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
            $table->uuid('report_by_user_id'); // Foreign key to 'users' table
            $table->foreignId('project_id')->constrained('projects', 'project_id')->onDelete('cascade'); // Foreign key to 'projects' table
            $table->foreignId('task_id')->nullable()->constrained('tasks', 'task_id')->onDelete('set null');// report không nhất tiết phải mang task_id 
            $table->timestamps(); // created_at, updated_at
            $table->softDeletes();

            $table->boolean('isLink');
            $table->string('completion_goal')->nullable(); // Mục tiêu cần hoàn thành
            $table->string('today_work')->nullable(); // Công việc hôm nay
            $table->string('next_steps')->nullable(); // Các việc sẽ làm tiếp
            $table->string('issues')->nullable(); // Vấn đề gặp phải/khó khăn

            $table->foreign('report_by_user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('report_comments', function (Blueprint $table) {
            $table->id('comment_id'); // Primary key
            $table->foreignId('task_id')->constrained('tasks', 'task_id')->onDelete('cascade'); // Foreign key to 'tasks' table
            $table->uuid('comment_by_user_id'); // Foreign key to 'users' table

            $table->text('comment'); // Nội dung bình luận
            $table->boolean('is_project_manager')->default(false); // Phân biệt giữa staff và manager
            $table->timestamps(); // created_at, updated_at

            $table->foreign('comment_by_user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');

        Schema::dropIfExists('report_comments');
    }
};

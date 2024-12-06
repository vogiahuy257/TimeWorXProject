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
        Schema::create('projects', function (Blueprint $table) {
            $table->id('project_id'); // Primary key
            $table->string('project_name', 100); // Project name
            $table->text('project_description')->nullable(); // Project description
            $table->date('start_date'); // Project start date
            $table->date('end_date')->nullable(); // Project end date (nullable)
            $table->timestamps();
            $table->string('project_priority', 20)->nullable(); // Project priority
            $table->string('project_status', 200)->nullable(); // Project status
            $table->uuid('project_manager'); // Chuyển từ foreignId sang uuid
            $table->softDeletes();

            $table->boolean('is_flagged')->default(false); // Cờ pinh thông báo project có thay đổi
            $table->foreign('project_manager')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('project_user', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('project_id')->constrained('projects', 'project_id')->onDelete('cascade'); // Khóa ngoại tới bảng projects
            $table->uuid('user_id');  // Khóa ngoại tới bảng users
            $table->boolean('is_project_manager')->default(false); // Đánh dấu người dùng có phải là project manager hay không
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
        
        Schema::dropIfExists('project_user');
    }
};

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
            $table->foreignId('project_manager')->constrained('users', 'id')->onDelete('cascade'); // Foreign key to users table
            $table->softDeletes();
        });

        Schema::create('project_user', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('project_id')->constrained('projects', 'project_id')->onDelete('cascade'); // Khóa ngoại tới bảng projects
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Khóa ngoại tới bảng users
            $table->boolean('is_project_manager')->default(false); // Đánh dấu người dùng có phải là project manager hay không
            $table->timestamps();
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

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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id('task_id'); // Primary key
            $table->foreignId('project_id')->constrained('projects', 'project_id')->onDelete('cascade'); // Foreign key to 'projects' table
            $table->string('task_name', 100); // Task name
            $table->text('task_description')->nullable(); // Task description
            $table->integer('status_id'); // Status ID
            $table->timestamps(); // created_at, updated_at
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users', 'id')->onDelete('set null'); // Foreign key to 'users' table
            $table->softDeletes();
            $table->string('task_status_name', 200)->nullable(); // Task status name
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};

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
            $table->id('task_id'); 
            $table->foreignId('project_id')->constrained('projects', 'project_id')->onDelete('cascade'); // Foreign key to 'projects' table
            $table->string('task_name', 100); 
            $table->text('task_description')->nullable(); 
            $table->string('status_key', 20)->nullable();
            $table->date('deadline')->nullable(); 
            $table->timestamps();
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users', 'id')->onDelete('set null'); // Foreign key to 'users' table
            $table->softDeletes();
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

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
        Schema::dropIfExists('task_user');
        Schema::create('task_user', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('task_id')->constrained('tasks', 'task_id')->onDelete('cascade'); // Foreign key to 'tasks' table
            $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade'); // Foreign key to 'users' table
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_user');
    }
};

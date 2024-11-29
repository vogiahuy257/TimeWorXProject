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
        Schema::create('employee_performance', function (Blueprint $table) {
            $table->id('performance_id'); // Primary key
            $table->uuid('user_id');// Foreign key to 'users' table
            $table->foreignId('task_id')->constrained('tasks', 'task_id')->onDelete('cascade'); // Foreign key to 'tasks' table
            $table->decimal('performance_score', 5, 2); // Performance score
            $table->text('feedback')->nullable(); // Feedback (nullable)
            $table->timestamp('review_date')->useCurrent(); // Review date


            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_performance');
    }
};

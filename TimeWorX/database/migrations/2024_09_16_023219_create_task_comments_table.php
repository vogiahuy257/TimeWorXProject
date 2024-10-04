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
        Schema::create('task_comments', function (Blueprint $table) {
            $table->id('comment_id'); // Primary key
            $table->foreignId('task_id')->constrained('tasks', 'task_id')->onDelete('cascade'); // Foreign key to 'tasks' table
            $table->text('comment_text'); // Comment text
            $table->timestamp('created_at')->useCurrent(); // Created at
            $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade'); // Foreign key to 'users' table (người bình luận)
            $table->boolean('is_manager_comment')->default(false);
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_comments');
    }
};

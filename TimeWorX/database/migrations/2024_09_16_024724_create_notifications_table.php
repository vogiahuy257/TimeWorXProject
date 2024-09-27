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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('notification_id'); // Primary key
            $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade'); // Foreign key to 'users' table
            $table->string('notification_type', 50); // Notification type
            $table->text('message'); // Notification message
            $table->timestamp('notification_date')->useCurrent(); // Notification date
            $table->boolean('read_status')->default(false); // Read status (0 or 1)
            $table->string('link', 255)->nullable(); // Link for the notification
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};

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
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id('message_id'); // Primary key
            $table->foreignId('sender_id')->constrained('users', 'id')->onDelete('cascade'); // Foreign key to 'users' table
            $table->foreignId('receiver_id')->constrained('users', 'id')->onDelete('cascade'); // Foreign key to 'users' table
            $table->text('message_content'); // Message content
            $table->timestamp('sent_at')->useCurrent(); // Sent at
            $table->boolean('is_read')->default(false); // Read status (0 or 1)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};

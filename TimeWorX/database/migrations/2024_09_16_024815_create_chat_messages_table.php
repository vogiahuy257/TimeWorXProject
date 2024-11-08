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
            $table->uuid('sender_id'); // Chuyển sang UUID cho sender_id
            $table->uuid('receiver_id'); // Foreign key to 'users' table
            $table->text('message_content'); // Message content
            $table->timestamp('sent_at')->useCurrent(); // Sent at
            $table->boolean('is_read')->default(false); // Read status (0 or 1)
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('receiver_id')->references('id')->on('users')->onDelete('cascade');
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

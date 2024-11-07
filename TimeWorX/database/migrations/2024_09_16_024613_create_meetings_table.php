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
        Schema::create('meetings', function (Blueprint $table) {
            $table->id('meeting_id'); // Primary key
            $table->string('meeting_name', 400); // Meeting name
            $table->text('meeting_description')->nullable(); // Meeting description
            $table->date('meeting_date'); // Meeting date
            $table->time('meeting_time'); // Meeting time
            $table->uuid('created_by_user_id'); // Foreign key to 'users' table
            $table->timestamps(); // created_at, updated_at
            $table->string('meeting_type', 60)->nullable(); // Meeting type
            $table->foreign('created_by_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};

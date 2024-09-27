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
        Schema::create('settings', function (Blueprint $table) {
            $table->id('setting_id'); // Primary key
            $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade'); // Foreign key to 'users' table
            $table->string('setting_key', 50); // Setting key
            $table->string('setting_value', 255); // Setting value
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};

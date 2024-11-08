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
        Schema::create('personal_plans', function (Blueprint $table) {
            $table->id('plan_id'); // Primary key
            $table->uuid('user_id'); // Foreign key to 'users' table
            $table->string('plan_name', 100); // Plan name
            $table->text('plan_description')->nullable(); // Plan description (nullable)
            $table->date('start_date'); // Start date
            $table->date('end_date'); // End date
            $table->timestamps(); // created_at, updated_at
            $table->string('plan_status', 20); // Plan status
            $table->string('plan_priority', 20); // Plan priority

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_plans');
    }
};

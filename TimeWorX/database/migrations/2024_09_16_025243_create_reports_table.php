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
        Schema::create('reports', function (Blueprint $table) {
            $table->id('report_id'); // Primary key
            $table->foreignId('report_by_user_id')->constrained('users', 'id')->onDelete('cascade'); // Foreign key to 'users' table
            $table->foreignId('project_id')->constrained('projects', 'project_id')->onDelete('cascade'); // Foreign key to 'projects' table
            $table->string('report_title', 100); // Report title
            $table->timestamps(); // created_at, updated_at
            $table->text('report_description')->nullable(); // Report description (nullable)
            $table->string('status_report', 100); // Status report
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};

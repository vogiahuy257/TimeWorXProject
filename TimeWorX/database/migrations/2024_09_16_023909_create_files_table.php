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
        Schema::create('files', function (Blueprint $table) {
            $table->id('file_id'); // Primary key
            $table->string('file_name', 255); // File name
            $table->foreignId('uploaded_by')->constrained('users', 'id')->onDelete('cascade'); // Foreign key to 'users' table
            $table->timestamp('uploaded_at')->useCurrent(); // Uploaded at
            $table->foreignId('project_id')->constrained('projects', 'project_id')->onDelete('cascade'); // Foreign key to 'projects' table
            $table->string('file_type', 60); 
            $table->string('file_path', 255); // File path
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};

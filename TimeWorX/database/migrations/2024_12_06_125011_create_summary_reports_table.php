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
        Schema::create('summary_reports', function (Blueprint $table) {
            $table->id('summary_report_id'); // Primary key
            $table->foreignId('project_id')->nullable()->constrained('projects', 'project_id')->onDelete('set null'); // Foreign key to 'projects' table, set to null when project is deleted
            $table->uuid('reported_by_user_id'); // Foreign key to 'users' table (the manager or admin who created the report)
            $table->date('report_date'); // Ngày báo cáo
            $table->text('summary'); // Tóm tắt báo cáo dự án
            $table->text('completed_tasks')->nullable(); // Các công việc đã hoàn thành
            $table->text('upcoming_tasks')->nullable(); // Các công việc sắp tới
            $table->text('project_issues')->nullable(); // Các vấn đề của dự án
            $table->timestamps(); // created_at, updated_at
            $table->softDeletes(); // Soft delete for future flexibility

            $table->foreign('reported_by_user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('summary_reports');
    }
};
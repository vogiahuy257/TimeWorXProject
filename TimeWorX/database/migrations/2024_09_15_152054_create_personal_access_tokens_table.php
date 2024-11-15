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
        Schema::dropIfExists('personal_access_tokens');
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->uuid('tokenable_id'); // Đổi tokenable_id thành uuid
            $table->string('tokenable_type'); // Vẫn giữ tokenable_type như cũ
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            // Thiết lập foreign key với bảng users (hoặc các bảng khác nếu cần)
            $table->foreign('tokenable_id')
                  ->references('id')
                  ->on('users') // Hoặc bảng khác nếu không phải bảng users
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};

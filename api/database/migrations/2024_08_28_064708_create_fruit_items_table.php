<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateFruitItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fruit_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->integer('quantity');
            $table->decimal('price', 8, 2);
            $table->timestamps();
        });

        // Chèn dữ liệu mẫu vào bảng fruit_items
        DB::table('fruit_items')->insert([
            ['user_id' => 1, 'name' => 'Apple', 'quantity' => 100, 'price' => 1.00],
            ['user_id' => 1, 'name' => 'Banana', 'quantity' => 150, 'price' => 0.75],
            ['user_id' => 2, 'name' => 'Cherry', 'quantity' => 200, 'price' => 2.00],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fruit_items');
    }
}

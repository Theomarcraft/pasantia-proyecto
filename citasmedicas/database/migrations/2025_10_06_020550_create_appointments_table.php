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
    Schema::create('appointments', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id');
        $table->unsignedBigInteger('doctor_id')->nullable();
        $table->unsignedBigInteger('service_id')->nullable();
        $table->dateTime('appointment_date');
        $table->text('description')->nullable();
        $table->string('status')->default('pendiente');
        $table->timestamps();

        // Relaciones
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('doctor_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('service_id')->references('id')->on('services')->onDelete('set null');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};

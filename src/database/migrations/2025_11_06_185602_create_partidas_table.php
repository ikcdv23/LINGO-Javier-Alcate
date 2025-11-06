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
        Schema::create('partidas', function (Blueprint $table) {
            $table->id();
            
            // Clave foránea para saber qué usuario jugó
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // El resultado del juego (true si ganó, false si perdió)
            $table->boolean('ganada');
            
            // Opcional: la palabra que se intentaba adivinar
            $table->string('palabra_secreta')->nullable(); 
            
            $table->timestamps(); // Cuándo se jugó
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partidas');
    }
};
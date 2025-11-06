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
        // Esta es la parte importante:
        Schema::table('users', function (Blueprint $table) {
            // Añadimos la racha actual, que se resetea
            $table->integer('current_streak')->default(0);
            
            // Añadimos la mejor racha histórica para el ranking
            $table->integer('max_streak')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Esto es para poder deshacer el cambio
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['current_streak', 'max_streak']);
        });
    }
};
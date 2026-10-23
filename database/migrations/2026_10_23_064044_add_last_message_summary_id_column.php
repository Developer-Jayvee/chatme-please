<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    CONST COLUMN_NAME = 'last_message_summary_id';
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if(Schema::hasColumn('conversations',self::COLUMN_NAME)) return;

        Schema::table('conversations', function (Blueprint $table) {
            $table->unsignedBigInteger(self::COLUMN_NAME)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if(! Schema::hasColumn('conversations',self::COLUMN_NAME)) return;
        Schema::dropColumns('conversations',self::COLUMN_NAME);
    }
};

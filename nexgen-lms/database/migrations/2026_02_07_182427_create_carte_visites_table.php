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
        Schema::create('carte_visites', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rep_id')->constrained('representants')->onDelete('cascade');

            // Core Info
            $table->string('model')->nullable();
            $table->date('date_commande');
            $table->string('nom_sur_carte'); // nom
            $table->string('fonction')->nullable();
            $table->string('tel')->nullable();
            $table->string('email')->nullable();
            $table->text('adresse')->nullable();
            $table->text('autre_info')->nullable(); // autre
            $table->string('logo_path')->nullable(); // logo

            // Chevalet Specific (3 Lines of text)
            $table->string('chevalet_ligne_1')->nullable();
            $table->string('chevalet_ligne_2')->nullable();
            $table->string('chevalet_ligne_3')->nullable();

            // Design & Validation
            $table->string('conception_carte')->nullable(); // conception
            $table->boolean('is_valide_carte')->default(false); // valider
            $table->string('conception_chevalet')->nullable();
            $table->boolean('is_valide_chevalet')->default(false); // valider_chevalet

            // Comments
            $table->text('comment_cv')->nullable();
            $table->text('comment_chevalet')->nullable();
            $table->text('remarques')->nullable();

            // Workflow Status (Production & Delivery)
            $table->boolean('prod_carte')->default(false);
            $table->boolean('livraison_carte')->default(false);
            $table->boolean('recu_carte')->default(false);
            $table->boolean('prod_chevalet')->default(false);
            $table->boolean('livraison_chevalet')->default(false);
            $table->boolean('recu_chevalet')->default(false);

            $table->string('annee_scolaire')->nullable();
            $table->boolean('is_deleted')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carte_visites');
    }
};

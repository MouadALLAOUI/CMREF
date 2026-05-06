<?php

namespace App\Observers;

use App\Models\Fact;
use App\Models\Depot;
use App\Models\BLivraisonItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InvoiceObserver
{
    public function updated(Fact $fact)
    {
        if ($fact->wasChanged('livree') && $fact->livree === true) {
            DB::transaction(function () use ($fact) {
                $this->deductStockFromDepot($fact);
            });
        }
    }

    private function deductStockFromDepot(Fact $fact)
    {
        $repId = $fact->rep_id ?? null;
        
        if (!$repId) {
            Log::warning("Invoice {$fact->id} has no representative ID");
            return;
        }

        $depot = Depot::firstOrCreate(
            ['rep_id' => $repId],
            ['season_id' => $fact->season_id, 'entity_type' => $fact->entity_type]
        );

        $lineItems = $fact->details ?: [];

        foreach ($lineItems as $item) {
            $livreId = $item['livre_id'] ?? $item['livre']['id'] ?? null;
            $quantite = (int) ($item['quantite'] ?? 0);

            if (!$livreId || $quantite <= 0) {
                continue;
            }

            $depotItem = BLivraisonItem::where('b_livraison_id', $depot->id)
                ->where('livre_id', $livreId)
                ->first();

            if ($depotItem) {
                $newQuantite = max(0, $depotItem->quantite - $quantite);
                $depotItem->update(['quantite' => $newQuantite]);
            } else {
                BLivraisonItem::create([
                    'b_livraison_id' => $depot->id,
                    'livre_id' => $livreId,
                    'quantite' => -$quantite,
                    'season_id' => $fact->season_id,
                    'entity_type' => $fact->entity_type,
                ]);
            }

            Log::info("Deducted {$quantite} from depot {$depot->id} for book {$livreId}");
        }
    }

    public function deleted(Fact $fact)
    {
        if ($fact->livree) {
            // Could implement stock restoration logic here
        }
    }
}

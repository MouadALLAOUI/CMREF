<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CahierCommunicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rep_id' => $this->rep_id,
            'representant_nom' => $this->representant->nom ?? 'N/A',
            'ecole' => $this->ecole,
            'type' => $this->type,
            'qte' => $this->qte,
            'date_commande' => $this->date_commande->format('Y-m-d'),
            'status' => [
                'accepted' => $this->is_accepted,
                'printed' => $this->is_printed,
                'delivered' => $this->is_delivered,
            ],
            'files' => [
                'recto' => $this->model_recto,
                'verso' => $this->model_verso,
                'bc' => $this->bon_de_commande,
            ],
            'remarques' => $this->remarques,
            'annee_scolaire' => $this->annee_scolaire,
            'created_at' => $this->created_at->diffForHumans(),
        ];
    }
}

<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBLivraisonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rep_id' => 'sometimes|uuid|exists:representants,id',
            'bl_number' => 'sometimes|string|max:50',
            'date_emission' => 'sometimes|date',
            'mode_envoi' => 'nullable|string',
            'type' => 'sometimes|in:Livre,Specimen,Pedagogie,Retour',
            'annee' => 'nullable|string',
            'statut_recu' => 'sometimes|boolean',
            'statut_vu' => 'sometimes|boolean',
            'status' => 'nullable|in:Pending,Seen,Received',
            'remarks' => 'nullable|string',
        ];
    }
}

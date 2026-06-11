<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreBLivraisonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rep_id' => 'required|uuid|exists:representants,id',
            'bl_number' => 'required|string|max:50',
            'date_emission' => 'required|date',
            'mode_envoi' => 'nullable|string',
            'type' => 'required|in:Livre,Specimen,Pedagogie,Retour',
            'details' => 'required|array|min:1',
            'details.*.livre_id' => 'required|uuid|exists:livres,id',
            'details.*.qte' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'rep_id.required' => 'Le représentant est obligatoire.',
            'rep_id.exists' => 'Ce représentant n\'existe pas.',
            'bl_number.required' => 'Le numéro de BL est obligatoire.',
            'date_emission.required' => 'La date d\'émission est obligatoire.',
            'type.required' => 'Le type est obligatoire.',
            'type.in' => 'Le type doit être Livre, Specimen, Pedagogie ou Retour.',
            'details.required' => 'Au moins un livre doit être sélectionné.',
            'details.min' => 'Au moins un livre doit être sélectionné.',
            'details.*.livre_id.required' => 'Chaque ligne doit avoir un livre.',
            'details.*.qte.required' => 'La quantité est obligatoire pour chaque ligne.',
            'details.*.qte.min' => 'La quantité doit être au moins 1.',
        ];
    }
}

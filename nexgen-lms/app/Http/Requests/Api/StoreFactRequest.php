<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rep_id' => 'required|uuid|exists:representants,id',
            'sequence_id' => 'required|integer|exists:fact_sequences,id',
            'year_session' => 'required|string|max:9',
            'number' => [
                'required',
                'integer',
                Rule::unique('fact')->where(fn ($query) => $query->where('year_session', $this->year_session)),
            ],
            'fact_number' => 'nullable|string|max:50|unique:fact',
            'date_facture' => 'required|date',
            'total_ht' => 'sometimes|numeric|min:0',
            'tva_rate' => 'sometimes|numeric|min:0',
            'total_ttc' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:Brouillon,Validée,Payée,Annulée',
            'remarques' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'rep_id.required' => 'Le représentant est obligatoire.',
            'sequence_id.required' => 'La séquence est obligatoire.',
            'year_session.required' => 'L\'année scolaire est obligatoire.',
            'number.required' => 'Le numéro est obligatoire.',
            'number.unique' => 'Ce numéro existe déjà pour cette année scolaire.',
            'date_facture.required' => 'La date de facture est obligatoire.',
        ];
    }
}

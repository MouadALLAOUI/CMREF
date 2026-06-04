<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class TransformDemandeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => 'required|uuid|exists:demande_f,id',
        ];
    }

    public function messages(): array
    {
        return [
            'id.required' => 'L\'identifiant de la demande est obligatoire.',
            'id.exists' => 'Cette demande n\'existe pas.',
        ];
    }
}

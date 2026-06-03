<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRepresentantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'cin' => 'required|string|max:20|unique:representants',
            'destination_id' => 'nullable|uuid|exists:destinations,id',
            'tel' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255|unique:representants',
            'adresse' => 'nullable|string',
            'code_postale' => 'nullable|string|max:10',
            'ville' => 'nullable|string|max:100',
            'lieu_de_travail' => 'nullable|string|max:255',
            'bl_count' => 'sometimes|integer|min:0',
            'remb_count' => 'sometimes|integer|min:0',
            'login' => 'required|string|max:100|unique:logins,username',
            'password' => 'required|string|min:8',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom est obligatoire.',
            'cin.required' => 'Le CIN est obligatoire.',
            'cin.unique' => 'Ce CIN existe déjà.',
            'login.required' => 'Le login est obligatoire.',
            'login.unique' => 'Ce login existe déjà.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
        ];
    }
}

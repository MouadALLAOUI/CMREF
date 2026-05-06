<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fact;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use App\Http\Resources\FactResource;

class FactController extends Controller
{
    public function index()
    {
        $facts = Fact::with(['representant', 'sequence', 'details.livre.category'])->get();
        return FactResource::collection($facts);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'rep_id' => 'required|uuid|exists:representants,id',
            'sequence_id' => 'required|integer|exists:fact_sequences,id',
            'year_session' => 'required|string|max:9',
            'number' => [
                'required',
                'integer',
                Rule::unique('fact')->where(fn($query) => $query->where('year_session', $request->year_session))
            ],
            'fact_number' => 'nullable|string|max:50|unique:fact',
            'date_facture' => 'required|date',
            'total_ht' => 'sometimes|numeric|min:0',
            'tva_rate' => 'sometimes|numeric|min:0',
            'total_ttc' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:Brouillon,Validée,Payée,Annulée',
            'remarques' => 'nullable|string',
        ]);

        $fact = Fact::create($validatedData);
        return new FactResource($fact);
    }

    public function show($id)
    {
        $fact = Fact::findOrFail($id);
        return new FactResource($fact);
    }

    public function update(Request $request, $id)
    {
        $fact = Fact::findOrFail($id);

        $validatedData = $request->validate([
            'rep_id' => 'sometimes|uuid|exists:representants,id',
            'sequence_id' => 'sometimes|integer|exists:fact_sequences,id',
            'year_session' => 'sometimes|string|max:9',
            'number' => [
                'sometimes',
                'integer',
                Rule::unique('fact')->where(fn($query) => $query->where('year_session', $request->year_session ?? $fact->year_session))->ignore($fact->id)
            ],
            'fact_number' => 'sometimes|string|max:50|unique:fact,fact_number,' . $fact->id,
            'date_facture' => 'sometimes|date',
            'total_ht' => 'sometimes|numeric|min:0',
            'tva_rate' => 'sometimes|numeric|min:0',
            'total_ttc' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:Brouillon,Validée,Payée,Annulée',
            'remarques' => 'nullable|string',
        ]);

        $fact->update($validatedData);

        return new FactResource($fact);
    }

    public function destroy($id)
    {
        $fact = Fact::findOrFail($id);
        $fact->delete();

        return response()->json(null, 204);
    }
}
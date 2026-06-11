<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fact;
use App\Models\DetFact;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

use App\Http\Resources\FactResource;

class FactController extends Controller
{
    public function index(Request $request)
    {
        $facts = Fact::with(['representant', 'sequence', 'details.livre.category'])->latest()->get();
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

        // Validate invoice amounts if any financial field is being updated
        if (isset($validatedData['total_ht']) || isset($validatedData['total_ttc']) || isset($validatedData['tva_rate'])) {
            $this->validateInvoiceAmounts($fact, $validatedData);
        }

        $fact->update($validatedData);

        return new FactResource($fact);
    }

    private function validateInvoiceAmounts(Fact $fact, array $data): void
    {
        $totalHt = $data['total_ht'] ?? $fact->total_ht;
        $tvaRate = $data['tva_rate'] ?? $fact->tva_rate;
        $totalTtc = $data['total_ttc'] ?? $fact->total_ttc;

        // Calculate expected total_ttc from total_ht and tva_rate
        $expectedTtc = round($totalHt * (1 + $tvaRate / 100), 2);

        // Allow small rounding differences (0.01)
        if (abs($totalTtc - $expectedTtc) > 0.01) {
            throw ValidationException::withMessages([
                'total_ttc' => "Total TTC ({$totalTtc}) does not match calculated amount ({$expectedTtc}) from total_ht ({$totalHt}) and TVA rate ({$tvaRate}%).",
            ]);
        }
    }

    public function destroy($id)
    {
        $fact = Fact::findOrFail($id);
        $fact->delete();

        return response()->json(null, 204);
    }
}

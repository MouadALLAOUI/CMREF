<?php

namespace App\Observers;

use App\Models\Fact;
use Illuminate\Validation\ValidationException;

class FactObserver
{
    private array $validTransitions = [
        'Brouillon' => ['Validée', 'Annulée'],
        'Validée' => ['Payée', 'Annulée'],
        'Payée' => [],
        'Annulée' => [],
    ];

    public function updating(Fact $fact)
    {
        $this->validateStatus($fact);
    }

    private function validateStatus(Fact $fact): void
    {
        if ($fact->isDirty('status')) {
            $oldStatus = $fact->getOriginal('status');
            $newStatus = $fact->status;

            if (!isset($this->validTransitions[$oldStatus])) {
                throw ValidationException::withMessages([
                    'status' => "Invalid current status: {$oldStatus}.",
                ]);
            }

            if (!in_array($newStatus, $this->validTransitions[$oldStatus])) {
                throw ValidationException::withMessages([
                    'status' => "Cannot transition from '{$oldStatus}' to '{$newStatus}'.",
                ]);
            }
        }
    }
}

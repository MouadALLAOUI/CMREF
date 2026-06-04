<?php

namespace App\Observers;

use App\Models\BLivraison;
use Illuminate\Validation\ValidationException;

class BLivraisonObserver
{
    private array $validTransitions = [
        'statut_recu' => [
            'from' => false,
            'to' => true,
        ],
        'statut_vu' => [
            'from' => false,
            'to' => true,
        ],
        'status' => [
            'Pending' => ['Seen', 'Received'],
            'Seen' => ['Received'],
            'Received' => [],
        ],
    ];

    public function updating(BLivraison $blivraison)
    {
        $this->validateStatutRecu($blivraison);
        $this->validateStatutVu($blivraison);
        $this->validateStatus($blivraison);
    }

    private function validateStatutRecu(BLivraison $blivraison): void
    {
        if ($blivraison->isDirty('statut_recu')) {
            $oldValue = $blivraison->getOriginal('statut_recu');
            $newValue = $blivraison->statut_recu;

            if ($oldValue === true && $newValue === false) {
                throw ValidationException::withMessages([
                    'statut_recu' => 'Cannot revert statut_recu from true to false.',
                ]);
            }
        }
    }

    private function validateStatutVu(BLivraison $blivraison): void
    {
        if ($blivraison->isDirty('statut_vu')) {
            $oldValue = $blivraison->getOriginal('statut_vu');
            $newValue = $blivraison->statut_vu;

            if ($oldValue === true && $newValue === false) {
                throw ValidationException::withMessages([
                    'statut_vu' => 'Cannot revert statut_vu from true to false.',
                ]);
            }
        }
    }

    private function validateStatus(BLivraison $blivraison): void
    {
        if ($blivraison->isDirty('status')) {
            $oldStatus = $blivraison->getOriginal('status');
            $newStatus = $blivraison->status;

            if (!isset($this->validTransitions['status'][$oldStatus])) {
                throw ValidationException::withMessages([
                    'status' => "Invalid current status: {$oldStatus}.",
                ]);
            }

            if (!in_array($newStatus, $this->validTransitions['status'][$oldStatus])) {
                throw ValidationException::withMessages([
                    'status' => "Cannot transition from '{$oldStatus}' to '{$newStatus}'.",
                ]);
            }
        }
    }
}

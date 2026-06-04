<?php

namespace App\Observers;

use App\Models\RembImp;
use Illuminate\Validation\ValidationException;

class RembImpObserver
{
    public function updating(RembImp $rembImp)
    {
        $this->validateStatutRecu($rembImp);
        $this->validateStatutRejete($rembImp);
        $this->validateMutualExclusivity($rembImp);
    }

    private function validateStatutRecu(RembImp $rembImp): void
    {
        if ($rembImp->isDirty('statut_recu')) {
            $oldValue = $rembImp->getOriginal('statut_recu');
            $newValue = $rembImp->statut_recu;

            if ($oldValue === true && $newValue === false) {
                throw ValidationException::withMessages([
                    'statut_recu' => 'Cannot revert statut_recu from true to false.',
                ]);
            }
        }
    }

    private function validateStatutRejete(RembImp $rembImp): void
    {
        if ($rembImp->isDirty('statut_rejete')) {
            $oldValue = $rembImp->getOriginal('statut_rejete');
            $newValue = $rembImp->statut_rejete;

            if ($oldValue === true && $newValue === false) {
                throw ValidationException::withMessages([
                    'statut_rejete' => 'Cannot revert statut_rejete from true to false.',
                ]);
            }
        }
    }

    private function validateMutualExclusivity(RembImp $rembImp): void
    {
        $statutRecu = $rembImp->statut_recu;
        $statutRejete = $rembImp->statut_rejete;

        if ($statutRecu === true && $statutRejete === true) {
            throw ValidationException::withMessages([
                'statut_recu' => 'A payment cannot be both received and rejected.',
                'statut_rejete' => 'A payment cannot be both received and rejected.',
            ]);
        }
    }
}

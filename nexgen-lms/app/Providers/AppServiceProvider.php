<?php

namespace App\Providers;

use App\Models\Fact;
use App\Models\DemandeF;
use App\Models\BLivraison;
use App\Models\RembImp;
use App\Observers\InvoiceObserver;
use App\Observers\DemandeFObserver;
use App\Observers\BLivraisonObserver;
use App\Observers\FactObserver;
use App\Observers\RembImpObserver;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        // Register observers
        Fact::observe(InvoiceObserver::class);
        Fact::observe(FactObserver::class);
        DemandeF::observe(DemandeFObserver::class);
        BLivraison::observe(BLivraisonObserver::class);
        RembImp::observe(RembImpObserver::class);
    }
}

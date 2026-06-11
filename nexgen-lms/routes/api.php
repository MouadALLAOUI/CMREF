<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\BLivraisonController;
use App\Http\Controllers\Api\BLivraisonImpController;
use App\Http\Controllers\Api\BLivraisonItemController;
use App\Http\Controllers\Api\BVentesClientController;
use App\Http\Controllers\Api\CahierCommunicationController;
use App\Http\Controllers\Api\CarteVisiteController;
use App\Http\Controllers\Api\CatalogueController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ClientRemboursementController;
use App\Http\Controllers\Api\DemandeFController;
use App\Http\Controllers\Api\DepotController;
use App\Http\Controllers\Api\DetFactController;
use App\Http\Controllers\Api\FactController;
use App\Http\Controllers\Api\FactSequenceController;
use App\Http\Controllers\Api\ImprimeurController;
use App\Http\Controllers\Api\LivreController;
use App\Http\Controllers\Api\RembImpController;
use App\Http\Controllers\Api\RepRemboursementController;
use App\Http\Controllers\Api\RepresentantController;
use App\Http\Controllers\Api\RobotController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\BanqueController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\FacturationController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\SeasonController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\CahierTemplateController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\EmailController;
use App\Http\Controllers\Api\InvitationController;

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });


// --- Public Routes ---
Route::post('/login', [LoginController::class, 'login']);
Route::get('/reverb-status', function () {
    return response()->json([
        'reverb_trigger' => config('broadcasting.reverb_trigger')
    ]);
});

// 1. Allow public access ONLY to view all seasons (and optionally a single season)
Route::get('/seasons', [SeasonController::class, 'index']);
Route::get('/seasons/{season}', [SeasonController::class, 'show']);

// --- Protected Routes (Requires Sanctum Token) ---

Route::middleware('auth:sanctum')->group(function () {

    // ─── Shared Routes (accessible by all authenticated roles) ───

    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    Route::post('/active_compte', [LoginController::class, 'active_compte'])->name('active_compte');
    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
            'profile' => $request->user()->profile,
            'reverb_trigger' => config('broadcasting.reverb_trigger')
        ]);
    })->name('user');
    Route::put('/user/password', [LoginController::class, 'updatePassword'])->name('user.password');

    // ─── Non-season-scoped resources (reference / catalog / system) ───
    Route::apiResource('livres', LivreController::class)->middleware('read_only_rep');
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('catalogues', CatalogueController::class)->middleware('read_only_rep');
    Route::apiResource('categories', CategoryController::class)->middleware('read_only_rep');
    Route::apiResource('contents', ContentController::class)->middleware('read_only_rep');
    Route::apiResource('destinations', DestinationController::class)->middleware('read_only_rep');
    Route::apiResource('fact-sequences', FactSequenceController::class)->middleware('read_only_rep');
    Route::apiResource('robots', RobotController::class);
    Route::apiResource('banques', BanqueController::class)->middleware('read_only_rep');
    Route::apiResource('cahier-templates', CahierTemplateController::class)->middleware('read_only_rep');

    // ─── Season-scoped resources (auto-filtered by FilterByActiveSeason middleware) ───
    Route::middleware('season')->group(function () {
        Route::apiResource('b-livraisons', BLivraisonController::class);
        Route::apiResource('b-livraison-items', BLivraisonItemController::class);
        Route::apiResource('b-ventes-clients', BVentesClientController::class);
        Route::apiResource('cahier-communications', CahierCommunicationController::class);
        Route::apiResource('carte-visites', CarteVisiteController::class);
        Route::apiResource('client-remboursements', ClientRemboursementController::class);
        Route::apiResource('demande-f', DemandeFController::class);
        Route::apiResource('depots', DepotController::class);
        Route::apiResource('det-fact', DetFactController::class);
        Route::apiResource('factures', FactController::class);
        Route::apiResource('rep-remboursements', RepRemboursementController::class);
    });

    // Representative-specific shared routes
    Route::get('/representants/{id}/depot', [DepotController::class, 'byRepresentant']);
    Route::put('/representants/{id}/status', [RepresentantController::class, 'updateStatus']);

    // Facturation transformation
    Route::post('/demande-f/{id}/transform', [FacturationController::class, 'transform']);

    // Active season (read-only for all auth users)
    Route::get('/seasons/active', [SeasonController::class, 'active']);

    // ─── Admin-Only Routes ───

    Route::middleware('admin')->group(function () {

        // Emailing & invitations (admin only)
        Route::post('/emails/send', [EmailController::class, 'send']);
        Route::get('/emails/history', [EmailController::class, 'history']);
        Route::post('/invitations', [InvitationController::class, 'store']);
        Route::get('/invitations', [InvitationController::class, 'index']);
        Route::post('/invitations/accept', [InvitationController::class, 'accept']);

        // Admin & user management
        Route::apiResource('admins', AdminController::class);
        Route::apiResource('users', UserController::class);

        // Supplier resources (admin only)
        Route::apiResource('imprimeurs', ImprimeurController::class);
        Route::middleware('season')->group(function () {
            Route::apiResource('remb-imps', RembImpController::class);
            Route::apiResource('b-livraison-imps', BLivraisonImpController::class);
            Route::delete('b-livraison-imps/bulk-delete/{id}', [BLivraisonImpController::class, 'destroyGroup']);
        });

        // Season CRUD (index/show are public; create/update/delete are admin-only)
        Route::apiResource('seasons', SeasonController::class)->except(['index', 'show']);

        // Settings (generic key-value store)
        Route::get('/settings', [SettingController::class, 'index']);
        Route::get('/settings/{key}', [SettingController::class, 'show']);
        Route::post('/settings', [SettingController::class, 'store']);
        Route::put('/settings', [SettingController::class, 'update']);

        // Season activation
        Route::post('/seasons/set-active', [SeasonController::class, 'setActive']);

        // Representative CRUD
        Route::apiResource('representants', RepresentantController::class);

        // Activity Logs (audit trail)
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
        Route::get('/activity-logs/{id}', [ActivityLogController::class, 'show']);
        Route::get('/activity-logs/subject/{type}/{id}', [ActivityLogController::class, 'getBySubject']);
    });

    // ─── Representative-Only Routes ───
    // (reserved for future rep-specific endpoints;
    //  most rep operations use the shared routes above with scoped queries)

    Route::middleware('rep')->group(function () {
        //
    });
});

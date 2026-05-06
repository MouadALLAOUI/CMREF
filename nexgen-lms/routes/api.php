<?php

use App\Http\Controllers\Api\AuthController;
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

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });


// --- Public Routes ---
Route::post('/login', [LoginController::class, 'login']);

// --- Protected Routes (Requires Sanctum Token) ---
// Route::middleware('admin')->group(function () {

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    Route::post('/active_compte', [LoginController::class, 'active_compte'])->name('active_compte');
    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
            'profile' => $request->user()->profile
        ]);
    })->name('user');

    // Bulk API Resources
    Route::apiResource('livres', LivreController::class);
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('representants', RepresentantController::class);
    Route::apiResource('b-livraisons', BLivraisonController::class);
    Route::apiResource('b-livraison-imps', BLivraisonImpController::class);
    Route::delete('b-livraison-imps/bulk-delete/{id}', [BLivraisonImpController::class, 'destroyGroup']);
    Route::apiResource('b-livraison-items', BLivraisonItemController::class);
    Route::apiResource('b-ventes-clients', BVentesClientController::class);
    Route::apiResource('cahier-communications', CahierCommunicationController::class);
    Route::apiResource('carte-visites', CarteVisiteController::class);
    Route::apiResource('catalogues', CatalogueController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('client-remboursements', ClientRemboursementController::class);
    Route::apiResource('contents', ContentController::class);
    Route::apiResource('demande-f', DemandeFController::class);
    Route::apiResource('depots', DepotController::class);
    Route::apiResource('det-fact', DetFactController::class);
    Route::apiResource('destinations', DestinationController::class);
    Route::apiResource('factures', FactController::class);
    Route::apiResource('fact-sequences', FactSequenceController::class);
    Route::apiResource('imprimeurs', ImprimeurController::class);
    Route::apiResource('remb-imps', RembImpController::class);
    Route::apiResource('rep-remboursements', RepRemboursementController::class);
    Route::apiResource('robots', RobotController::class);
    Route::apiResource('admins', AdminController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('banques', BanqueController::class);
    Route::apiResource('seasons', SeasonController::class);

    // Settings API
    Route::get('/settings', [SettingController::class, 'index']);
    Route::get('/settings/{key}', [SettingController::class, 'show']);
    Route::post('/settings', [SettingController::class, 'store']);
    Route::put('/settings', [SettingController::class, 'update']);

    // Season management
    Route::get('/seasons/active', [SeasonController::class, 'active']);
    Route::post('/seasons/set-active', [SeasonController::class, 'setActive']);

    // Representative specific routes
    Route::get('/representants/{id}/depot', [DepotController::class, 'byRepresentant']);
    Route::put('/representants/{id}/status', [RepresentantController::class, 'updateStatus']);

    // Facturation transformation
    Route::post('/demande-f/{id}/transform', [FacturationController::class, 'transform']);
});
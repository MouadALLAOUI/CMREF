<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Http\Resources\AdminResource;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        $admins = Admin::paginate(1000);
        return AdminResource::collection($admins);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'login' => 'required|string|max:100|unique:logins,username',
            'password' => 'required|string|min:8',
        ]);

        $validatedData['password'] = Hash::make($validatedData['password']);

        try {
            $admin = DB::transaction(function () use ($validatedData) {
                $admin = Admin::create([
                    'login' => $validatedData['login'],
                    'password' => $validatedData['password'],
                ]);

                $admin->login()->create([
                    'username' => $validatedData['login'],
                    'password' => $validatedData['password'],
                    'role' => 'admin',
                    'last_visit' => now(),
                ]);

                return $admin;
            });
            return new AdminResource($admin->load('login'));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de l\'administrateur',
                'error' => $e->getMessage()
            ], 500);
        }

        $admin = Admin::create($validatedData);
        return new AdminResource($admin);
    }

    public function show($id)
    {
        $admin = Admin::findOrFail($id);
        return new AdminResource($admin);
    }

    public function update(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);

        $validatedData = $request->validate([
            'login' => 'sometimes|string|max:100|unique:admins,login,' . $admin->id,
            'password' => 'sometimes|string|min:8',
        ]);

        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        $admin->update($validatedData);

        return new AdminResource($admin);
    }

    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);
        $admin->delete();

        return response()->json(null, 204);
    }
}

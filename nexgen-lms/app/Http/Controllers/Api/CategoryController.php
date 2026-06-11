<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

use App\Http\Resources\CategoryResource;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    private const CACHE_KEY = 'categories_all';
    private const CACHE_TTL = 3600;

    public function index(Request $request)
    {
        $categories = Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return Category::orderBy('libelle', 'asc')->get();
        });

        return CategoryResource::collection($categories);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validatedData);
        Cache::forget(self::CACHE_KEY);
        return new CategoryResource($category);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return new CategoryResource($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validatedData = $request->validate([
            'libelle' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update($validatedData);
        Cache::forget(self::CACHE_KEY);

        return new CategoryResource($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        Cache::forget(self::CACHE_KEY);

        return response()->json(null, 204);
    }
}

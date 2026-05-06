<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use Illuminate\Http\Request;
use App\Http\Resources\ContentResource;

class ContentController extends Controller
{
    public function index(Request $request)
    {
        $query = Content::query();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return ContentResource::collection($query->get());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'type' => 'required|string',
            'champ1' => 'nullable|string',
            'champ2' => 'nullable|string',
            'champ3' => 'nullable|string',
        ]);

        $content = Content::create($validatedData);
        return new ContentResource($content);
    }

    public function update(Request $request, $id)
    {
        $content = Content::findOrFail($id);

        $validatedData = $request->validate([
            'type' => 'sometimes|string',
            'champ1' => 'nullable|string',
            'champ2' => 'nullable|string',
            'champ3' => 'nullable|string',
        ]);

        $content->update($validatedData);
        return new ContentResource($content);
    }

    public function destroy($id)
    {
        Content::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}

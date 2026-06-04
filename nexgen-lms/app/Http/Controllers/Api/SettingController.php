<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->keyBy('key');
        return SettingResource::collection($settings->values());
    }

    public function show($key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        return new SettingResource($setting);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
            'settings.*.type' => 'sometimes|string',
            'settings.*.description' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $settingData) {
            Setting::set(
                $settingData['key'],
                $settingData['value'],
                $settingData['type'] ?? 'string',
                $settingData['description'] ?? null
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:settings,key',
            'value' => 'nullable',
            'type' => 'sometimes|string',
            'description' => 'nullable|string',
        ]);

        $setting = Setting::create($validated);
        return response()->json(new SettingResource($setting), 201);
    }
}

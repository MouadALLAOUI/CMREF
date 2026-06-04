<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with('causer');

        if ($request->filled('log_name')) {
            $query->where('log_name', $request->log_name);
        }

        if ($request->filled('subject_type')) {
            $query->where('subject_type', $request->subject_type);
        }

        if ($request->filled('causer_id')) {
            $query->where('causer_id', $request->causer_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $perPage = $request->input('per_page', 50);
        $logs = $query->latest()->paginate($perPage);

        return ActivityLogResource::collection($logs);
    }

    public function show($id)
    {
        $log = Activity::with('causer')->findOrFail($id);
        return new ActivityLogResource($log);
    }

    public function getBySubject($type, $id)
    {
        $logs = Activity::with('causer')
            ->where('subject_type', $type)
            ->where('subject_id', $id)
            ->latest()
            ->get();

        return ActivityLogResource::collection($logs);
    }
}

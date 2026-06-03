<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait PaginatesQueries
{
    /**
     * Paginate a query with configurable page size.
     *
     * Supports ?page= and ?per_page= query params.
     * Defaults to 15 per page, max 100.
     */
    protected function paginateQuery(Builder $query, int $defaultPerPage = 15, int $maxPerPage = 100): LengthAwarePaginator
    {
        $perPage = min(
            (int) request()->query('per_page', $defaultPerPage),
            $maxPerPage
        );
        $page = max(1, (int) request()->query('page', 1));

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Format a paginated result into a standard API response shape.
     *
     * Returns: { data: [...], meta: { current_page, last_page, per_page, total } }
     */
    protected function formatPaginatedResponse(LengthAwarePaginator $paginator): array
    {
        return [
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];
    }
}

<?php

namespace App\Events;

use App\Models\Representant;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RepresentantUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Representant $representant)
    {
        $this->representant->load('login');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [new Channel('representants-channel')];
    }

    public function broadcastAs(): string
    {
        return 'representant.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'representant' => $this->representant->toArray(),
        ];
    }
}

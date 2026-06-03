<?php

namespace App\Jobs;

use App\Mail\SimpleEmail;
use App\Models\EmailLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(
        public string $to,
        public string $subject,
        public string $message,
        public int $userId,
        public string $userType,
    ) {}

    public function handle(): void
    {
        Mail::to($this->to)->send(
            new SimpleEmail($this->subject, $this->message)
        );

        EmailLog::create([
            'destinataire' => $this->to,
            'sujet' => $this->subject,
            'message' => $this->message,
            'type' => 'email',
            'statut' => 'envoyé',
            'emetteur_type' => $this->userType,
            'emetteur_id' => $this->userId,
        ]);
    }

    public function failed(\Throwable $exception): void
    {
        EmailLog::create([
            'destinataire' => $this->to,
            'sujet' => $this->subject,
            'message' => $this->message,
            'type' => 'email',
            'statut' => 'échoué',
            'emetteur_type' => $this->userType,
            'emetteur_id' => $this->userId,
        ]);
    }
}

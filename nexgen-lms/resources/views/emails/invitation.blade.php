<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: #059669;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .content {
            background: #f0fdf4;
            padding: 20px;
            border: 1px solid #bbf7d0;
        }

        .btn {
            display: inline-block;
            background: #059669;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 0;
        }

        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #94a3b8;
        }

        .role {
            background: #d1fae5;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Invitation CMREF</h1>
        </div>
        <div class="content">
            <p>Vous êtes invité à rejoindre la plateforme CMREF en tant que <span
                    class="role">{{ ucfirst($role) }}</span>.</p>

            @if ($customMessage)
                <p><strong>Message :</strong></p>
                <p>{!! nl2br(e($customMessage)) !!}</p>
            @endif


            <p>Cliquez sur le bouton ci-dessous pour créer votre compte :</p>

            <p style="text-align: center;">
                <a href="{{ config('app.frontend_url', 'http://localhost:3000') }}/accept-invitation?token={{ $token }}"
                    class="btn">
                    Accepter l'invitation
                </a>
            </p>

            <p style="font-size: 12px; color: #64748b;">Ce lien expire dans 7 jours.</p>
        </div>
        <div class="footer">
            <p>Ce message a été envoyé depuis l'application CMREF.</p>
        </div>
    </div>
</body>

</html>

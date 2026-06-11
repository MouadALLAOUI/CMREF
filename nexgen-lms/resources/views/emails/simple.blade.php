<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .footer { text-align: center; padding: 10px; font-size: 12px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CMREF</h1>
        </div>
        <div class="content">
            <p>{!! nl2br(e($contentBody)) !!}</p>
        </div>
        <div class="footer">
            <p>Ce message a été envoyé depuis l'application CMREF.</p>
        </div>
    </div>
</body>
</html>

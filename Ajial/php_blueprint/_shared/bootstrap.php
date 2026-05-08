<?php

declare(strict_types=1);

/**
 * Shared helpers for Ajial PHP blueprints.
 *
 * These files are intentionally separate from the static HTML templates. They show
 * how the same screens can be generated dynamically with PDO, prepared
 * statements, and escaped output once a MySQL schema is available.
 */

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

/**
 * Create a PDO connection from environment variables.
 */
function ajial_pdo(): PDO
{
    $dsn = getenv('AJIAL_DSN') ?: 'mysql:host=localhost;dbname=ajial;charset=utf8mb4';
    $user = getenv('AJIAL_DB_USER') ?: 'ajial_app';
    $password = getenv('AJIAL_DB_PASSWORD') ?: '';

    return new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}

/**
 * Escape a value for safe HTML output.
 */
function e(mixed $value): string
{
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Convert blank request values to null.
 */
function nullable_string(?string $value): ?string
{
    $value = $value === null ? null : trim($value);
    return $value === '' ? null : $value;
}

/**
 * Fetch the current authenticated user. In a real application this should be
 * called after login middleware has populated $_SESSION['user_id'].
 */
function current_user(PDO $pdo): array
{
    $userId = (int) ($_SESSION['user_id'] ?? 0);
    if ($userId <= 0) {
        return [
            'id' => 0,
            'name' => 'Utilisateur démo',
            'role' => $_SESSION['role'] ?? 'guest',
            'representant_id' => (int) ($_SESSION['representant_id'] ?? 0),
        ];
    }

    $stmt = $pdo->prepare(
        'SELECT id, nom AS name, role, representant_id FROM utilisateurs WHERE id = :id LIMIT 1'
    );
    $stmt->execute(['id' => $userId]);

    return $stmt->fetch() ?: [
        'id' => $userId,
        'name' => 'Utilisateur',
        'role' => 'guest',
        'representant_id' => 0,
    ];
}

/**
 * Keep only named parameters that are actually present in a SQL statement.
 */
function params_for_sql(string $sql, array $params): array
{
    preg_match_all('/(?<!:):([a-zA-Z_][a-zA-Z0-9_]*)/', $sql, $matches);
    $allowed = array_flip($matches[1] ?? []);
    return array_intersect_key($params, $allowed);
}

/**
 * Execute a prepared SELECT statement and return all rows.
 */
function fetch_rows(PDO $pdo, string $sql, array $params = []): array
{
    $stmt = $pdo->prepare($sql);
    $stmt->execute(params_for_sql($sql, $params));
    return $stmt->fetchAll();
}

/**
 * Execute a prepared SELECT statement and return one row.
 */
function fetch_one(PDO $pdo, string $sql, array $params = []): array
{
    $stmt = $pdo->prepare($sql);
    $stmt->execute(params_for_sql($sql, $params));
    return $stmt->fetch() ?: [];
}

/**
 * Extract the target table name from a simple SELECT used by a blueprint.
 */
function table_name_from_select(string $sql): ?string
{
    if (preg_match('/\bFROM\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/i', $sql, $matches) !== 1) {
        return null;
    }

    return $matches[1];
}

/**
 * Handle simple create forms with CSRF validation and a prepared INSERT.
 */
function handle_form_submission(PDO $pdo, array $page): void
{
    $form = $page['form'] ?? [];
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' || $form === []) {
        return;
    }

    $token = (string) ($_POST['csrf_token'] ?? '');
    if (!hash_equals((string) ($_SESSION['csrf_token'] ?? ''), $token)) {
        $_SESSION['flash_error'] = 'Jeton CSRF invalide.';
        return;
    }

    $table = $form['table'] ?? table_name_from_select((string) ($page['table']['sql'] ?? ''));
    if (!is_string($table) || preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $table) !== 1) {
        $_SESSION['flash_error'] = 'Table cible invalide.';
        return;
    }

    $columns = [];
    $values = [];
    foreach ($form['fields'] ?? [] as $field) {
        $name = (string) ($field['name'] ?? '');
        if (preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $name) !== 1) {
            continue;
        }
        $columns[] = $name;
        $values[$name] = nullable_string($_POST[$name] ?? null);
    }

    if ($columns === []) {
        return;
    }

    $placeholders = array_map(static fn (string $column): string => ':' . $column, $columns);
    $sql = 'INSERT INTO ' . $table . ' (' . implode(', ', $columns) . ') VALUES (' . implode(', ', $placeholders) . ')';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);
    $_SESSION['flash_success'] = 'Enregistrement sauvegardé.';
}

/**
 * Render the common page header used by the blueprints.
 */
function render_page_header(array $page, array $user): void
{
    $title = $page['title'] ?? 'Ajial';
    ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($title) ?></title>
    <link rel="stylesheet" href="/admin/css/bootstrap.css">
    <link rel="stylesheet" href="/admin/css/style.css">
</head>
<body>
<header class="page-header">
    <h1><?= e($page['heading'] ?? $title) ?></h1>
    <p><?= e(($page['greeting'] ?? 'Bienvenue') . ' ' . ($user['name'] ?? '')) ?></p>
</header>
<nav aria-label="Ajial section">
    <a href="/">Accueil</a>
</nav>
<main class="container">
    <?php
}

/**
 * Render the common page footer.
 */
function render_page_footer(): void
{
    ?>
</main>
</body>
</html>
    <?php
}

/**
 * Render cards for summary SQL queries.
 */
function render_summary(PDO $pdo, array $cards, array $params): void
{
    if ($cards === []) {
        return;
    }

    echo '<section class="row summary-cards">';
    foreach ($cards as $card) {
        $row = fetch_one($pdo, $card['sql'], $params);
        $value = $row[$card['value_key'] ?? 'value'] ?? 0;
        echo '<article class="col-md-3 widget">';
        echo '<h2>' . e($card['label']) . '</h2>';
        echo '<strong>' . e($value) . '</strong>';
        echo '</article>';
    }
    echo '</section>';
}

/**
 * Render a search/filter form. Options are loaded with prepared statements.
 */
function render_filters(PDO $pdo, array $filters, array $params): void
{
    if ($filters === []) {
        return;
    }

    echo '<form method="get" class="filters">';
    foreach ($filters as $filter) {
        $name = $filter['name'];
        $current = $_GET[$name] ?? '';
        echo '<label>' . e($filter['label']) . ' ';
        if (isset($filter['options_sql'])) {
            $options = fetch_rows($pdo, $filter['options_sql'], $params);
            echo '<select name="' . e($name) . '">';
            echo '<option value="">Tous</option>';
            foreach ($options as $option) {
                $value = (string) ($option['id'] ?? $option['value'] ?? '');
                $label = (string) ($option['label'] ?? $option['nom'] ?? $value);
                $selected = $value === (string) $current ? ' selected' : '';
                echo '<option value="' . e($value) . '"' . $selected . '>' . e($label) . '</option>';
            }
            echo '</select>';
        } else {
            echo '<input type="text" name="' . e($name) . '" value="' . e($current) . '">';
        }
        echo '</label>';
    }
    echo '<button type="submit">Filtrer</button>';
    echo '</form>';
}

/**
 * Render an input form described by metadata from each blueprint page.
 */
function render_form(array $form): void
{
    if ($form === []) {
        return;
    }

    echo '<section class="form-panel">';
    echo '<h2>' . e($form['title'] ?? 'Formulaire') . '</h2>';
    echo '<form method="post" action="' . e($form['action'] ?? '') . '">';
    echo '<input type="hidden" name="csrf_token" value="' . e($_SESSION['csrf_token'] ?? '') . '">';
    foreach ($form['fields'] ?? [] as $field) {
        echo '<label>' . e($field['label']) . ' ';
        echo '<input type="' . e($field['type'] ?? 'text') . '" name="' . e($field['name']) . '" required>';
        echo '</label>';
    }
    echo '<button type="submit">' . e($form['submit'] ?? 'Enregistrer') . '</button>';
    echo '</form>';
    echo '</section>';
}

/**
 * Render a dynamic table. The SQL is always executed as a prepared statement.
 */
function render_table(PDO $pdo, array $table, array $params): void
{
    if ($table === []) {
        return;
    }

    $rows = fetch_rows($pdo, $table['sql'], $params);
    echo '<section class="table-panel">';
    echo '<h2>' . e($table['title'] ?? 'Liste') . '</h2>';
    echo '<table class="table table-striped table-bordered">';
    echo '<thead><tr>';
    foreach ($table['columns'] as $key => $label) {
        echo '<th>' . e($label) . '</th>';
    }
    echo '</tr></thead><tbody>';
    if ($rows === []) {
        echo '<tr><td colspan="' . count($table['columns']) . '">Données d\'exemple</td></tr>';
    } else {
        foreach ($rows as $row) {
            echo '<tr>';
            foreach ($table['columns'] as $key => $_label) {
                echo '<td>' . e($row[$key] ?? '') . '</td>';
            }
            echo '</tr>';
        }
    }
    echo '</tbody></table>';
    echo '</section>';
}

/**
 * Render a complete blueprint page from a small page configuration.
 */
function render_blueprint_page(array $page): void
{
    $pdo = ajial_pdo();
    $user = current_user($pdo);
    $params = [
        'user_id' => (int) ($user['id'] ?? 0),
        'representant_id' => (int) ($user['representant_id'] ?? 0),
        'today' => date('Y-m-d'),
    ];

    handle_form_submission($pdo, $page);

    render_page_header($page, $user);
    foreach (['flash_success' => 'success', 'flash_error' => 'danger'] as $key => $class) {
        if (!empty($_SESSION[$key])) {
            echo '<div class="alert alert-' . e($class) . '">' . e($_SESSION[$key]) . '</div>';
            unset($_SESSION[$key]);
        }
    }
    echo '<p>' . e($page['description'] ?? '') . '</p>';
    render_summary($pdo, $page['summary'] ?? [], $params);
    render_filters($pdo, $page['filters'] ?? [], $params);
    render_form($page['form'] ?? []);
    render_table($pdo, $page['table'] ?? [], $params);
    render_page_footer();
}

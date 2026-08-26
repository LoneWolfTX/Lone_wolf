<?php
/**
 * Lone Wolf Dumpsters LLC - Admin Password Update API (/api/change-password.php)
 */

session_start();

header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Configuration file missing']);
    exit;
}

$config = require $configPath;
$currentPassword = $config['admin_password'] ?? 'LoneWolf2026!';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$oldPassword = $input['current_password'] ?? '';
$newPassword = $input['new_password'] ?? '';

$isLoggedIn = !empty($_SESSION['lonewolf_admin']) && $_SESSION['lonewolf_admin'] === true;

if (!$isLoggedIn && $oldPassword !== $currentPassword) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized or incorrect current password']);
    exit;
}

if ($oldPassword !== $currentPassword) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Current password does not match']);
    exit;
}

if (strlen($newPassword) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'New password must be at least 6 characters']);
    exit;
}

$config['admin_password'] = $newPassword;

$configContent = "<?php\n/**\n * Lone Wolf Dumpsters LLC - Server-Side Configuration\n * Namecheap cPanel Shared Hosting\n */\n\nreturn " . var_export($config, true) . ";\n";

if (file_put_contents($configPath, $configContent)) {
    $_SESSION['lonewolf_admin'] = true;
    echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to write updated password to config file']);
}

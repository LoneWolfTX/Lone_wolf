<?php
/**
 * Lone Wolf Dumpsters LLC - Forgot Password Email Reset API (/api/forgot-password.php)
 */

session_start();

header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/config.php';
$config = file_exists($configPath) ? require $configPath : [];
$notificationEmail = $config['notification_email'] ?? 'lonewolfdumpsters@gmail.com';
$currentPassword = $config['admin_password'] ?? 'LoneWolf2026!';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$subject = "Lone Wolf Dumpsters - Admin Studio Password Recovery";
$message = "Hello Wayne,\n\nA password recovery request was received for your Lone Wolf Dumpsters Admin Studio.\n\nYour current Admin Studio password is: " . $currentPassword . "\n\nYou can log into your Admin Studio at:\nhttps://lonewolfdumpsters.com/admin/\n\nIf you wish to change your password, log into the Admin Studio and navigate to Security Settings.\n\nThank you,\nLone Wolf Dumpsters System";
$headers = "From: noreply@lonewolfdumpsters.com\r\nReply-To: noreply@lonewolfdumpsters.com\r\nX-Mailer: PHP/" . phpversion();

@mail($notificationEmail, $subject, $message, $headers);

echo json_encode([
    'success' => true,
    'message' => 'Password recovery instructions have been emailed to lonewolf***@gmail.com'
]);

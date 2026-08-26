<?php
/**
 * Lone Wolf Dumpsters LLC - Intake & Contact Handler (/api/contact.php)
 * Architecture: cPanel / Namecheap Shared Hosting Native Backend
 */

error_reporting(0);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed. Use POST.']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || !is_array($data)) {
    $data = $_POST;
}

// Honeypot check
if (!empty($data['website_company_fax']) || !empty($data['honeypot'])) {
    echo json_encode(['success' => true, 'message' => 'Quote request received']);
    exit;
}

$name = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$phone = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
$email = isset($data['email']) ? trim(strip_tags($data['email'])) : '';
$deliveryAddress = isset($data['deliveryAddress']) ? trim(strip_tags($data['deliveryAddress'])) : '';
$service = isset($data['service']) ? trim(strip_tags($data['service'])) : '20 Yard Dumpster';
$projectType = isset($data['projectType']) ? trim(strip_tags($data['projectType'])) : 'General Cleanup';
$preferredDate = isset($data['preferredDate']) ? trim(strip_tags($data['preferredDate'])) : 'As soon as possible';
$notes = isset($data['notes']) ? trim(strip_tags($data['notes'])) : 'None provided';

if (empty($name) || empty($phone) || empty($deliveryAddress)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Please fill out all required fields: Name, Phone, and Delivery Address.',
    ]);
    exit;
}

$recipient = 'lonewolfdumpsters@gmail.com';
$subject = "🐺 New Dumpster Quote Request from " . $name . " (" . $service . ")";

$bodyHtml = '
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>New Quote Request</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #0b0f14; color: #ffffff; padding: 16px; border-radius: 6px; text-align: center; border-bottom: 3px solid #dc2626;">
    <h2 style="margin: 0; color: #ffffff; font-size: 20px; text-transform: uppercase;">Lone Wolf Dumpsters</h2>
    <p style="margin: 4px 0 0 0; font-size: 14px; color: #dc2626;">New Quote Request</p>
  </div>
  <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Customer Name:</td><td>' . htmlspecialchars($name) . '</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold;">Phone Number:</td><td><a href="tel:' . preg_replace('/[^0-9]/', '', $phone) . '">' . htmlspecialchars($phone) . '</a></td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>' . htmlspecialchars($email) . '</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold;">Dumpster Size:</td><td>' . htmlspecialchars($service) . '</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold;">Delivery Address:</td><td>' . htmlspecialchars($deliveryAddress) . '</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold;">Project Type:</td><td>' . htmlspecialchars($projectType) . '</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold;">Preferred Date:</td><td>' . htmlspecialchars($preferredDate) . '</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Notes:</td><td>' . nl2br(htmlspecialchars($notes)) . '</td></tr>
  </table>
</body>
</html>';

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: Lone Wolf Dumpsters Website <noreply@lonewolfdumpsters.com>';
if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers[] = 'Reply-To: ' . $email;
}

$mailSuccess = @mail($recipient, $subject, $bodyHtml, implode("\r\n", $headers));

$logEntry = [
    'id' => 'LW-' . date('ymd') . '-' . substr(md5(uniqid()), 0, 4),
    'timestamp' => date('c'),
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'service' => $service,
    'projectType' => $projectType,
    'debrisType' => 'General',
    'deliveryAddress' => $deliveryAddress,
    'city' => 'DFW',
    'zip' => '',
    'preferredDate' => $preferredDate,
    'rentalDuration' => '3, 5, or 7 Days',
    'preferredContact' => 'Phone / Text',
    'notes' => $notes,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
    'mail_sent' => (bool)$mailSuccess,
];

$logDir = __DIR__ . '/../admin/data';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}
@file_put_contents(
    $logDir . '/leads.log',
    json_encode($logEntry, JSON_UNESCAPED_UNICODE) . "\n",
    FILE_APPEND | LOCK_EX
);

echo json_encode([
    'success' => true,
    'mail_sent' => (bool)$mailSuccess,
    'message' => $mailSuccess 
        ? 'Quote request received successfully. Wayne will contact you shortly.'
        : 'Quote request recorded. Wayne will contact you shortly.',
    'lead_id' => $logEntry['id']
]);
exit;

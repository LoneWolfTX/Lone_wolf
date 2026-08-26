<?php
/**
 * Lone Wolf Dumpsters LLC - Intake & Quote Request Endpoint (/api/quote.php)
 * Architecture: cPanel / Namecheap Shared Hosting Native Backend
 */

error_reporting(0);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

// 1. Enforce POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed. Use POST.'
    ]);
    exit;
}

// 2. Load Configuration
$config = [];
if (file_exists(__DIR__ . '/config.php')) {
    $config = require __DIR__ . '/config.php';
}

$recipientEmail = $config['notification_email'] ?? 'lonewolfdumpsters@gmail.com';
$fromEmail = $config['from_email'] ?? 'noreply@lonewolfdumpsters.com';
$fromName = $config['from_name'] ?? 'Lone Wolf Dumpsters Website';

// 3. Read Input (JSON payload or standard POST)
$rawBody = file_get_contents('php://input');
$input = json_decode($rawBody, true);

if (!$input || !is_array($input)) {
    $input = $_POST;
}

// 4. Anti-Spam Honeypot Verification
if (!empty($input['website_company_fax']) || !empty($input['honeypot'])) {
    echo json_encode([
        'success' => true,
        'message' => 'Quote request received.'
    ]);
    exit;
}

// 5. Sanitize Submitted Values
$name = isset($input['name']) ? trim(strip_tags($input['name'])) : '';
$phone = isset($input['phone']) ? trim(strip_tags($input['phone'])) : '';
$email = isset($input['email']) ? trim(strip_tags($input['email'])) : '';
$streetAddress = isset($input['streetAddress']) ? trim(strip_tags($input['streetAddress'])) : '';
$city = isset($input['city']) ? trim(strip_tags($input['city'])) : '';
$zip = isset($input['zip']) ? trim(strip_tags($input['zip'])) : '';
$deliveryAddress = isset($input['deliveryAddress']) ? trim(strip_tags($input['deliveryAddress'])) : trim($streetAddress . ' ' . $city . ' ' . $zip);

$service = isset($input['service']) ? trim(strip_tags($input['service'])) : '20-yard-dumpster';
$serviceNeed = isset($input['serviceNeed']) ? trim(strip_tags($input['serviceNeed'])) : 'dumpster';
$projectType = isset($input['projectType']) ? trim(strip_tags($input['projectType'])) : 'Home Cleanout';
$debrisType = isset($input['debrisType']) ? trim(strip_tags($input['debrisType'])) : 'General household';
$rentalDuration = isset($input['rentalDuration']) ? trim(strip_tags($input['rentalDuration'])) : '3, 5, or 7 Days';
$preferredDate = isset($input['preferredDate']) ? trim(strip_tags($input['preferredDate'])) : 'As soon as possible';
$preferredContact = isset($input['preferredContact']) ? trim(strip_tags($input['preferredContact'])) : 'Text Message';
$notes = isset($input['notes']) ? trim(strip_tags($input['notes'])) : 'None provided';

// 6. Server-Side Validation
if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Please provide your Full Name and Phone Number.'
    ]);
    exit;
}

// 7. Dynamic Pricing & Service Mapping from Canonical site-content.json
$contentJsonFile = __DIR__ . '/../admin/data/site-content.json';
$p15 = 385; $p20 = 425; $p25 = 475;
if (file_exists($contentJsonFile)) {
    $sc = json_decode(file_get_contents($contentJsonFile), true);
    if (!empty($sc['pricing'])) {
        $p15 = $sc['pricing']['fifteenYard'] ?? 385;
        $p20 = $sc['pricing']['twentyYard'] ?? 425;
        $p25 = $sc['pricing']['twentyFiveYard'] ?? 475;
    }
}

$serviceNames = [
    '15-yard-dumpster' => "15 Yard Dumpster (\${$p15})",
    '20-yard-dumpster' => "20 Yard Dumpster (\${$p20})",
    '25-yard-dumpster' => "25 Yard Dumpster (\${$p25})",
    'junk' => 'Full-Service Junk Removal',
    'commercial' => 'Contractor / Commercial Service',
];
$displayService = $serviceNames[$service] ?? htmlspecialchars($service);
$displayCity = !empty($city) ? htmlspecialchars($city) : 'DFW';

// Compose Email Subject
$subject = "🐺 New Lone Wolf Quote Request — " . $displayService . " — " . $displayCity;

// 8. Compose Formatted HTML Email Body
$htmlBody = '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Lone Wolf Dumpster Quote Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  
  <div style="background-color: #0b0f14; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; border-bottom: 3px solid #dc2626;">
    <h2 style="margin: 0; color: #ffffff; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">LONE WOLF DUMPSTERS</h2>
    <p style="margin: 4px 0 0 0; font-size: 14px; color: #dc2626; font-weight: bold;">NEW QUOTE & INTAKE REQUEST</p>
  </div>

  <div style="background-color: #ffffff; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
    <h3 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Customer Contact Information</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold; width: 140px;">Customer Name:</td><td style="padding: 6px 0; color: #0f172a; font-weight: bold;">' . htmlspecialchars($name) . '</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Phone Number:</td><td style="padding: 6px 0; color: #dc2626; font-weight: bold; font-size: 16px;"><a href="tel:' . preg_replace('/[^0-9+]/', '', $phone) . '" style="color: #dc2626; text-decoration: none;">' . htmlspecialchars($phone) . '</a></td></tr>
      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Email Address:</td><td style="padding: 6px 0; color: #0f172a;">' . htmlspecialchars($email ?: 'Not provided') . '</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Delivery Address:</td><td style="padding: 6px 0; color: #0f172a; font-weight: bold;">' . htmlspecialchars($deliveryAddress) . '</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">City / Area:</td><td style="padding: 6px 0; color: #0f172a;">' . htmlspecialchars($city ?: 'DFW') . ' ' . htmlspecialchars($zip) . '</td></tr>
    </table>

    <h3 style="margin-top: 20px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Job & Rental Details</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold; width: 140px;">Selected Service:</td><td style="padding: 6px 0; color: #0f172a; font-weight: bold;">' . htmlspecialchars($displayService) . '</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Project Type:</td><td style="padding: 6px 0; color: #0f172a;">' . htmlspecialchars($projectType) . '</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Debris Type:</td><td style="padding: 6px 0; color: #0f172a;">' . htmlspecialchars($debrisType) . '</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Rental Duration:</td><td style="padding: 6px 0; color: #0f172a;">' . htmlspecialchars($rentalDuration) . '</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Preferred Date:</td><td style="padding: 6px 0; color: #0f172a; font-weight: bold;">' . htmlspecialchars($preferredDate) . '</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Preferred Contact:</td><td style="padding: 6px 0; color: #0f172a;">' . htmlspecialchars($preferredContact) . '</td></tr>
    </table>

    <div style="background-color: #f1f5f9; padding: 14px; border-radius: 6px; margin-top: 16px;">
      <strong style="color: #475569; display: block; margin-bottom: 4px;">Project Notes & Special Instructions:</strong>
      <p style="margin: 0; color: #0f172a; font-style: italic;">' . nl2br(htmlspecialchars($notes)) . '</p>
    </div>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
      Submitted via lonewolfdumpsters.com • IP: ' . htmlspecialchars($_SERVER['REMOTE_ADDR'] ?? 'unknown') . ' • ' . date('F j, Y g:i A T') . '
    </div>
  </div>

</body>
</html>';

$altBody = "LONE WOLF DUMPSTERS - NEW QUOTE REQUEST\n\n"
         . "Customer Name: {$name}\n"
         . "Phone: {$phone}\n"
         . "Email: {$email}\n"
         . "Delivery Address: {$deliveryAddress}\n"
         . "Service: {$displayService}\n"
         . "Project: {$projectType}\n"
         . "Debris: {$debrisType}\n"
         . "Duration: {$rentalDuration}\n"
         . "Preferred Date: {$preferredDate}\n"
         . "Notes: {$notes}\n";

// Headers
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$fromName} <{$fromEmail}>\r\n";
if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers .= "Reply-To: {$name} <{$email}>\r\n";
}
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Send Primary Email
$mailSent = @mail($recipientEmail, $subject, $htmlBody, $headers);

// 9. Handle Optional SMS Notifications
$smsSent = false;
$smsConfig = $config['sms_notifications'] ?? [];
if (!empty($smsConfig['enabled'])) {
    $smsText = "🐺 NEW LONE WOLF LEAD!\nName: {$name}\nPhone: {$phone}\nService: {$displayService}\nAddress: {$deliveryAddress}\nDate: {$preferredDate}";
    
    // Dispatch via email-to-sms gateways if present
    if (!empty($smsConfig['sms_gateways']) && is_array($smsConfig['sms_gateways'])) {
        $smsHeaders = "From: {$fromName} <{$fromEmail}>\r\nX-Mailer: PHP/" . phpversion();
        foreach ($smsConfig['sms_gateways'] as $gatewayEmail) {
            @mail($gatewayEmail, "New Lead - Lone Wolf", $smsText, $smsHeaders);
        }
        $smsSent = true;
    }
    
    // Dispatch via SMS Webhook if configured
    if (!empty($smsConfig['webhook_url'])) {
        $ch = curl_init($smsConfig['webhook_url']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'phone' => $smsConfig['phone_number'] ?? '2148760321',
            'message' => $smsText,
            'lead' => [
                'name' => $name,
                'phone' => $phone,
                'service' => $displayService,
                'address' => $deliveryAddress,
                'date' => $preferredDate,
            ]
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 3);
        @curl_exec($ch);
        @curl_close($ch);
        $smsSent = true;
    }
}

// 10. Append to Local Leads Log File for Dashboard & Invoicing Access
$leadRecord = [
    'id' => 'LW-' . date('ymd') . '-' . substr(md5(uniqid()), 0, 4),
    'timestamp' => date('c'),
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'service' => $displayService,
    'projectType' => $projectType,
    'debrisType' => $debrisType,
    'deliveryAddress' => $deliveryAddress,
    'city' => $city,
    'zip' => $zip,
    'preferredDate' => $preferredDate,
    'rentalDuration' => $rentalDuration,
    'preferredContact' => $preferredContact,
    'notes' => $notes,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'mail_sent' => (bool)$mailSent,
    'sms_sent' => (bool)$smsSent,
];

$logDir = __DIR__ . '/../admin/data';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}
@file_put_contents($logDir . '/leads.log', json_encode($leadRecord) . "\n", FILE_APPEND | LOCK_EX);

// 11. Return JSON Response
echo json_encode([
    'success' => true,
    'mail_sent' => (bool)$mailSent,
    'message' => $mailSent 
        ? 'Quote request received successfully. Wayne will contact you shortly.'
        : 'Quote request recorded. Wayne will contact you shortly.',
    'lead_id' => $leadRecord['id']
]);
exit;

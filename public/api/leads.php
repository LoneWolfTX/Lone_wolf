<?php
/**
 * Lone Wolf Dumpsters LLC - Admin Leads Management API (/api/leads.php)
 * Architecture: PHP Shared Hosting Native Endpoint (Session Authenticated)
 */

error_reporting(0);
ini_set('display_errors', '0');

session_start();

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

// Session Authentication Check
if (empty($_SESSION['lonewolf_admin']) || $_SESSION['lonewolf_admin'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

$logFile = __DIR__ . '/../admin/data/leads.log';

// GET: Fetch all leads
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $leads = [];
    if (file_exists($logFile)) {
        $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines) {
            foreach ($lines as $line) {
                $entry = json_decode($line, true);
                if ($entry) {
                    $leads[] = $entry;
                }
            }
            $leads = array_reverse($leads); // Newest first
        }
    }
    echo json_encode(['success' => true, 'leads' => $leads]);
    exit;
}

// POST: Update lead status or add manual lead
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!$input) {
        $input = $_POST;
    }

    $action = $input['action'] ?? 'update_status';

    if ($action === 'update_status' && !empty($input['leadId']) && !empty($input['status'])) {
        $leadId = $input['leadId'];
        $newStatus = $input['status'];

        $updatedLeads = [];
        if (file_exists($logFile)) {
            $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $entry = json_decode($line, true);
                if ($entry) {
                    if (($entry['id'] ?? '') === $leadId) {
                        $entry['status'] = $newStatus;
                    }
                    $updatedLeads[] = json_encode($entry);
                }
            }
            file_put_contents($logFile, implode("\n", $updatedLeads) . "\n", LOCK_EX);
        }

        echo json_encode(['success' => true, 'leadId' => $leadId, 'newStatus' => $newStatus]);
        exit;
    }

    if ($action === 'add_lead' && !empty($input['name'])) {
        $newLead = [
            'id' => 'LW-' . rand(1000, 9999),
            'timestamp' => date('c'),
            'name' => trim(strip_tags($input['name'] ?? '')),
            'phone' => trim(strip_tags($input['phone'] ?? '')),
            'email' => trim(strip_tags($input['email'] ?? '')),
            'deliveryAddress' => trim(strip_tags($input['address'] ?? '')),
            'city' => trim(strip_tags($input['city'] ?? 'Dallas, TX')),
            'service' => trim(strip_tags($input['size'] ?? '20 Yard Dumpster')),
            'projectType' => trim(strip_tags($input['projectType'] ?? 'General Debris')),
            'preferredDate' => trim(strip_tags($input['preferredDate'] ?? 'Asap')),
            'status' => 'New',
            'notes' => trim(strip_tags($input['notes'] ?? 'Manual lead entered by admin')),
            'mail_sent' => false
        ];

        $dataDir = dirname($logFile);
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }

        file_put_contents($logFile, json_encode($newLead) . "\n", FILE_APPEND | LOCK_EX);
        echo json_encode(['success' => true, 'lead' => $newLead]);
        exit;
    }
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Invalid request']);
exit;

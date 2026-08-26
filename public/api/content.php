<?php
/**
 * Lone Wolf Dumpsters LLC - Canonical Site Content API Endpoint (/api/content.php)
 * Architecture: PHP Backend with JSON Storage (cPanel / Namecheap Compatible)
 */

error_reporting(0);
ini_set('display_errors', '0');

session_start();

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/../admin/data/site-content.json';

// GET: Serve canonical site content
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        echo $content;
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Site content store not initialized.'
        ]);
    }
    exit;
}

// POST: Authenticated update of site content
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Session Authentication Check
    if (empty($_SESSION['lonewolf_admin']) || $_SESSION['lonewolf_admin'] !== true) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Unauthorized. Admin session required to update website content.'
        ]);
        exit;
    }

    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if (!$payload || (!isset($_POST['content']) && empty($payload))) {
        if (isset($_POST['content'])) {
            $payload = json_decode($_POST['content'], true);
        }
    }

    if (!$payload || !is_array($payload)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON payload received.'
        ]);
        exit;
    }

    // Ensure directory exists
    $dataDir = dirname($dataFile);
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }

    // Format formatted JSON
    $jsonString = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

    // Atomic file write using LOCK_EX
    $result = file_put_contents($dataFile, $jsonString, LOCK_EX);

    if ($result !== false) {
        echo json_encode([
            'success' => true,
            'message' => 'Site content successfully updated and saved to server.',
            'timestamp' => time()
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to write site content file on server. Check file permissions.'
        ]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
exit;

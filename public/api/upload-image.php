<?php
/**
 * Lone Wolf Dumpsters LLC - Authenticated Image Upload Endpoint (/api/upload-image.php)
 * Architecture: PHP Shared Hosting Native File Upload with Security Safeguards
 */

error_reporting(0);
ini_set('display_errors', '0');

session_start();

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed. Use POST.']);
    exit;
}

// 1. Session Authentication Check
if (empty($_SESSION['lonewolf_admin']) || $_SESSION['lonewolf_admin'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized. Admin session required to upload images.']);
    exit;
}

// 2. Verify File Submission
$fileKey = isset($_FILES['image']) ? 'image' : (isset($_FILES['file']) ? 'file' : null);
if (!$fileKey || empty($_FILES[$fileKey]['name']) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
    $errCode = $fileKey ? $_FILES[$fileKey]['error'] : 'No file field found';
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No valid image file uploaded. Error code: ' . $errCode]);
    exit;
}

$uploadedFile = $_FILES[$fileKey];

// 3. File Size Validation (Max 12MB)
$maxSizeBytes = 12 * 1024 * 1024;
if ($uploadedFile['size'] > $maxSizeBytes) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'File size exceeds maximum limit of 12MB.']);
    exit;
}

// 4. MIME & Extension Security Validation
$allowedMimeTypes = [
    'image/jpeg' => 'jpg',
    'image/jpg'  => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp'
];

$detectedMime = '';
if (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $detectedMime = finfo_file($finfo, $uploadedFile['tmp_name']);
    finfo_close($finfo);
} elseif (function_exists('mime_content_type')) {
    $detectedMime = mime_content_type($uploadedFile['tmp_name']);
} else {
    $detectedMime = $uploadedFile['type'];
}

if (!array_key_exists($detectedMime, $allowedMimeTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid image type (' . htmlspecialchars($detectedMime) . '). Only JPG, PNG, and WebP images are allowed.']);
    exit;
}

$targetExtension = $allowedMimeTypes[$detectedMime];

// 5. Generate Safe Versioned Filename
$originalName = pathinfo($uploadedFile['name'], PATHINFO_FILENAME);
$safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', str_replace(' ', '-', strtolower($originalName)));
if (empty($safeName)) {
    $safeName = 'lone-wolf-image';
}

$versionedFilename = sprintf('%s-%s-%s.%s', $safeName, date('YmdHis'), substr(md5(uniqid()), 0, 4), $targetExtension);

// 6. Ensure Upload Directory Exists
$uploadDir = __DIR__ . '/../uploads/site/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$targetFilePath = $uploadDir . $versionedFilename;

// 7. Execute Upload Move
if (move_uploaded_file($uploadedFile['tmp_name'], $targetFilePath)) {
    $publicUrl = '/uploads/site/' . $versionedFilename;
    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded successfully.',
        'url' => $publicUrl,
        'filename' => $versionedFilename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save uploaded image on server.']);
}
exit;

<?php
/**
 * Lone Wolf Dumpsters LLC - Unified Authenticated Admin Studio (/admin/index.php)
 * Architecture: cPanel / Namecheap Shared Hosting Native Backend
 */

session_start();

$configPath = __DIR__ . '/../api/config.php';
$config = file_exists($configPath) ? require $configPath : [];
$correctPassword = $config['admin_password'] ?? 'LoneWolf2026!';

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $_SESSION['lonewolf_admin'] = false;
    session_destroy();
    header('Location: index.php');
    exit;
}

// Handle Login
$loginError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_password'])) {
    if ($_POST['login_password'] === $correctPassword) {
        $_SESSION['lonewolf_admin'] = true;
        header('Location: index.php');
        exit;
    } else {
        $loginError = 'Incorrect password. Please try again.';
    }
}

$isLoggedIn = !empty($_SESSION['lonewolf_admin']) && $_SESSION['lonewolf_admin'] === true;

// If authenticated and index.html exists (from Next.js export), serve the React Admin Studio!
$nextHtmlFile = __DIR__ . '/index.html';
if ($isLoggedIn && file_exists($nextHtmlFile) && !isset($_GET['fallback_php'])) {
    // Serve the authenticated React CMS Admin Studio build
    readfile($nextHtmlFile);
    exit;
}

// Load Leads from unified admin/data/leads.log for PHP fallback
$leads = [];
$logFile = __DIR__ . '/data/leads.log';
if (file_exists($logFile)) {
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines) {
        foreach ($lines as $line) {
            $entry = json_decode($line, true);
            if ($entry) {
                $leads[] = $entry;
            }
        }
        $leads = array_reverse($leads);
    }
}

// Handle CSV Export
if ($isLoggedIn && isset($_GET['action']) && $_GET['action'] === 'export_csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="lonewolf_leads_' . date('Y-m-d') . '.csv"');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['ID', 'Date', 'Name', 'Phone', 'Email', 'Address', 'City', 'Service', 'Project Type', 'Preferred Date', 'Duration', 'Notes', 'Email Sent', 'IP Address']);
    foreach ($leads as $l) {
        fputcsv($output, [
            $l['id'] ?? '',
            $l['timestamp'] ?? '',
            $l['name'] ?? '',
            $l['phone'] ?? '',
            $l['email'] ?? '',
            $l['deliveryAddress'] ?? ($l['address'] ?? ''),
            $l['city'] ?? '',
            $l['service'] ?? '',
            $l['projectType'] ?? '',
            $l['preferredDate'] ?? ($l['date'] ?? ''),
            $l['rentalDuration'] ?? '',
            $l['notes'] ?? '',
            !empty($l['mail_sent']) ? 'YES' : 'NO',
            $l['ip'] ?? '',
        ]);
    }
    fclose($output);
    exit;
}

// Compute Metrics
$totalLeads = count($leads);
$count15 = 0;
$count20 = 0;
$count25 = 0;
foreach ($leads as $l) {
    $svc = strtolower($l['service'] ?? '');
    if (strpos($svc, '15') !== false) $count15++;
    elseif (strpos($svc, '20') !== false) $count20++;
    elseif (strpos($svc, '25') !== false) $count25++;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lone Wolf Admin Studio | Login</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #090d16;
      --bg-card: #111827;
      --border: #1f2937;
      --accent: #dc2626;
      --accent-hover: #b91c1c;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      line-height: 1.5;
      padding: 24px 16px;
    }
    .container { max-width: 1240px; margin: 0 auto; }
    h1, h2, h3, .brand { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .login-wrapper {
      max-width: 420px;
      margin: 80px auto;
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .login-title { font-size: 1.6rem; color: #fff; margin-bottom: 8px; }
    .form-input {
      width: 100%;
      padding: 12px 14px;
      background-color: #0a0d14;
      border: 1px solid #334155;
      border-radius: 4px;
      color: #fff;
      font-size: 1rem;
      margin: 14px 0 18px 0;
    }
    .form-input:focus { outline: none; border-color: var(--accent); }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 11px 16px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: background-color 0.15s ease;
      text-transform: uppercase;
    }
    .btn-primary { background-color: var(--accent); color: #fff; }
    .btn-primary:hover { background-color: var(--accent-hover); }
  </style>
</head>
<body>
<div class="container">

<?php if (!$isLoggedIn): ?>
  <!-- Login Screen -->
  <div class="login-wrapper">
    <div style="margin-bottom: 16px;">
      <img src="../images/lone-wolf/logo.png" alt="Lone Wolf Logo" style="width: 56px; height: 56px; object-fit: contain;" />
    </div>
    <h1 class="login-title">Wayne's Owner Studio</h1>
    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
      Lone Wolf Dumpsters LLC • Authenticated Admin Access
    </p>
    
    <?php if ($loginError): ?>
      <p style="color: var(--accent); margin-bottom: 10px; font-size: 0.9rem;"><?php echo $loginError; ?></p>
    <?php endif; ?>

    <form method="POST">
      <input type="password" name="login_password" class="form-input" placeholder="Enter Admin Password" required>
      <button type="submit" class="btn btn-primary" style="width: 100%;">Sign In</button>
    </form>
    
    <p style="margin-top: 20px; font-size: 0.8rem; color: var(--text-muted);">
      Lost access? Contact <a href="mailto:admin@lonewolfdumpsters.com" style="color: var(--text-main);">support</a>.
    </p>
  </div>
<?php else: ?>
  <div style="padding: 24px; text-align: center;">
    <h2>Admin Studio Authenticated</h2>
    <p>Loading studio interface...</p>
    <a href="?action=logout" style="color: var(--accent);">Logout</a>
  </div>
<?php endif; ?>

</div>
</body>
</html>

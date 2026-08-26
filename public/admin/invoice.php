<?php
/**
 * Lone Wolf Dumpsters LLC - Branded Invoice & Quote Receipt Generator
 * Architecture: cPanel / Namecheap Shared Hosting Native Backend
 */

session_start();

// Strict Authentication Enforcement - Redirect to login if not authenticated
if (empty($_SESSION['lonewolf_admin']) || $_SESSION['lonewolf_admin'] !== true) {
    header('Location: index.php');
    exit;
}

// Pre-fill from query parameters
$invoiceNumber = 'LWD-' . (isset($_GET['id']) ? preg_replace('/[^a-zA-Z0-9-]/', '', $_GET['id']) : date('ymd-Hi'));
$customerName = htmlspecialchars($_GET['name'] ?? 'Wayne Customer');
$customerPhone = htmlspecialchars($_GET['phone'] ?? '(214) 876-0321');
$customerEmail = htmlspecialchars($_GET['email'] ?? '');
$customerAddress = htmlspecialchars($_GET['address'] ?? 'Dallas–Fort Worth, TX');
$rawService = $_GET['service'] ?? '20 Yard Dumpster';
$projectType = htmlspecialchars($_GET['project'] ?? 'General Cleanout');
$notes = htmlspecialchars($_GET['notes'] ?? 'Driveway surface protection boards placed beneath container rollers.');
$invoiceDate = date('F j, Y');
$dueDate = date('F j, Y', strtotime('+7 days'));

// Dynamic Service Details based on size & site-content.json pricing
$contentJsonFile = __DIR__ . '/data/site-content.json';
$p15 = 385.00; $p20 = 425.00; $p25 = 475.00;
if (file_exists($contentJsonFile)) {
    $sc = json_decode(file_get_contents($contentJsonFile), true);
    if (!empty($sc['pricing'])) {
        $p15 = floatval($sc['pricing']['fifteenYard'] ?? 385);
        $p20 = floatval($sc['pricing']['twentyYard'] ?? 425);
        $p25 = floatval($sc['pricing']['twentyFiveYard'] ?? 475);
    }
}

$serviceLower = strtolower($rawService);
if (strpos($serviceLower, '15') !== false) {
    $serviceTitle = '15 Yard Roll-Off Dumpster Rental';
    $dimensions = "14' L × 7.5' W × 4' H";
    $tonnage = '1.5 Tons (3,000 lbs)';
    $duration = '3, 5, or 7 Days';
    $defaultPrice = $p15;
    $serviceDesc = 'Driveway-safe roll-off container delivery, driveway protection boards, and haul-away.';
} elseif (strpos($serviceLower, '25') !== false) {
    $serviceTitle = '25 Yard Roll-Off Dumpster Rental';
    $dimensions = "16' L × 7.5' W × 6' H";
    $tonnage = '2.2 Tons (4,400 lbs)';
    $duration = '3, 5, or 7 Days';
    $defaultPrice = $p25;
    $serviceDesc = 'Heavy-duty roll-off container for construction, demolition, and large estate cleanouts.';
} elseif (strpos($serviceLower, 'junk') !== false) {
    $serviceTitle = 'Full-Service Junk & Debris Removal';
    $dimensions = 'Full-Service Truck & Crew';
    $tonnage = 'Labor & Disposal Included';
    $duration = 'Scheduled Service';
    $defaultPrice = 150.00;
    $serviceDesc = 'Professional 2-man loading crew, bulky item haul-away, and post-cleanup sweep.';
} else {
    $serviceTitle = '20 Yard Roll-Off Dumpster Rental';
    $dimensions = "16' L × 7.5' W × 4.5' H";
    $tonnage = '2.0 Tons (4,000 lbs)';
    $duration = '3, 5, or 7 Days';
    $defaultPrice = $p20;
    $serviceDesc = 'Versatile roll-off container for kitchen/bath remodels, roofing tear-offs, and cleanouts.';
}

$price = isset($_GET['price']) && is_numeric($_GET['price']) ? floatval($_GET['price']) : $defaultPrice;

// Base64 Logo for 100% reliable rendering and PDF printing
$logoPath = __DIR__ . '/../images/lone-wolf/logo.png';
$logoBase64 = file_exists($logoPath) ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath)) : '../images/lone-wolf/logo.png';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #<?= $invoiceNumber ?> | Lone Wolf Dumpsters</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --accent: #dc2626;
      --dark: #0f172a;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #cbd5e1;
      --bg-subtle: #f8fafc;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f1f5f9;
      color: var(--text);
      line-height: 1.5;
      padding: 30px 16px;
    }
    .invoice-wrapper {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .action-bar {
      max-width: 820px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
    }
    .btn-back { background-color: #e2e8f0; color: #334155; }
    .btn-back:hover { background-color: #cbd5e1; }
    .btn-print { background-color: var(--accent); color: #ffffff; }
    .btn-print:hover { background-color: #b91c1c; }
    
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .brand-section { display: flex; alignItems: center; gap: 16px; }
    .brand-logo-img { width: 64px; height: 64px; object-fit: contain; }
    .brand-name { font-family: 'Oswald', sans-serif; font-size: 1.6rem; font-weight: 700; color: var(--dark); line-height: 1; }
    .brand-name span { color: var(--accent); }
    .brand-meta { font-size: 0.84rem; color: var(--text-muted); margin-top: 4px; }
    
    .invoice-meta-box { text-align: right; }
    .invoice-title { font-family: 'Oswald', sans-serif; font-size: 1.5rem; color: var(--accent); font-weight: 700; letter-spacing: 1px; }
    .meta-row { font-size: 0.88rem; color: var(--text); margin-top: 4px; }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 28px;
    }
    .info-block { background-color: var(--bg-subtle); padding: 18px; border-radius: 6px; border: 1px solid #e2e8f0; }
    .info-heading { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .info-name { font-weight: 700; font-size: 1.05rem; color: var(--dark); margin-bottom: 4px; }
    .info-line { font-size: 0.88rem; color: var(--text); margin-bottom: 2px; }
    
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    .invoice-table th {
      background-color: var(--dark);
      color: #ffffff;
      font-family: 'Oswald', sans-serif;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
      padding: 12px 16px;
      text-align: left;
    }
    .invoice-table td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 0.9rem;
    }
    .item-title { font-weight: 700; color: var(--dark); display: block; font-size: 0.98rem; }
    .item-desc { font-size: 0.82rem; color: var(--text-muted); margin-top: 2px; display: block; }
    
    .total-section {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 24px;
      align-items: start;
    }
    .payment-notes { font-size: 0.84rem; color: var(--text-muted); line-height: 1.6; }
    .totals-box { background-color: var(--bg-subtle); padding: 18px; border-radius: 6px; border: 1px solid #e2e8f0; }
    .total-row { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 8px; }
    .total-row.grand-total { border-top: 2px solid var(--accent); padding-top: 8px; margin-top: 8px; font-weight: 800; font-size: 1.15rem; color: var(--dark); }

    @media print {
      body { background: #ffffff; padding: 0; }
      .invoice-wrapper { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .action-bar { display: none; }
    }
  </style>
</head>
<body>

  <div class="action-bar">
    <a href="index.php" class="btn btn-back">&larr; Back to Admin Panel</a>
    <button class="btn btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="invoice-wrapper">
    <!-- Header -->
    <div class="invoice-header">
      <div class="brand-section">
        <img src="<?= $logoBase64 ?>" alt="Lone Wolf Dumpsters Logo" class="brand-logo-img" />
        <div>
          <div class="brand-name">LONE WOLF <span>DUMPSTERS</span></div>
          <div class="brand-meta">Lone Wolf Dumpsters LLC • DFW Metroplex, TX</div>
          <div class="brand-meta">📞 (214) 876-0321 &nbsp;|&nbsp; ✉️ lonewolfdumpsters@gmail.com</div>
        </div>
      </div>
      
      <div class="invoice-meta-box">
        <div class="invoice-title">QUOTE / RECEIPT</div>
        <div class="meta-row">Receipt #: <strong><?= $invoiceNumber ?></strong></div>
        <div class="meta-row">Date: <strong><?= $invoiceDate ?></strong></div>
        <div class="meta-row">Due Date: <strong>Due Upon Delivery</strong></div>
      </div>
    </div>

    <!-- Customer & Dispatch Grid -->
    <div class="info-grid">
      <div class="info-block">
        <div class="info-heading">CUSTOMER / BILL TO:</div>
        <div class="info-name"><?= $customerName ?></div>
        <div class="info-line">📞 <?= $customerPhone ?></div>
        <?php if (!empty($customerEmail)): ?>
          <div class="info-line">✉️ <?= $customerEmail ?></div>
        <?php endif; ?>
        <div class="info-line">📍 <?= $customerAddress ?></div>
      </div>

      <div class="info-block">
        <div class="info-heading">DELIVERY &amp; DISPATCH LOCATION:</div>
        <div class="info-name">Drop-Off Address:</div>
        <div class="info-line">📍 <?= $customerAddress ?></div>
        <div class="info-line" style="margin-top: 6px;"><strong>Project Type:</strong> <?= $projectType ?></div>
        <div class="info-line"><strong>Surface Protection:</strong> Driveway Wood Planks Included</div>
      </div>
    </div>

    <!-- Line Items Table -->
    <table class="invoice-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Included Allowance</th>
          <th style="text-align: center;">Duration</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span class="item-title"><?= htmlspecialchars($serviceTitle) ?></span>
            <span class="item-desc"><?= htmlspecialchars($serviceDesc) ?></span>
            <span class="item-desc" style="display: block; margin-top: 2px;">Dimensions: <?= htmlspecialchars($dimensions) ?></span>
          </td>
          <td style="text-align: center; vertical-align: middle;"><?= htmlspecialchars($tonnage) ?></td>
          <td style="text-align: center; vertical-align: middle;"><?= htmlspecialchars($duration) ?></td>
          <td style="text-align: right; vertical-align: middle; font-weight: 700;">$<?= number_format($price, 2) ?></td>
        </tr>
        <tr>
          <td>
            <span class="item-title">DFW Delivery &amp; Driveway Surface Protection</span>
            <span class="item-desc">Protective wooden planks under container wheels.</span>
          </td>
          <td style="text-align: center; vertical-align: middle;">Standard Delivery</td>
          <td style="text-align: center; vertical-align: middle;">Included</td>
          <td style="text-align: right; vertical-align: middle; font-weight: 700; color: var(--accent);">$0.00</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals & Notes -->
    <div class="total-section">
      <div class="payment-notes">
        <div style="font-weight: 700; color: var(--dark); margin-bottom: 6px;">Payment Terms &amp; Disposal Guidelines:</div>
        <p style="margin-bottom: 6px;">
          <strong>Payment Methods:</strong> Credit/Debit Card, Zelle, Check, or Cash upon delivery.
        </p>
        <p style="margin-bottom: 6px;">
          <strong>Overage Rates:</strong> Additional weight billed at $80 per ton ($40 per 1,000 lbs). Additional rental days at $20/day.
        </p>
        <p style="margin: 0; font-size: 0.8rem; color: #dc2626;">
          <strong>Prohibited Items:</strong> Tires, batteries, bricks, concrete, dirt, asphalt, railroad ties, asbestos, oils, chemicals, paint, hazardous/flammable materials, and unapproved refrigerated appliances.
        </p>
      </div>

      <div class="totals-box">
        <div class="total-row">
          <span>Subtotal:</span>
          <strong>$<?= number_format($price, 2) ?></strong>
        </div>
        <div class="total-row">
          <span>Delivery Fee:</span>
          <strong style="color: var(--accent);">$0.00</strong>
        </div>
        <div class="total-row grand-total">
          <span>Total Amount Due:</span>
          <span>$<?= number_format($price, 2) ?></span>
        </div>
      </div>
    </div>

    <!-- Footer Note -->
    <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.82rem; color: var(--text-muted);">
      Thank you for choosing Lone Wolf Dumpsters LLC! For questions or scheduling updates, call/text Wayne directly at <strong>(214) 876-0321</strong>.
    </div>
  </div>

</body>
</html>

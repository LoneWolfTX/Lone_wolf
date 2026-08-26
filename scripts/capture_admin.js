const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureAdmin() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // Read admin HTML and inject sample preview state
  const adminPhp = fs.readFileSync(path.join(__dirname, '..', 'public', 'admin', 'index.php'), 'utf8');
  
  // Extract CSS
  const cssMatch = adminPhp.match(/<style>([\s\S]*?)<\/style>/);
  const css = cssMatch ? cssMatch[1] : '';

  const sampleAdminHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Intake Dashboard Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
  <div class="container">
    <header class="admin-header">
      <div>
        <h2>🐺 Lone Wolf <span class="brand-logo">Intake Dashboard</span></h2>
        <p style="font-size: 0.88rem; color: var(--text-muted);">
          Real-time lead inbox for Lone Wolf Dumpsters LLC (Dallas–Fort Worth)
        </p>
      </div>
      <div style="display: flex; gap: 8px;">
        <span class="btn btn-outline btn-sm">📥 Export CSV</span>
        <span class="btn btn-outline btn-sm">🌐 View Website</span>
        <span class="btn btn-outline btn-sm" style="color: #f87171;">Sign Out</span>
      </div>
    </header>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Leads Received</div>
        <div class="metric-val">12</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">15 Yard Dumpster ($415)</div>
        <div class="metric-val" style="color: #7dd3fc;">3</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">20 Yard Dumpster ($455)</div>
        <div class="metric-val" style="color: #fca5a5;">7</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">25 Yard Dumpster ($505)</div>
        <div class="metric-val" style="color: #cbd5e1;">2</div>
      </div>
    </div>

    <div class="controls-bar">
      <h3 style="font-size: 1.2rem;">Incoming Quote Requests</h3>
    </div>

    <div class="lead-card">
      <div class="lead-header">
        <div>
          <span class="lead-name">Marcus Vance</span>
          <span class="badge badge-size" style="margin-left: 8px;">20 Yard Dumpster ($455)</span>
          <span class="badge" style="margin-left: 4px;">Kitchen Remodel</span>
        </div>
        <div class="lead-time">🕒 Today — 10:45 AM</div>
      </div>
      <div class="lead-details-grid">
        <div class="detail-item">
          <strong>Phone Number</strong>
          <span>(214) 555-0198</span>
        </div>
        <div class="detail-item">
          <strong>Email</strong>
          <span>marcus.vance@gmail.com</span>
        </div>
        <div class="detail-item">
          <strong>Delivery Address / City</strong>
          <span>4128 Meadowbrook Dr, Fort Worth TX 76103</span>
        </div>
        <div class="detail-item">
          <strong>Preferred Date</strong>
          <span>This Friday (Morning drop-off)</span>
        </div>
      </div>
      <div class="lead-notes-box">
        <strong style="color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase; display: block; margin-bottom: 2px;">Project Notes / Details:</strong>
        Tearing out old cabinets and tile flooring. Driveway is wide, please place wood planks under wheels.
      </div>
      <div class="lead-actions">
        <a href="tel:2145550198" class="btn btn-call btn-sm">📞 Call Customer</a>
        <a href="sms:2145550198" class="btn btn-text btn-sm">💬 Send Text</a>
        <a href="mailto:marcus.vance@gmail.com" class="btn btn-outline btn-sm">✉️ Email Customer</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  await page.setContent(sampleAdminHtml, { waitUntil: 'networkidle0' });
  const adminPath = 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\intake_admin_dashboard.png';
  await page.screenshot({ path: adminPath });
  console.log('Saved admin dashboard screenshot to:', adminPath);

  await browser.close();
}

captureAdmin().catch(console.error);

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureAllNewFeatures() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  // 1. Capture Fixed Sizing & Pricing Cards from lonewolf_preview.html
  const previewFile = 'file:///' + path.join(__dirname, '..', 'lonewolf_preview.html').replace(/\\/g, '/');
  await page.goto(previewFile, { waitUntil: 'load' });
  const pricingSection = await page.$('#dumpster-sizes');
  const pricingPath = 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\fixed_dumpster_pricing_cards.png';
  if (pricingSection) {
    await pricingSection.screenshot({ path: pricingPath });
    console.log('Saved fixed pricing cards screenshot to:', pricingPath);
  }

  // 2. Capture Admin Dashboard
  const adminPhp = fs.readFileSync(path.join(__dirname, '..', 'public', 'admin', 'index.php'), 'utf8');
  const cssMatch = adminPhp.match(/<style>([\s\S]*?)<\/style>/);
  const css = cssMatch ? cssMatch[1] : '';

  const sampleAdminHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Intake Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
  <div class="container">
    <header class="admin-header">
      <div>
        <h2>🐺 Lone Wolf <span class="brand-logo">Intake Dashboard</span></h2>
        <p style="font-size: 0.88rem; color: var(--text-muted);">Real-time lead inbox for Lone Wolf Dumpsters LLC (Dallas–Fort Worth)</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <span class="btn btn-invoice btn-sm">🧾 New Custom Invoice</span>
        <span class="btn btn-outline btn-sm">📥 Export CSV</span>
        <span class="btn btn-outline btn-sm">🌐 View Website</span>
        <span class="btn btn-outline btn-sm" style="color: #f87171;">Sign Out</span>
      </div>
    </header>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Leads Received</div>
        <div class="metric-val">14</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">15 Yard Dumpster ($415)</div>
        <div class="metric-val" style="color: #7dd3fc;">4</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">20 Yard Dumpster ($455)</div>
        <div class="metric-val" style="color: #fca5a5;">8</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">25 Yard Dumpster ($505)</div>
        <div class="metric-val" style="color: #cbd5e1;">2</div>
      </div>
    </div>

    <div class="controls-bar">
      <h3 style="font-size: 1.2rem;">Incoming Quote Requests (14)</h3>
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
        <span class="btn btn-call btn-sm">📞 Call Customer</span>
        <span class="btn btn-text btn-sm">💬 Send Text</span>
        <span class="btn btn-outline btn-sm">✉️ Email Customer</span>
        <span class="btn btn-invoice btn-sm">🧾 Generate Invoice / Receipt</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  await page.setContent(sampleAdminHtml, { waitUntil: 'networkidle0' });
  const adminPath = 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\admin_panel_capture.png';
  await page.screenshot({ path: adminPath });
  console.log('Saved admin panel capture to:', adminPath);

  // 3. Capture Custom Invoice / Quote Receipt
  const logoPath = path.join(__dirname, '..', 'public', 'images', 'lone-wolf', 'logo.png');
  const logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
  
  const invoicePhp = fs.readFileSync(path.join(__dirname, '..', 'public', 'admin', 'invoice.php'), 'utf8');
  const invoiceCssMatch = invoicePhp.match(/<style>([\s\S]*?)<\/style>/);
  const invoiceCss = invoiceCssMatch ? invoiceCssMatch[1] : '';

  const sampleInvoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice Receipt Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>${invoiceCss}</style>
</head>
<body>
  <div class="actions-bar">
    <span class="btn btn-back">← Back to Admin Panel</span>
    <span class="btn btn-print">🖨️ Print / Save as PDF</span>
  </div>

  <div class="invoice-wrapper">
    <header class="invoice-header">
      <div class="brand-section">
        <img src="${logoBase64}" alt="Lone Wolf Logo" class="brand-logo-img" />
        <div>
          <h1 class="brand-name">LONE WOLF <span>DUMPSTERS</span></h1>
          <div class="brand-meta">Lone Wolf Dumpsters LLC</div>
          <div class="brand-meta">4141 Singleton Blvd, Dallas, TX 75212</div>
          <div class="brand-meta">📞 (214) 876-0321 | ✉️ lonewolfdumpsters@gmail.com</div>
        </div>
      </div>

      <div class="invoice-meta-box">
        <h2 class="invoice-title">QUOTE / RECEIPT</h2>
        <div class="meta-row"><strong>Receipt #:</strong> LWD-260815-1045</div>
        <div class="meta-row"><strong>Date:</strong> August 15, 2026</div>
        <div class="meta-row"><strong>Due Date:</strong> Upon Delivery</div>
      </div>
    </header>

    <div class="info-grid">
      <div class="info-block">
        <div class="info-heading">CUSTOMER / BILL TO:</div>
        <div class="info-name">Marcus Vance</div>
        <div class="info-line">📞 (214) 555-0198</div>
        <div class="info-line">✉️ marcus.vance@gmail.com</div>
        <div class="info-line">📍 4128 Meadowbrook Dr, Fort Worth TX 76103</div>
      </div>

      <div class="info-block">
        <div class="info-heading">DELIVERY &amp; DISPATCH LOCATION:</div>
        <div class="info-name">Drop-Off Address:</div>
        <div class="info-line">📍 4128 Meadowbrook Dr, Fort Worth TX 76103</div>
        <div class="info-line" style="margin-top: 6px;"><strong>Project Type:</strong> Kitchen Remodel</div>
        <div class="info-line"><strong>Surface Protection:</strong> Driveway Wood Planks Included</div>
      </div>
    </div>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Included Allowance</th>
          <th>Duration</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>20 Yard Roll-Off Dumpster Rental</strong>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
              Roll-off container delivery, driveway surface protection, and municipal landfill haul-away.
            </div>
          </td>
          <td>2.5 Tons (5,000 lbs) Included</td>
          <td>1–7 Days</td>
          <td class="text-right"><strong>$455.00</strong></td>
        </tr>
        <tr>
          <td>
            <strong>DFW Delivery &amp; Driveway Surface Protection</strong>
            <div style="font-size: 0.82rem; color: var(--text-muted);">
              Protective wood planks under container wheels.
            </div>
          </td>
          <td>Standard Delivery</td>
          <td>Included</td>
          <td class="text-right"><strong>$0.00</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="summary-wrap">
      <div class="payment-instructions">
        <p style="margin-bottom: 6px;"><strong>Payment Terms:</strong></p>
        <p>Payment accepted via Credit/Debit Card, Zelle, Check, or Cash upon delivery.</p>
        <p style="margin-top: 8px; font-size: 0.8rem;">
          <strong>Overage Rates:</strong> Additional weight is billed at $75/ton prorated. Extra rental days are $15/day. Hazardous materials (wet paint, tires, batteries, chemicals) strictly prohibited.
        </p>
      </div>

      <table class="totals-table">
        <tr>
          <td>Subtotal:</td>
          <td class="text-right">$455.00</td>
        </tr>
        <tr>
          <td>Delivery Fee:</td>
          <td class="text-right">$0.00</td>
        </tr>
        <tr class="total-due-row">
          <td>Total Amount Due:</td>
          <td class="text-right">$455.00</td>
        </tr>
      </table>
    </div>

    <div style="margin-top: 36px; padding-top: 18px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.82rem; color: var(--text-muted);">
      Thank you for choosing Lone Wolf Dumpsters LLC! For questions or scheduling updates, call/text Wayne directly at <strong>(214) 876-0321</strong>.
    </div>
  </div>
</body>
</html>`;

  await page.setContent(sampleInvoiceHtml, { waitUntil: 'networkidle0' });
  const invoicePath = 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\custom_invoice_receipt.png';
  await page.screenshot({ path: invoicePath });
  console.log('Saved custom invoice receipt screenshot to:', invoicePath);

  await browser.close();
}

captureAllNewFeatures().catch(console.error);

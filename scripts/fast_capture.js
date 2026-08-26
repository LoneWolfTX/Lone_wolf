const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 950 });

  // 1. Capture Invoice Receipt
  const logoPath = path.join(__dirname, '..', 'public', 'images', 'lone-wolf', 'logo.png');
  const logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
  
  const invoicePhp = fs.readFileSync(path.join(__dirname, '..', 'public', 'admin', 'invoice.php'), 'utf8');
  const cssMatch = invoicePhp.match(/<style>([\s\S]*?)<\/style>/);
  const css = cssMatch ? cssMatch[1] : '';

  const sampleInvoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice Receipt Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body style="background:#f1f5f9; padding:20px;">
  <div class="actions-bar" style="margin-bottom:16px;">
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

  await page.setContent(sampleInvoiceHtml, { waitUntil: 'domcontentloaded' });
  const invoicePath = 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\custom_invoice_receipt.png';
  await page.screenshot({ path: invoicePath, fullPage: true });
  console.log('Saved invoice receipt to:', invoicePath);

  // 2. Capture Fixed Pricing Cards
  const previewHtml = fs.readFileSync(path.join(__dirname, '..', 'lonewolf_preview.html'), 'utf8');
  await page.setContent(previewHtml, { waitUntil: 'domcontentloaded' });
  await page.setViewport({ width: 1200, height: 800 });
  const pricingSection = await page.$('#dumpster-sizes');
  if (pricingSection) {
    const pricingPath = 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\screenshots\\fixed_dumpster_pricing_cards.png';
    await pricingSection.screenshot({ path: pricingPath });
    console.log('Saved fixed pricing cards to:', pricingPath);
  }

  await browser.close();
}

run().catch(console.error);

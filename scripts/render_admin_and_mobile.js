const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const logoPath = path.join(__dirname, '..', 'public', 'images', 'lone-wolf', 'logo.png');
const logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');

const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Intake Dashboard | Lone Wolf Dumpsters</title>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0e14;
      --bg-card: #121824;
      --border: #232f42;
      --accent: #dc2626;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background-color: var(--bg-dark); color: var(--text-main); padding: 24px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1, h2, h3, .brand { font-family: 'Oswald', sans-serif; text-transform: uppercase; }
    .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
    .brand { font-size: 1.5rem; display: flex; align-items: center; gap: 12px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
    .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 20px; text-align: center; }
    .stat-val { font-size: 2.2rem; font-weight: 800; font-family: 'Oswald'; color: #fff; }
    .stat-lbl { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
    .leads-table { width: 100%; border-collapse: collapse; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
    .leads-table th { background: #161f30; padding: 14px; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border); }
    .leads-table td { padding: 16px 14px; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
    .lead-name { font-weight: 700; color: #fff; font-size: 0.98rem; }
    .lead-phone { color: var(--accent); font-weight: 700; }
    .tag { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; background: rgba(220, 38, 38, 0.2); color: #f87171; border: 1px solid rgba(220, 38, 38, 0.4); }
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 4px; font-size: 0.82rem; font-weight: 700; text-decoration: none; border: none; cursor: pointer; }
    .btn-action { background: #1e293b; color: #fff; border: 1px solid #334155; }
    .btn-quote { background: var(--accent); color: #fff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        <img src="${logoBase64}" style="width: 48px; height: 48px; object-fit: contain;" />
        <div>
          <span>LONE WOLF <span style="color: var(--accent);">LEADS &amp; INTAKE DASHBOARD</span></span>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-family: 'Inter'; font-weight: 500;">Self-Hosted on Wayne's Namecheap cPanel • Zero External Subscriptions</div>
        </div>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-action">📥 Export CSV</button>
        <button class="btn btn-quote">+ New Manual Quote</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-val" style="color: #fff;">12</div>
        <div class="stat-lbl">Total Inquiries</div>
      </div>
      <div class="stat-card">
        <div class="stat-val" style="color: #38bdf8;">3</div>
        <div class="stat-lbl">15-Yard Requests</div>
      </div>
      <div class="stat-card">
        <div class="stat-val" style="color: var(--accent);">7</div>
        <div class="stat-lbl">20-Yard (Most Popular)</div>
      </div>
      <div class="stat-card">
        <div class="stat-val" style="color: #4ade80;">2</div>
        <div class="stat-lbl">25-Yard Requests</div>
      </div>
    </div>

    <table class="leads-table">
      <thead>
        <tr>
          <th>Date / Time</th>
          <th>Customer Info</th>
          <th>Delivery Location</th>
          <th>Size / Service</th>
          <th>Project Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span style="color: var(--text-muted); font-size: 0.8rem;">Aug 15, 2:42 PM</span></td>
          <td>
            <div class="lead-name">Marcus Vance</div>
            <div class="lead-phone">(214) 892-1140</div>
            <div style="color: var(--text-muted); font-size: 0.8rem;">marcus.v@gmail.com</div>
          </td>
          <td>4812 Pecan Grove Ln<br><strong style="color: #fff;">Keller, TX 76248</strong></td>
          <td><span class="tag">20 Yard ($455)</span></td>
          <td>Kitchen Remodel &amp; Flooring Debris</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <a href="#" class="btn btn-quote">Generate Invoice</a>
              <a href="tel:2148921140" class="btn btn-action">📞 Call</a>
            </div>
          </td>
        </tr>
        <tr>
          <td><span style="color: var(--text-muted); font-size: 0.8rem;">Aug 15, 11:18 AM</span></td>
          <td>
            <div class="lead-name">Sarah Jenkins</div>
            <div class="lead-phone">(817) 440-9281</div>
            <div style="color: var(--text-muted); font-size: 0.8rem;">s.jenkins@dfwrealty.com</div>
          </td>
          <td>1120 Southlake Blvd<br><strong style="color: #fff;">Southlake, TX 76092</strong></td>
          <td><span class="tag" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border-color: rgba(56, 189, 248, 0.4);">15 Yard ($415)</span></td>
          <td>Garage Cleanout / Estate Clear</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <a href="#" class="btn btn-quote">Generate Invoice</a>
              <a href="tel:8174409281" class="btn btn-action">📞 Call</a>
            </div>
          </td>
        </tr>
        <tr>
          <td><span style="color: var(--text-muted); font-size: 0.8rem;">Aug 14, 4:05 PM</span></td>
          <td>
            <div class="lead-name">David Miller (Contractor)</div>
            <div class="lead-phone">(214) 773-6102</div>
            <div style="color: var(--text-muted); font-size: 0.8rem;">david@millercustomhomes.com</div>
          </td>
          <td>704 Oak Hill Ct<br><strong style="color: #fff;">Fort Worth, TX 76107</strong></td>
          <td><span class="tag" style="background: rgba(74, 222, 128, 0.2); color: #4ade80; border-color: rgba(74, 222, 128, 0.4);">25 Yard ($505)</span></td>
          <td>Commercial Roof Tear-Off</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <a href="#" class="btn btn-quote">Generate Invoice</a>
              <a href="tel:2147736102" class="btn btn-action">📞 Call</a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>`;

const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice #LWD-20260815 | Lone Wolf Dumpsters</title>
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
    body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; color: var(--text); padding: 30px 16px; }
    .invoice-wrapper { max-width: 820px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 24px; }
    .brand-section { display: flex; align-items: center; gap: 14px; }
    .brand-name { font-family: 'Oswald', sans-serif; font-size: 1.6rem; color: var(--dark); text-transform: uppercase; }
    .invoice-meta-box { text-align: right; }
    .invoice-title { font-family: 'Oswald', sans-serif; font-size: 1.8rem; color: var(--dark); text-transform: uppercase; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px; }
    .info-block { background-color: var(--bg-subtle); border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; }
    .info-heading { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
    .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .invoice-table th { background-color: var(--dark); color: #ffffff; padding: 12px 16px; text-align: left; font-size: 0.85rem; text-transform: uppercase; }
    .invoice-table td { padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 0.95rem; }
    .total-row { display: flex; justify-content: flex-end; margin-top: 16px; }
    .total-box { width: 300px; background: var(--bg-subtle); border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; }
    .total-line { display: flex; justify-content: space-between; font-size: 0.95rem; margin-bottom: 8px; }
    .grand-total { font-family: 'Oswald', sans-serif; font-size: 1.6rem; font-weight: 700; color: var(--accent); border-top: 2px solid #e2e8f0; padding-top: 8px; margin-top: 8px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 4px; font-weight: 700; text-decoration: none; cursor: pointer; border: none; }
    .btn-print { background-color: var(--accent); color: #fff; }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
      <button class="btn btn-print" onclick="window.print()">🖨️ Print / Download PDF</button>
    </div>
    <div class="invoice-header">
      <div class="brand-section">
        <img src="${logoBase64}" style="width: 64px; height: 64px; object-fit: contain;" />
        <div>
          <div class="brand-name">LONE WOLF <span style="color: var(--accent);">DUMPSTERS</span></div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Dallas–Fort Worth Metroplex • (214) 876-0321</div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">lonewolfdumpsters@gmail.com</div>
        </div>
      </div>
      <div class="invoice-meta-box">
        <div class="invoice-title">INVOICE &amp; RECEIPT</div>
        <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">Invoice #: <strong style="color: var(--dark);">LWD-20260815-01</strong></div>
        <div style="font-size: 0.9rem; color: var(--text-muted);">Date: <strong style="color: var(--dark);">August 15, 2026</strong></div>
        <div style="font-size: 0.9rem; color: var(--text-muted);">Due Date: <strong style="color: var(--dark);">Due Upon Delivery</strong></div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-block">
        <div class="info-heading">BILLED TO / CUSTOMER</div>
        <div style="font-size: 1.05rem; font-weight: 700; color: var(--dark);">Marcus Vance</div>
        <div style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.4;">(214) 892-1140<br>marcus.v@gmail.com</div>
      </div>
      <div class="info-block">
        <div class="info-heading">DELIVERY &amp; DISPATCH SITE</div>
        <div style="font-size: 1.05rem; font-weight: 700; color: var(--dark);">4812 Pecan Grove Ln</div>
        <div style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.4;">Keller, TX 76248<br><strong>Placement:</strong> Driveway (Boards included)</div>
      </div>
    </div>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>Description &amp; Service Details</th>
          <th style="text-align: center;">Rental Period</th>
          <th style="text-align: center;">Tonnage Included</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong style="color: var(--dark);">20 Yard Roll-Off Dumpster Rental</strong>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">Dimensions: 16' L x 7.5' W x 4.5' H • Best for kitchen &amp; bath remodel debris</div>
          </td>
          <td style="text-align: center;">1–7 Days</td>
          <td style="text-align: center;">Up to 2.5 Tons</td>
          <td style="text-align: right; font-weight: 700;">$455.00</td>
        </tr>
        <tr>
          <td>
            <strong style="color: var(--dark);">Driveway Protection Surface Boarding</strong>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">Protective wooden planks placed beneath container rollers</div>
          </td>
          <td style="text-align: center;">Included</td>
          <td style="text-align: center;">—</td>
          <td style="text-align: right; font-weight: 700; color: var(--accent);">FREE</td>
        </tr>
      </tbody>
    </table>

    <div class="total-row">
      <div class="total-box">
        <div class="total-line"><span>Subtotal:</span><span>$455.00</span></div>
        <div class="total-line"><span>Delivery &amp; Placement:</span><span style="color: var(--accent); font-weight: 700;">INCLUDED</span></div>
        <div class="total-line"><span>Sales Tax / Fees:</span><span>$0.00</span></div>
        <div class="total-line grand-total"><span>Total Due:</span><span>$455.00</span></div>
      </div>
    </div>
  </div>
</body>
</html>`;

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Render Admin Dashboard
  await page.setViewport({ width: 1240, height: 800, deviceScaleFactor: 2 });
  await page.setContent(adminHtml, { waitUntil: 'networkidle0' });
  const adminPath = path.join('C:', 'Users', 'rougu', '.gemini', 'antigravity', 'brain', 'f4c38032-e053-4b48-9855-ef18e021c227', 'screenshots', 'admin_dashboard_full.png');
  await page.screenshot({ path: adminPath, fullPage: true });
  console.log('Saved admin screenshot to:', adminPath);

  // Render Invoice Generator
  await page.setViewport({ width: 1000, height: 900, deviceScaleFactor: 2 });
  await page.setContent(invoiceHtml, { waitUntil: 'networkidle0' });
  const invoicePath = path.join('C:', 'Users', 'rougu', '.gemini', 'antigravity', 'brain', 'f4c38032-e053-4b48-9855-ef18e021c227', 'screenshots', 'custom_invoice_receipt.png');
  await page.screenshot({ path: invoicePath, fullPage: true });
  console.log('Saved invoice screenshot to:', invoicePath);

  // Render Mobile Screenshot
  const previewPath = 'file:///' + path.join(__dirname, '..', 'lonewolf_preview.html').replace(/\\/g, '/');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(previewPath, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));
  const mobilePath = path.join('C:', 'Users', 'rougu', '.gemini', 'antigravity', 'brain', 'f4c38032-e053-4b48-9855-ef18e021c227', 'screenshots', 'mobile_fullpage.png');
  await page.screenshot({ path: mobilePath, fullPage: true });
  console.log('Saved mobile screenshot to:', mobilePath);

  await browser.close();
})();

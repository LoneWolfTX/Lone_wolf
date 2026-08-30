const BASE_URL = (process.env.TARGET_URL || 'http://localhost:3000').replace(/\/$/, '');
const IS_LOCAL = BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1');

const CANONICAL_48_CITIES = [
  "fort-worth",
  "arlington",
  "keller",
  "southlake",
  "colleyville",
  "grapevine",
  "north-richland-hills",
  "bedford",
  "euless",
  "hurst",
  "haltom-city",
  "mansfield",
  "watauga",
  "saginaw",
  "haslet",
  "richland-hills",
  "kennedale",
  "lake-worth",
  "white-settlement",
  "river-oaks",
  "forest-hill",
  "everman",
  "edgecliff-village",
  "blue-mound",
  "sansom-park",
  "lakeside",
  "dallas",
  "irving",
  "grand-prairie",
  "carrollton",
  "coppell",
  "farmers-branch",
  "addison",
  "highland-park",
  "university-park",
  "duncanville",
  "desoto",
  "cedar-hill",
  "cockrell-hill",
  "lewisville",
  "flower-mound",
  "the-colony",
  "highland-village",
  "roanoke",
  "trophy-club",
  "westlake",
  "northlake",
  "double-oak"
];

const CORE_ROUTES = [
  '/',
  '/dumpster-rentals',
  '/dumpster-rentals/15-yard',
  '/dumpster-rentals/20-yard',
  '/dumpster-rentals/25-yard',
  '/dumpster-rentals/residential',
  '/dumpster-rentals/contractor',
  '/dumpster-rentals/commercial',
  '/junk-removal',
  '/service-areas',
  '/about',
  '/contact',
  '/faq',
  '/blog',
  '/api/content',
  '/robots.txt',
  '/sitemap.xml',
];

async function request(path, options = {}) {
  const url = BASE_URL + path;
  const headers = options.headers || {};
  
  // Use standard proxy header x-forwarded-for for client IP simulation
  if (!headers['x-forwarded-for']) {
    headers['x-forwarded-for'] = options.clientIp || ('198.51.100.' + (Math.floor(Math.random() * 200) + 1));
  }
  
  if (options.testIp) {
    headers['x-test-ip'] = options.testIp;
  }
  if (options.origin !== false) {
    headers['Origin'] = options.origin || BASE_URL;
  }
  if (options.cookie) {
    headers['Cookie'] = options.cookie;
  }
  if (options.body && !headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? (typeof options.body === 'string' || options.body instanceof FormData ? options.body : JSON.stringify(options.body)) : undefined,
    redirect: 'manual',
  });

  const contentType = res.headers.get('content-type') || '';
  let body = null;
  if (contentType.includes('application/json')) {
    body = await res.json().catch(() => null);
  } else {
    body = await res.text().catch(() => '');
  }

  const setCookie = res.headers.get('set-cookie') || '';
  return {
    status: res.status,
    headers: res.headers,
    body,
    setCookie,
  };
}

async function runAcceptanceSuite() {
  const modeLabel = IS_LOCAL ? 'LOCAL INTEGRATION' : 'LIVE PRODUCTION VERCEL';
  console.log('===============================================================');
  console.log('   LONE WOLF DUMPSTERS - ' + modeLabel + ' ACCEPTANCE SUITE');
  console.log('   Target URL: ' + BASE_URL);
  console.log('===============================================================\\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log('  [PASS] ' + message);
      passed++;
    } else {
      console.error('  [FAIL] ' + message);
      failed++;
    }
  }

  // 1. Core routes
  console.log('--- 1. Testing Core Routes ---');
  for (const route of CORE_ROUTES) {
    const res = await request(route);
    assert(res.status === 200, route + ' returns HTTP 200 (Got ' + res.status + ')');
  }

  // 2. 48 Canonical Cities
  console.log('\\n--- 2. Testing All 48 Canonical City Service Area Pages ---');
  for (const city of CANONICAL_48_CITIES) {
    const route = '/service-areas/' + city;
    const res = await request(route);
    assert(res.status === 200, route + ' returns HTTP 200 (Got ' + res.status + ')');
  }

  // 3. Server-Gated Admin Page
  console.log('\\n--- 3. Testing Server-Gated /admin Boundary ---');
  const anonymousAdmin = await request('/admin');
  assert(anonymousAdmin.status === 200, 'Anonymous GET /admin returns HTTP 200');
  const adminHtml = typeof anonymousAdmin.body === 'string' ? anonymousAdmin.body : '';
  assert(adminHtml.includes('LONE WOLF') && (adminHtml.includes('Master Password') || adminHtml.includes('password')), 'Anonymous /admin delivers login view');
  assert(!adminHtml.includes('Save All Changes to Redis'), 'Anonymous /admin does NOT leak authenticated dashboard controls');

  // 4. Authentication & Gating
  console.log('\\n--- 4. Testing Server Authentication & Gating ---');
  const unauthLeads = await request('/api/leads');
  assert(unauthLeads.status === 401, 'Anonymous GET /api/leads is rejected with 401');

  const unauthContent = await request('/api/admin/content', { method: 'POST', body: { test: 1 } });
  assert(unauthContent.status === 401, 'Anonymous POST /api/admin/content is rejected with 401');

  const unauthUpload = await request('/api/admin/upload-image', { method: 'POST' });
  assert(unauthUpload.status === 401, 'Anonymous POST /api/admin/upload-image is rejected with 401');

  const badLogin = await request('/api/admin/auth/login', { method: 'POST', body: { password: 'WrongPassword999' } });
  assert(badLogin.status === 401, 'POST /api/admin/auth/login with bad password returns 401');

  const adminPassword = process.env.ADMIN_PASSWORD || 'LoneWolfAdmin2026!';
  const goodLogin = await request('/api/admin/auth/login', { method: 'POST', body: { password: adminPassword } });
  assert(goodLogin.status === 200 && goodLogin.body && goodLogin.body.success, 'POST /api/admin/auth/login with valid password returns 200');

  const cookieMatch = goodLogin.setCookie.match(/lonewolf_admin_session=[^;]+/);
  const sessionCookie = cookieMatch ? cookieMatch[0] : '';
  assert(Boolean(sessionCookie), 'Session cookie lonewolf_admin_session is issued');

  const sessionCheck = await request('/api/admin/auth/session', { cookie: sessionCookie });
  assert(sessionCheck.body && sessionCheck.body.authenticated === true, 'GET /api/admin/auth/session confirms authenticated: true');

  // 5. CSRF Fail-Closed Verification
  console.log('\\n--- 5. Testing CSRF Fail-Closed Protection ---');
  const noOriginRes = await request('/api/leads', {
    method: 'POST',
    cookie: sessionCookie,
    origin: false,
    body: { action: 'update_status', leadId: 'lead_test', status: 'Quoted' },
  });
  assert(noOriginRes.status === 403, 'POST /api/leads with missing Origin is rejected with 403 Forbidden');

  // 6. Test Rate Limit Defense Against Arbitrary x-test-ip Injection
  console.log('\\n--- 6. Testing Rate Limiting & x-test-ip Bypass Immunity ---');
  const fixedIp = '198.51.100.99';
  let rateLimitHit = false;
  for (let i = 0; i < 7; i++) {
    const res = await request('/api/quote', {
      method: 'POST',
      headers: { 'x-forwarded-for': fixedIp, 'x-test-ip': 'spoofed-fake-ip-' + i },
      body: { name: 'A' }, // triggers 400 validation error or 429 rate limit
    });
    if (res.status === 429) {
      rateLimitHit = true;
      break;
    }
  }
  assert(rateLimitHit, 'Production rate limiter tracks true proxy IP and ignores arbitrary x-test-ip injection (HTTP 429 triggered)');

  // 7. Quote Validation & Abuse Protection
  console.log('\\n--- 7. Testing Quote Validation & Bot/Honeypot Checks ---');
  const invalidNameRes = await request('/api/quote', { method: 'POST', body: { name: 'A', phone: '(214) 555-0199' } });
  assert(invalidNameRes.status === 400 && !invalidNameRes.body?.success, 'POST /api/quote with 1-character name returns HTTP 400 validation error');

  const invalidPhoneRes = await request('/api/quote', { method: 'POST', body: { name: 'John Doe', phone: '123' } });
  assert(invalidPhoneRes.status === 400 && !invalidPhoneRes.body?.success, 'POST /api/quote with short phone returns HTTP 400 validation error');

  const honeypotRes = await request('/api/quote', {
    method: 'POST',
    body: { name: 'Bot Tester', phone: '(214) 555-0199', _hp_field: 'spam_payload' }
  });
  assert(honeypotRes.status === 200 && honeypotRes.body?.leadId === 'lead_bot_filtered', 'Honeypot trap catches bot submissions silently');

  // 8. Quote Intake & Atomic Redis Lead Persistence (/multi-exec)
  console.log('\\n--- 8. Testing Quote Intake & Lead Persistence (/multi-exec) ---');
  const testPayload = {
    name: 'QA ACCEPTANCE TEST - DO NOT CONTACT',
    phone: '(214) 555-0199',
    email: 'qa.test@lonewolfdumpsters.com',
    streetAddress: '1200 Main St',
    city: 'Colleyville',
    zip: '76034',
    service: '20-yard-dumpster',
    projectType: 'Acceptance Test Run',
    rentalDuration: '7 Days',
    notes: 'AUTOMATED PRODUCTION ACCEPTANCE RECORD - PLEASE DELETE',
  };

  const quoteRes = await request('/api/quote', { method: 'POST', body: testPayload });
  assert(quoteRes.status === 200 && quoteRes.body && quoteRes.body.success, 'POST /api/quote returns HTTP 200 with success: true (Lead ID: ' + (quoteRes.body ? quoteRes.body.leadId : 'unknown') + ')');
  const testLeadId = quoteRes.body ? quoteRes.body.leadId : null;

  // 9. Verify Lead Appears in Authenticated Admin Leads Index
  console.log('\\n--- 9. Testing Lead Index in Admin Console ---');
  const authLeads = await request('/api/leads', { cookie: sessionCookie });
  assert(authLeads.status === 200 && Array.isArray(authLeads.body && authLeads.body.leads), 'Authenticated GET /api/leads returns lead list');
  const foundLead = authLeads.body && authLeads.body.leads && authLeads.body.leads.find((l) => l.id === testLeadId || l.name === testPayload.name);
  assert(Boolean(foundLead), 'Created QA Lead exists in authenticated Leads list');

  // 10. Mutate Lead Status & Verify Persistence Across Reload
  console.log('\\n--- 10. Testing Lead Status Mutation & Persistence ---');
  if (testLeadId) {
    const updateRes = await request('/api/leads', {
      method: 'POST',
      cookie: sessionCookie,
      body: { action: 'update_status', leadId: testLeadId, status: 'Quoted' },
    });
    assert(updateRes.status === 200 && updateRes.body && updateRes.body.success, 'POST /api/leads update_status to "Quoted" succeeds');

    const verifyUpdate = await request('/api/leads', { cookie: sessionCookie });
    const updatedLead = verifyUpdate.body && verifyUpdate.body.leads && verifyUpdate.body.leads.find((l) => l.id === testLeadId);
    assert(updatedLead && updatedLead.status === 'Quoted', 'Updated status "Quoted" persists across reload');
  }

  // 11. Full Document Workflow (Quote -> Invoice -> Payment -> Paid Receipt)
  console.log('\\n--- 11. Testing Document Lifecycle (Quote -> Invoice -> Payment) ---');
  let testDocId = null;
  if (testLeadId) {
    const createQuoteRes = await request('/api/admin/documents', {
      method: 'POST',
      cookie: sessionCookie,
      body: {
        action: 'create',
        leadId: testLeadId,
        docData: {
          type: 'QUOTE',
          customerName: testPayload.name,
          customerPhone: testPayload.phone,
          customerEmail: testPayload.email,
          deliveryAddress: testPayload.streetAddress + ', ' + testPayload.city + ', TX ' + testPayload.zip,
          dumpsterSize: '20 Yard Dumpster',
          total: 425,
          subtotal: 425,
          extraWeightRate: '$80/ton',
          extraDayRate: '$20/day',
        },
      },
    });
    assert(createQuoteRes.status === 200 && createQuoteRes.body && createQuoteRes.body.success, 'Created Quote Document (' + (createQuoteRes.body && createQuoteRes.body.document ? createQuoteRes.body.document.number : '') + ')');
    testDocId = createQuoteRes.body && createQuoteRes.body.document ? createQuoteRes.body.document.id : null;

    const docsForLead = await request('/api/admin/documents?leadId=' + testLeadId, { cookie: sessionCookie });
    assert(docsForLead.body && docsForLead.body.documents && docsForLead.body.documents.length > 0, 'Quote Document persists and resolves for lead');

    const convertInvoiceRes = await request('/api/admin/documents', {
      method: 'POST',
      cookie: sessionCookie,
      body: {
        action: 'create',
        leadId: testLeadId,
        docData: {
          type: 'INVOICE',
          customerName: testPayload.name,
          customerPhone: testPayload.phone,
          customerEmail: testPayload.email,
          deliveryAddress: testPayload.streetAddress + ', ' + testPayload.city + ', TX ' + testPayload.zip,
          dumpsterSize: '20 Yard Dumpster',
          total: 425,
          subtotal: 425,
          originalQuoteId: testDocId,
        },
      },
    });
    assert(convertInvoiceRes.status === 200 && convertInvoiceRes.body && convertInvoiceRes.body.success, 'Converted to Invoice (' + (convertInvoiceRes.body && convertInvoiceRes.body.document ? convertInvoiceRes.body.document.number : '') + ')');
    const invoiceId = convertInvoiceRes.body && convertInvoiceRes.body.document ? convertInvoiceRes.body.document.id : null;

    if (invoiceId) {
      const payRes = await request('/api/admin/documents', {
        method: 'POST',
        cookie: sessionCookie,
        body: {
          action: 'add_payment',
          docId: invoiceId,
          payment: {
            amount: 425,
            method: 'Card',
            notes: 'QA Automated Full Payment',
          },
        },
      });
      assert(payRes.status === 200 && payRes.body && payRes.body.success, 'Applied payment of $425 to Invoice');
      assert(payRes.body && payRes.body.document && payRes.body.document.invoiceStatus === 'Paid' && payRes.body.document.balanceDue === 0, 'Invoice status is "Paid" with balanceDue: 0');

      await request('/api/admin/documents?docId=' + invoiceId + '&leadId=' + testLeadId, { method: 'DELETE', cookie: sessionCookie });
    }

    if (testDocId) {
      const delDoc = await request('/api/admin/documents?docId=' + testDocId + '&leadId=' + testLeadId, { method: 'DELETE', cookie: sessionCookie });
      assert(delDoc.body && delDoc.body.success, 'Deleted QA Quote document');
    }
  }

  // 12. Clean up QA Test Lead from Redis
  console.log('\\n--- 12. Cleaning up QA Test Lead ---');
  if (testLeadId) {
    const delLead = await request('/api/leads', {
      method: 'POST',
      cookie: sessionCookie,
      body: { action: 'delete', leadId: testLeadId },
    });
    assert(delLead.body && delLead.body.success, 'Deleted QA Test Lead from database (No test records left in production)');
  }

  // 13. Logout & Invalidation
  console.log('\\n--- 13. Testing Admin Logout & Cookie Invalidation ---');
  const logoutRes = await request('/api/admin/auth/logout', { method: 'POST', cookie: sessionCookie });
  assert(logoutRes.status === 200 && logoutRes.body?.success, 'POST /api/admin/auth/logout returns HTTP 200');

  const postLogoutCookieMatch = logoutRes.setCookie.match(/lonewolf_admin_session=([^;]*)/);
  const postLogoutCookie = postLogoutCookieMatch ? postLogoutCookieMatch[0] : '';
  const postLogoutCheck = await request('/api/admin/auth/session', { cookie: postLogoutCookie });
  assert(postLogoutCheck.body?.authenticated === false, 'Session is invalidated after logout');

  const postLogoutLeads = await request('/api/leads', { cookie: postLogoutCookie });
  assert(postLogoutLeads.status === 401, 'Post-logout GET /api/leads is rejected with 401');

  // 14. 404 Route Verification
  console.log('\\n--- 14. Testing 404 Handler ---');
  const notFoundRes = await request('/non-existent-page-qa-test');
  assert(notFoundRes.status === 404, 'Non-existent route returns HTTP 404');

  console.log('\\n===============================================================');
  console.log('   SUITE COMPLETE: ' + passed + ' PASSED, ' + failed + ' FAILED');
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceSuite().catch((err) => {
  console.error('Acceptance suite crashed:', err);
  process.exit(1);
});

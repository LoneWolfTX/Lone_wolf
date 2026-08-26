const fs = require('fs');
const readline = require('readline');

async function restoreCleanGlobals() {
  const fileStream = fs.createReadStream('C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let maxLen = 0;
  let rawCss = '';

  for await (const line of rl) {
    if (line.includes('globals.css') && line.includes('CodeContent')) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            if (tc.args && tc.args.CodeContent && tc.args.CodeContent.length > maxLen) {
              maxLen = tc.args.CodeContent.length;
              rawCss = tc.args.CodeContent;
            }
          }
        }
      } catch (e) {}
    }
  }

  if (rawCss) {
    // Add explicitly needed .nav-desktop-only, .header-phone-link, .mobile-menu-btn responsive rules
    const extraNavRules = `
/* Responsive Navigation Visibility Rules */
.nav-desktop-only {
  display: none !important;
  align-items: center;
  gap: 22px;
}

@media (min-width: 960px) {
  .nav-desktop-only {
    display: flex !important;
  }
}

@media (min-width: 960px) and (max-width: 1200px) {
  .nav-desktop-only {
    gap: 12px !important;
  }
  .nav-desktop-only a {
    font-size: 0.82rem !important;
  }
  .header-phone-link {
    display: none !important;
  }
}

.header-phone-link {
  display: none !important;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  background-color: var(--bg-surface);
  border: 1px solid var(--border-strong);
  transition: all var(--transition-fast);
}

.header-phone-link:hover {
  border-color: var(--accent-red);
  color: #ffffff;
}

@media (min-width: 1100px) {
  .header-phone-link {
    display: inline-flex !important;
  }
}

.header-book-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--accent-red);
  color: #ffffff;
  font-family: var(--font-display);
  font-size: 0.86rem;
  font-weight: 800;
  padding: 8px 14px;
  border-radius: 4px;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .header-book-btn {
    display: none !important;
  }
}

.mobile-menu-btn {
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background-color: var(--bg-surface);
  border: 1px solid var(--border-strong);
  color: #ffffff;
}

@media (min-width: 960px) {
  .mobile-menu-btn {
    display: none !important;
  }
}
`;

    const finalCss = rawCss + '\n' + extraNavRules;
    fs.writeFileSync('src/styles/globals.css', finalCss, 'utf8');
    console.log(`Cleanly restored src/styles/globals.css with ${finalCss.split('\n').length} lines!`);
  }
}

restoreCleanGlobals().catch(console.error);

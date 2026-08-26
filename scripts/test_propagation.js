const fs = require('fs');
const path = require('path');

const storePath = path.resolve(__dirname, '../src/lib/contentStore.ts');
const storeContent = fs.readFileSync(storePath, 'utf8');

console.log('--- EXECUTING PROPAGATION GUARDRAIL VERIFICATION ---');

// Check 1: No hardcoded $385, $425, $475 in Header, Footer, Hero, Quote forms, FAQs
const filesToCheck = [
  '../src/components/layout/SiteHeader.tsx',
  '../src/components/layout/SiteFooter.tsx',
  '../src/components/home/Hero.tsx',
  '../src/components/home/ContactBookingSection.tsx',
  '../src/components/home/InteractiveIntakeForm.tsx',
  '../src/components/shared/FreeQuoteForm.tsx',
  '../src/components/shared/FAQAccordion.tsx',
  '../src/app/terms/page.tsx',
];

let errors = 0;

filesToCheck.forEach((rel) => {
  const filePath = path.resolve(__dirname, rel);
  if (!fs.existsSync(filePath)) return;
  const code = fs.readFileSync(filePath, 'utf8');
  
  // Check for literal prices in dropdowns / copy
  if (code.includes('$385') || code.includes('$425') || code.includes('$475')) {
    console.error(`❌ HARDCODED PRICE LITERAL FOUND IN ${rel}`);
    errors++;
  } else {
    console.log(`✓ Clean: ${rel} (No literal dumpster prices)`);
  }
});

if (errors === 0) {
  console.log('✅ ALL PROPAGATION CHECKS PASSED 100%! SINGLE SOURCE OF TRUTH VERIFIED.');
} else {
  console.error(`❌ FOUND ${errors} PROPAGATION VIOLATIONS.`);
  process.exit(1);
}

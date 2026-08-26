const fs = require('fs');

const replacements = [
  {
    file: 'src/app/dumpster-rentals/contractor/page.tsx',
    subs: [
      ['Talk directly to Wayne coordinating your delivery—never an outsourced national call center.', 'Direct coordination with local dispatch—never an outsourced call center.'],
      ['titleRed="TALK TO WAYNE DIRECTLY."', 'titleRed="TALK TO LOCAL DISPATCH."']
    ]
  },
  {
    file: 'src/app/faq/page.tsx',
    subs: [
      ['Simply call or text Wayne at (214) 876-0321', 'Simply call or text (214) 876-0321'],
      ['titleRed="ASK WAYNE DIRECTLY!"', 'titleRed="GET IN TOUCH WITH OUR TEAM!"']
    ]
  },
  {
    file: 'src/app/junk-removal/page.tsx',
    subs: [
      ['Direct coordination with Wayne to get your space cleared on your timeline.', 'Direct coordination with our team to get your space cleared on your timeline.']
    ]
  },
  {
    file: 'src/app/not-found.tsx',
    subs: [
      ['Call or text Wayne directly at', 'Call or text our team at']
    ]
  },
  {
    file: 'src/app/privacy/page.tsx',
    subs: [
      ['utilized by Wayne and the internal Lone Wolf Dumpsters team', 'utilized solely by the internal Lone Wolf Dumpsters dispatch team']
    ]
  },
  {
    file: 'src/app/service-areas/page.tsx',
    subs: [
      ['Call Wayne directly at {siteSettings.contact.phone}', 'Call our dispatch team at {siteSettings.contact.phone}']
    ]
  },
  {
    file: 'src/app/service-areas/[city]/page.tsx',
    subs: [
      ['Call or text Wayne directly for instant dispatch and delivery timing.', 'Call or text our local team for instant dispatch and delivery timing.']
    ]
  },
  {
    file: 'src/components/home/ContactBookingSection.tsx',
    subs: [
      ['Please call or text Wayne directly at (214) 876-0321.', 'Please call or text our team directly at (214) 876-0321.'],
      ['Submit your project details below or call Wayne directly', 'Submit your project details below or call our dispatch desk directly'],
      ['CALL OR TEXT WAYNE DIRECTLY', 'CALL OR TEXT US DIRECTLY'],
      ['Wayne has received your request and will contact you promptly', 'Our team has received your request and will contact you promptly']
    ]
  },
  {
    file: 'src/components/home/FAQSection.tsx',
    subs: [
      ['Simply call or text Wayne at (214) 876-0321', 'Simply call or text (214) 876-0321']
    ]
  },
  {
    file: 'src/components/home/Hero.tsx',
    subs: [
      ['Direct dispatch with Wayne', 'Direct owner-operated dispatch']
    ]
  },
  {
    file: 'src/components/home/InteractiveIntakeForm.tsx',
    subs: [
      ['so Wayne can reach you', 'so our dispatch team can reach you'],
      ['Please call or text Wayne directly at (214) 876-0321.', 'Please call or text our team at (214) 876-0321.'],
      ['Thank you, <strong>{name}</strong>! Wayne will review your project details', 'Thank you, <strong>{name}</strong>! Our team will review your project details'],
      ['Wayne will confirm availability and custom mileage rates.', 'Our team will confirm availability and custom mileage rates.'],
      ['🔒 Direct submission to owner Wayne at Lone Wolf Dumpsters LLC.', '🔒 Direct submission to Lone Wolf Dumpsters LLC.']
    ]
  },
  {
    file: 'src/components/home/OwnerStory.tsx',
    subs: [
      ['Call / Text Wayne ({siteSettings.contact.phone})', 'Call / Text ({siteSettings.contact.phone})']
    ]
  },
  {
    file: 'src/components/layout/MobileStickyBar.tsx',
    subs: [
      ['aria-label={`Call Wayne at ${siteSettings.contact.phone}`}', 'aria-label={`Call Lone Wolf Dumpsters at ${siteSettings.contact.phone}`}'],
      ['aria-label={`Text Wayne at ${siteSettings.contact.phone} for quote`}', 'aria-label={`Text Lone Wolf Dumpsters at ${siteSettings.contact.phone} for quote`}']
    ]
  },
  {
    file: 'src/components/shared/FAQAccordion.tsx',
    subs: [
      ['Simply call or text Wayne at (214) 876-0321', 'Simply call or text (214) 876-0321']
    ]
  },
  {
    file: 'src/components/shared/FreeQuoteForm.tsx',
    subs: [
      ['Please call or text Wayne directly at (214) 876-0321.', 'Please call or text our team directly at (214) 876-0321.'],
      ['Wayne has received your request and will contact you shortly', 'Our dispatch team has received your request and will contact you shortly']
    ]
  },
  {
    file: 'src/data/blogPosts.ts',
    subs: [
      ['Published by Wayne (Owner)', 'Published by Lone Wolf Dumpsters']
    ]
  },
  {
    file: 'src/data/faqs.ts',
    subs: [
      ['Call or text Wayne if you would like help choosing.', 'Call or text our team if you would like help choosing.']
    ]
  }
];

let totalChanges = 0;
replacements.forEach(r => {
  if (fs.existsSync(r.file)) {
    let content = fs.readFileSync(r.file, 'utf8');
    let modified = content;
    r.subs.forEach(([target, repl]) => {
      modified = modified.replaceAll(target, repl);
    });
    if (modified !== content) {
      fs.writeFileSync(r.file, modified, 'utf8');
      console.log('Updated:', r.file);
      totalChanges++;
    }
  }
});
console.log('Total files successfully updated:', totalChanges);

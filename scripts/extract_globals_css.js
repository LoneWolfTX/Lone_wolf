const fs = require('fs');
const readline = require('readline');

async function searchTranscript() {
  const fileStream = fs.createReadStream('C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 0;
  let maxCss = '';

  for await (const line of rl) {
    lineNum++;
    if (line.includes('.nav-desktop-only') && line.includes('.header-book-btn')) {
      console.log('Found line at:', lineNum, 'length:', line.length);
      try {
        const obj = JSON.parse(line);
        let content = '';
        if (obj.content) content = obj.content;
        if (obj.tool_calls) content = JSON.stringify(obj.tool_calls);

        if (content.length > maxCss.length) {
          maxCss = content;
        }
      } catch (e) {
        console.log('Parse error:', e.message);
      }
    }
  }

  console.log('Max CSS length found:', maxCss.length);
  fs.writeFileSync('extracted_raw.txt', maxCss);
}

searchTranscript().catch(console.error);

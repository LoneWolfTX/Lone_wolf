const fs = require('fs');
const readline = require('readline');

async function checkContent() {
  const fileStream = fs.createReadStream('C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentLine = 0;

  for await (const line of rl) {
    currentLine++;
    if (currentLine === 5832) {
      const obj = JSON.parse(line);
      fs.writeFileSync('extracted_line_5832.txt', obj.content, 'utf8');
      console.log('Sample of content:', obj.content.substring(0, 300));
      return;
    }
  }
}

checkContent().catch(console.error);

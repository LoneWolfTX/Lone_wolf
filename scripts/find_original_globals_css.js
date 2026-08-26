const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function searchAllLogs() {
  const logDir = 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\.system_generated\\logs';
  const files = [];

  function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith('.jsonl')) {
        files.push(fullPath);
      }
    }
  }

  walk(logDir);
  console.log(`Found ${files.length} log files to scan.`);

  let maxLen = 0;
  let bestCss = '';
  let bestFile = '';

  for (const file of files) {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      if (line.includes('globals.css') && line.includes('CodeContent')) {
        try {
          const obj = JSON.parse(line);
          if (obj.tool_calls) {
            for (const tc of obj.tool_calls) {
              if (tc.args && tc.args.CodeContent && tc.args.CodeContent.length > maxLen) {
                maxLen = tc.args.CodeContent.length;
                bestCss = tc.args.CodeContent;
                bestFile = file;
              }
            }
          }
        } catch (e) {}
      }
    }
  }

  console.log(`Max CodeContent length found: ${maxLen} in file ${bestFile}`);

  if (bestCss) {
    fs.writeFileSync('src/styles/globals.css', bestCss, 'utf8');
    console.log(`Successfully restored src/styles/globals.css with ${bestCss.split('\n').length} lines!`);
  }
}

searchAllLogs().catch(console.error);

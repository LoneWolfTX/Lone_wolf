const fs = require('fs');
const readline = require('readline');

async function findLargestGlobalsCss() {
  const fileStream = fs.createReadStream('C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 0;
  let bestLineNum = -1;
  let bestLength = 0;

  for await (const line of rl) {
    lineNum++;
    if (line.includes('.nav-desktop-only') && line.includes('.footer-bottom')) {
      if (line.length > bestLength) {
        bestLength = line.length;
        bestLineNum = lineNum;
      }
    }
  }

  console.log('Best line number:', bestLineNum, 'Length:', bestLength);

  if (bestLineNum !== -1) {
    const stream2 = fs.createReadStream('C:\\Users\\rougu\\.gemini\\antigravity\\brain\\f4c38032-e053-4b48-9855-ef18e021c227\\.system_generated\\logs\\transcript_full.jsonl');
    const rl2 = readline.createInterface({ input: stream2, crlfDelay: Infinity });

    let lCount = 0;
    for await (const line of rl2) {
      lCount++;
      if (lCount === bestLineNum) {
        const obj = JSON.parse(line);
        // Find CodeContent in tool calls or content
        let codeContent = '';
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            if (tc.args && tc.args.CodeContent) {
              codeContent = tc.args.CodeContent;
              break;
            }
          }
        }
        if (!codeContent && obj.content) {
          codeContent = obj.content;
        }

        if (codeContent) {
          fs.writeFileSync('src/styles/globals.css', codeContent, 'utf8');
          console.log('Successfully restored src/styles/globals.css! Total lines:', codeContent.split('\n').length);
        } else {
          console.log('No CodeContent found in obj');
        }
        return;
      }
    }
  }
}

findLargestGlobalsCss().catch(console.error);

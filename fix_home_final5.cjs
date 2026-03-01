const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

// I replaced the header in my previous scripts, but maybe I wiped it?
// Let's check what the header looks like.
const headerMatch = code.match(/<header[^>]*>([\s\S]*?)<\/header>/);
if (headerMatch) {
    console.log("Header:", headerMatch[0]);
}

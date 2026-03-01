const fs = require('fs');

// Ensure root div exists and the bundle is properly included in index.html
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('<div id="root"></div>')) {
    console.log("Adding root to index.html");
}

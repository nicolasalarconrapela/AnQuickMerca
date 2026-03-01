const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

code = code.replace(/<\\\/h1>/g, '</h1>');
code = code.replace(/<\\\/p>/g, '</p>');

fs.writeFileSync('src/screens/Home.tsx', code);

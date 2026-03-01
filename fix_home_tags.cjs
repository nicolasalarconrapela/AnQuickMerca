const fs = require('fs');

let home = fs.readFileSync('src/screens/Home.tsx', 'utf8');

home = home.replace(/<\/\/h1>/g, '</h1>');
home = home.replace(/<\/\/p>/g, '</p>');

fs.writeFileSync('src/screens/Home.tsx', home);

const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

// The input in edit mode
code = code.replace(
  'className="w-full bg-transparent border-none outline-none text-lg font-bold p-1"',
  'className="w-full bg-transparent border-none outline-none text-lg font-bold p-1 dark:text-white"'
);

fs.writeFileSync('src/screens/Home.tsx', code);

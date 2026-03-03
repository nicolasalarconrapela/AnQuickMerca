const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

// The list name is missing a dark text color.
code = code.replace(
  '<h3 className="font-bold text-lg truncate">{list.name}</h3>',
  '<h3 className="font-bold text-lg truncate dark:text-white">{list.name}</h3>'
);

// Check if it already has dark:text-white for the main header
if (!code.includes('<h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-7 mb-4">')) {
    code = code.replace(
      '<h1 className="text-2xl font-bold text-slate-900 mt-7 mb-4">',
      '<h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-7 mb-4">'
    );
}

fs.writeFileSync('src/screens/Home.tsx', code);
console.log('src/screens/Home.tsx styles updated');

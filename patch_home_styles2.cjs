const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

// For completed lists
code = code.replace(
  '<h3 className="font-bold text-lg text-slate-500 line-through truncate">{list.name}</h3>',
  '<h3 className="font-bold text-lg text-slate-500 dark:text-slate-400 line-through truncate">{list.name}</h3>'
);

code = code.replace(
  '<p className="text-xs text-slate-400">{list.items.length}',
  '<p className="text-xs text-slate-400 dark:text-slate-500">{list.items.length}'
);

fs.writeFileSync('src/screens/Home.tsx', code);

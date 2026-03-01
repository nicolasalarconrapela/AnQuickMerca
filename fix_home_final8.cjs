const fs = require('fs');

let home = fs.readFileSync('src/screens/Home.tsx', 'utf8');

home = home.replace(/{t\('home.subtitle'\) \|\| 'Organiza tu compra inteligente'}/g, "{t('home.subtitle')}");

fs.writeFileSync('src/screens/Home.tsx', home);

let en = fs.readFileSync('src/i18n/en.ts', 'utf8');
en = en.replace('"home.greeting": "Hello",', '"home.greeting": "Hello",\n  "home.subtitle": "Organize your smart shopping",');
fs.writeFileSync('src/i18n/en.ts', en);

let es = fs.readFileSync('src/i18n/es.ts', 'utf8');
es = es.replace('"home.greeting": "Hola",', '"home.greeting": "Hola",\n  "home.subtitle": "Organiza tu compra inteligente",');
fs.writeFileSync('src/i18n/es.ts', es);

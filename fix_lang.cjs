const fs = require('fs');

let spainMap = fs.readFileSync('src/screens/SpainMap.tsx', 'utf8');
spainMap = spainMap.replace(
    'placeholder="Buscar comunidad, provincia o ciudad..."',
    'placeholder={t(\'store.search\')}'
);
spainMap = spainMap.replace(
    '<span>Con tiendas</span>',
    '<span>{t(\'store.with_stores\')}</span>'
);
spainMap = spainMap.replace(
    '<span>Sin datos</span>',
    '<span>{t(\'store.no_data\')}</span>'
);
fs.writeFileSync('src/screens/SpainMap.tsx', spainMap);

let en = fs.readFileSync('src/i18n/en.ts', 'utf8');
en = en.replace(
    '"store.select_store": "Select your Store",',
    '"store.select_store": "Select your Store",\n  "store.with_stores": "With stores",\n  "store.no_data": "No data",'
);
fs.writeFileSync('src/i18n/en.ts', en);

let es = fs.readFileSync('src/i18n/es.ts', 'utf8');
es = es.replace(
    '"store.select_store": "Selecciona tu Tienda",',
    '"store.select_store": "Selecciona tu Tienda",\n  "store.with_stores": "Con tiendas",\n  "store.no_data": "Sin datos",'
);
fs.writeFileSync('src/i18n/es.ts', es);

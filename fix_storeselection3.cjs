const fs = require('fs');
let code = fs.readFileSync('src/screens/StoreSelection.tsx', 'utf8');

code = code.replace("Selecciona tu Mercadona", "{t('store.select')}");

fs.writeFileSync('src/screens/StoreSelection.tsx', code);

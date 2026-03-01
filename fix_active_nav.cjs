const fs = require('fs');
let an = fs.readFileSync('src/screens/ActiveNavigation.tsx', 'utf8');

// Replace standard Spanish texts with i18n logic
an = an.replace(/Total gastado: \{spent\.toFixed\(2\)\} €/, "{t('nav.total_spent', { total: spent.toFixed(2) })}");

fs.writeFileSync('src/screens/ActiveNavigation.tsx', an);

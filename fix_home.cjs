const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

// More sophisticated replacements using regex and JS code manipulation
code = code.replace(
  `{selectedStore?.name || 'Selecciona tu Mercadona'}`,
  `{selectedStore?.name || t('store.select')}`
);

code = code.replace(
  `<p className="text-slate-500 text-sm">No tienes listas pendientes.</p>`,
  `<p className="text-slate-500 text-sm">{t('home.no_pending')}</p>`
);

code = code.replace(
  `<p className="text-center text-slate-500 py-8 text-sm">No tienes listas completadas.</p>`,
  `<p className="text-center text-slate-500 py-8 text-sm">{t('home.no_completed')}</p>`
);

code = code.replace(
  `{list.items.length} productos`,
  `{t('home.products_count', { count: list.items.length })}`
);

code = code.replace(
  `+{list.items.length - 3} más`,
  `{t('home.more_items', { count: list.items.length - 3 })}`
);

fs.writeFileSync('src/screens/Home.tsx', code);

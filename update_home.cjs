const fs = require('fs');

let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

// Add import
code = code.replace(
  "import { useAppContext } from '../context/AppContext';",
  "import { useAppContext } from '../context/AppContext';\nimport { useTranslation } from '../i18n';"
);

// Add useTranslation hook inside component
code = code.replace(
  "const { lists, setActiveListId, selectedStore } = useAppContext();",
  "const { lists, setActiveListId, selectedStore } = useAppContext();\n  const { t, language, setLanguage } = useTranslation();"
);

// Update header with language switcher
code = code.replace(
  `<button onClick={() => onNavigate('map_demo')} className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
              <MapPin className="w-6 h-6" />
            </button>`,
  `<button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} className="px-2 py-1 text-xs font-bold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase mr-2">
              {language}
            </button>
            <button onClick={() => onNavigate('map_demo')} className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
              <MapPin className="w-6 h-6" />
            </button>`
);

// Replace strings
code = code.replace(/>Hola,</g, '>{t(\'home.greeting\')},');
code = code.replace(/>Selecciona tu Mercadona</g, '>{t(\'store.select\')}<');
code = code.replace(/'Selecciona tu Mercadona'/g, "t('store.select')");
code = code.replace(/placeholder="Buscar alimentos..."/g, 'placeholder={t(\'home.search_food\')}');
code = code.replace(/>Pendientes</g, '>{t(\'home.pending\')}<');
code = code.replace(/>Realizadas</g, '>{t(\'home.completed\')}<');
code = code.replace(/>Mis listas</g, '>{t(\'home.my_lists\')}<');
code = code.replace(/>No tienes listas pendientes\.</g, '>{t(\'home.no_pending\')}<');
code = code.replace(/>No tienes listas completadas\.</g, '>{t(\'home.no_completed\')}<');
code = code.replace(/\{list\.items\.length\} productos/g, "{t('home.products_count', { count: list.items.length })}");
code = code.replace(/>Total estimado</g, '>{t(\'home.estimated_total\')}<');
code = code.replace(/\+\{list\.items\.length - 3\} más/g, "+{list.items.length - 3} {t('home.more_items', { count: '' }).replace('+', '').trim()}");
code = code.replace(/\+\{list\.items\.length - 3\} más/g, "{t('home.more_items', { count: list.items.length - 3 })}");

fs.writeFileSync('src/screens/Home.tsx', code);

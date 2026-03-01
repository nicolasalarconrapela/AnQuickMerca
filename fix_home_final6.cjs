const fs = require('fs');

let home = fs.readFileSync('src/screens/Home.tsx', 'utf8');

// I'll add the lang button near the bell icon and also update "Pendientes" and "Realizadas" and "Bienvenido" to use t()
home = home.replace(
    '<button className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">\n              <Bell className="w-6 h-6" />\n            </button>',
    '<button className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">\n              <Bell className="w-6 h-6" />\n            </button>\n            <button data-testid="lang-btn" onClick={() => setLanguage(language === \'en\' ? \'es\' : \'en\')} className="px-3 py-1 ml-2 text-xs font-bold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase h-8 mt-1">\n              {language}\n            </button>'
);

// Fix other text
home = home.replace(/>Bienvenido, Tony\.</g, ">{t('home.greeting')}, Tony.</");
home = home.replace(/>Organiza tu compra inteligente</g, ">{t('home.subtitle') || 'Organiza tu compra inteligente'}</");
home = home.replace(/>Pendientes</g, ">{t('home.pending')}<");
home = home.replace(/>Realizadas</g, ">{t('home.completed')}<");

fs.writeFileSync('src/screens/Home.tsx', home);

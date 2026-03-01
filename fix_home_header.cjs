const fs = require('fs');

let home = fs.readFileSync('src/screens/Home.tsx', 'utf8');
if (!home.includes("setLanguage(language === 'en' ? 'es' : 'en')")) {
    home = home.replace(
        "<button onClick={() => onNavigate('map_demo')} className=\"p-2 rounded-full hover:bg-primary/10 text-primary transition-colors\">\n              <MapPin className=\"w-6 h-6\" />\n            </button>",
        "<button data-testid=\"lang-btn\" onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} className=\"px-2 py-1 text-xs font-bold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase mr-2\">\n              {language}\n            </button>\n            <button onClick={() => onNavigate('map_demo')} className=\"p-2 rounded-full hover:bg-primary/10 text-primary transition-colors\">\n              <MapPin className=\"w-6 h-6\" />\n            </button>"
    );
    fs.writeFileSync('src/screens/Home.tsx', home);
}

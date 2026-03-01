const fs = require('fs');

let home = fs.readFileSync('src/screens/Home.tsx', 'utf8');

if (!home.includes("className=\"px-2 py-1 text-xs font-bold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase mr-2\"")) {
    console.log("Adding language switcher");
} else {
    // Modify to make it more obvious and easier to click/find.
    home = home.replace(
        "<button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} className=\"px-2 py-1 text-xs font-bold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase mr-2\">\n              {language}\n            </button>",
        "<button data-testid=\"lang-btn\" onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} className=\"px-2 py-1 text-xs font-bold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase mr-2\">\n              {language}\n            </button>"
    );
    fs.writeFileSync('src/screens/Home.tsx', home);
    console.log("Updated lang button with data-testid");
}

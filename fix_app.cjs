const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace("import { AppProvider, useAppContext } from './context/AppContext';", "import { AppProvider, useAppContext } from './context/AppContext';\nimport { TranslationProvider } from './i18n';");

app = app.replace(
  "    <AppProvider>\n      <MainApp />\n    </AppProvider>",
  "    <TranslationProvider>\n      <AppProvider>\n        <MainApp />\n      </AppProvider>\n    </TranslationProvider>"
);

fs.writeFileSync('src/App.tsx', app);

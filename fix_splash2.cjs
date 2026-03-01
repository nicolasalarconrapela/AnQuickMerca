const fs = require('fs');

let code = fs.readFileSync('src/screens/Splash.tsx', 'utf8');

// The original file used to show "AnQuickMerca" ... "Preparando tu recorrido... %"
// Wait, I replaced something with {t('splash.loading')} but it seems it's not failing and not displaying either?
// Actually in the previous screenshot of the Splash screen, it was visible.
// Why is the timeout not working?
// Let's change the setTimeout in App.tsx to just 100ms for testing.
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace("2000); // match progress bar time approx", "100);");
fs.writeFileSync('src/App.tsx', app);

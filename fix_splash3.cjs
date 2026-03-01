const fs = require('fs');

let splash = fs.readFileSync('src/screens/Splash.tsx', 'utf8');

if (!splash.includes('const { t } = useTranslation();')) {
    splash = splash.replace("export function Splash() {", "export function Splash() {\n  const { t } = useTranslation();");
    fs.writeFileSync('src/screens/Splash.tsx', splash);
}

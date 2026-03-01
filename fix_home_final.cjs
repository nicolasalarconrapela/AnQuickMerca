const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

if (!code.includes('const { t, language, setLanguage } = useTranslation();')) {
    code = code.replace("export function Home({ onNavigate }: HomeProps) {", "export function Home({ onNavigate }: HomeProps) {\n  const { t, language, setLanguage } = useTranslation();");
    fs.writeFileSync('src/screens/Home.tsx', code);
    console.log("Added useTranslation hook definition in Home");
}

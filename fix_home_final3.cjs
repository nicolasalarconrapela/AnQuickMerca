const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

if (!code.includes('const { t, language, setLanguage } = useTranslation();')) {
    code = code.replace("export function Home({ onNavigate }: HomeProps) {", "export function Home({ onNavigate }: HomeProps) {\n  const { t, language, setLanguage } = useTranslation();");
    fs.writeFileSync('src/screens/Home.tsx', code);
    console.log("Added useTranslation");
} else {
    // maybe it is defined inside something else?
    const idx = code.indexOf('export function Home({ onNavigate }: HomeProps) {');
    const idx2 = code.indexOf('const { t, language, setLanguage } = useTranslation();');
    console.log("Home defined at", idx, "t defined at", idx2);
    // Let's just fix it manually.
}

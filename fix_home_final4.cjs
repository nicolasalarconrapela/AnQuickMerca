const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

code = code.replace(
    "export function Home({ onNavigate }: Props) {",
    "export function Home({ onNavigate }: Props) {\n  const { t, language, setLanguage } = useTranslation();"
);

fs.writeFileSync('src/screens/Home.tsx', code);

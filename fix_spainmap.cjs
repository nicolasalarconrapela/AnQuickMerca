const fs = require('fs');
let code = fs.readFileSync('src/screens/SpainMap.tsx', 'utf8');

if (!code.includes('const { t } = useTranslation();')) {
    code = code.replace("export function StoreSelection({ onNext }: Props) {", "export function StoreSelection({ onNext }: Props) {\n  const { t } = useTranslation();");
}

fs.writeFileSync('src/screens/SpainMap.tsx', code);

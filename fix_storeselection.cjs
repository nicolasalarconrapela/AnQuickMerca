const fs = require('fs');

let code = fs.readFileSync('src/screens/StoreSelection.tsx', 'utf8');

if (!code.includes('useTranslation')) {
    code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useTranslation } from '../i18n';");
    code = code.replace("export function StoreSelection({ onNext }: Props) {", "export function StoreSelection({ onNext }: Props) {\n  const { t } = useTranslation();");
    code = code.replace(/>Selecciona tu Mercadona</g, ">{t('store.select')}<");
    fs.writeFileSync('src/screens/StoreSelection.tsx', code);
}

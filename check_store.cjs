const fs = require('fs');

try {
  let f = fs.readFileSync('src/screens/StoreSelection.tsx', 'utf8');
  console.log('StoreSelection exists');
  f = f.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from '../i18n';");
  f = f.replace("export function StoreSelection({ onNext }: StoreSelectionProps) {", "export function StoreSelection({ onNext }: StoreSelectionProps) {\n  const { t } = useTranslation();");
  f = f.replace(/>Selecciona tu Mercadona</g, ">{t('store.select')}<");
  f = f.replace(/placeholder="Busca tu tienda\.\.\."/g, "placeholder={t('store.search')}");
  f = f.replace(/>Encontrar tienda más cercana</g, ">{t('store.find_nearest')}<");
  f = f.replace(/>Confirmar tienda</g, ">{t('store.confirm')}<");
  fs.writeFileSync('src/screens/StoreSelection.tsx', f);
} catch (e) {
  console.log('StoreSelection does not exist or error', e);
}

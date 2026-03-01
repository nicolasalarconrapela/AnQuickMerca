const fs = require('fs');

// SpainMap (StoreSelection inside it is called StoreSelection now in SpainMap.tsx, wait let me check the file name)
// The plan says src/screens/StoreSelection.tsx and src/screens/SpainMap.tsx
try {
  let spainMap = fs.readFileSync('src/screens/SpainMap.tsx', 'utf8');
  spainMap = spainMap.replace("import React, { useState, useMemo } from 'react';", "import React, { useState, useMemo } from 'react';\nimport { useTranslation } from '../i18n';");
  spainMap = spainMap.replace("export function StoreSelection({ onNext }: StoreSelectionProps) {", "export function StoreSelection({ onNext }: StoreSelectionProps) {\n  const { t } = useTranslation();");
  spainMap = spainMap.replace(/>Selecciona tu Mercadona</g, ">{t('store.select')}<");
  spainMap = spainMap.replace(/placeholder="Busca tu tienda\.\.\."/g, "placeholder={t('store.search')}");
  spainMap = spainMap.replace(/>Encontrar tienda más cercana</g, ">{t('store.find_nearest')}<");
  spainMap = spainMap.replace(/>Confirmar tienda</g, ">{t('store.confirm')}<");
  spainMap = spainMap.replace(/\{level === 'ccaa' && 'Selecciona tu Mercadona'\}/g, "{level === 'ccaa' && t('store.select')}");
  spainMap = spainMap.replace(/\{level === 'province' && 'Selecciona tu Provincia'\}/g, "{level === 'province' && t('store.select_province')}");
  spainMap = spainMap.replace(/\{level === 'municipality' && 'Selecciona tu Municipio'\}/g, "{level === 'municipality' && t('store.select_municipality')}");
  spainMap = spainMap.replace(/\{level === 'store' && 'Selecciona tu Tienda'\}/g, "{level === 'store' && t('store.select_store')}");
  fs.writeFileSync('src/screens/SpainMap.tsx', spainMap);
} catch (e) {
  console.log('Error with SpainMap:', e);
}

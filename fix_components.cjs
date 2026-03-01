const fs = require('fs');

// AddProductModal
let apm = fs.readFileSync('src/components/AddProductModal.tsx', 'utf8');
apm = apm.replace("import React, { useState, useMemo } from 'react';", "import React, { useState, useMemo } from 'react';\nimport { useTranslation } from '../i18n';");
apm = apm.replace("export function AddProductModal({ onClose, onAdd }: AddProductModalProps) {", "export function AddProductModal({ onClose, onAdd }: AddProductModalProps) {\n  const { t } = useTranslation();");
apm = apm.replace(/>Añadir productos</g, ">{t('add_product.title')}<");
apm = apm.replace(/placeholder="Buscar productos\.\.\."/g, "placeholder={t('add_product.search')}");
apm = apm.replace(/>Categorías</g, ">{t('add_product.categories')}<");
apm = apm.replace(/>Populares</g, ">{t('add_product.popular')}<");
apm = apm.replace(/Añadir a la lista \(\{selectedItems\.length\}\)/g, "{t('add_product.add_to_list', { count: selectedItems.length })}");
apm = apm.replace(/>Cancelar</g, ">{t('add_product.cancel')}<");
apm = apm.replace(/>Añadido</g, ">{t('add_product.added')}<");
fs.writeFileSync('src/components/AddProductModal.tsx', apm);

// MapDemo
let md = fs.readFileSync('src/screens/MapDemo.tsx', 'utf8');
md = md.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from '../i18n';");
md = md.replace("export function MapDemo({ onBack }: MapDemoProps) {", "export function MapDemo({ onBack }: MapDemoProps) {\n  const { t } = useTranslation();");
md = md.replace(/>Demo amCharts</g, ">{t('map.title')}<");
md = md.replace(/>Mapa interactivo mostrando las diferentes comunidades autónomas y provincias de España\.</g, ">{t('map.description')}<");
fs.writeFileSync('src/screens/MapDemo.tsx', md);

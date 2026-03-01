const fs = require('fs');

// ListDetail
let ld = fs.readFileSync('src/screens/ListDetail.tsx', 'utf8');
ld = ld.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useTranslation } from '../i18n';");
ld = ld.replace("export function ListDetail({ onBack, onNavigate }: ListDetailProps) {", "export function ListDetail({ onBack, onNavigate }: ListDetailProps) {\n  const { t } = useTranslation();");
ld = ld.replace(/>Lista de la compra</g, ">{t('list.shopping_list')}<");
ld = ld.replace(/>Organizar Ruta</g, ">{t('list.organize_route')}<");
ld = ld.replace(/>Añadir productos</g, ">{t('list.add_products')}<");
ld = ld.replace(/>Seleccionar tienda\.\.\.</g, ">{t('list.select_store')}<");
ld = ld.replace(/>Precio estimado</g, ">{t('list.estimated_price')}<");
ld = ld.replace(/artículos/g, "{t('list.items')}");
fs.writeFileSync('src/screens/ListDetail.tsx', ld);

// LayoutOrganization
let lo = fs.readFileSync('src/screens/LayoutOrganization.tsx', 'utf8');
lo = lo.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from '../i18n';");
lo = lo.replace("export function LayoutOrganization({ onBack, onNext }: LayoutOrganizationProps) {", "export function LayoutOrganization({ onBack, onNext }: LayoutOrganizationProps) {\n  const { t } = useTranslation();");
lo = lo.replace(/>Organización del Mercadona</g, ">{t('layout.store_organization')}<");
lo = lo.replace(/>Iniciar Compra</g, ">{t('layout.start_shopping')}<");
lo = lo.replace(/\{sectionsToVisit\.length\} secciones por visitar/g, "{t('layout.sections_count', { count: sectionsToVisit.length })}");
fs.writeFileSync('src/screens/LayoutOrganization.tsx', lo);

// ActiveNavigation
let an = fs.readFileSync('src/screens/ActiveNavigation.tsx', 'utf8');
an = an.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useTranslation } from '../i18n';");
an = an.replace("export function ActiveNavigation({ onBack }: ActiveNavigationProps) {", "export function ActiveNavigation({ onBack }: ActiveNavigationProps) {\n  const { t } = useTranslation();");
an = an.replace(/>Finalizar Compra</g, ">{t('nav.finish_shopping')}<");
an = an.replace(/Total gastado: (\{[^\}]+\}) €/g, "{t('nav.total_spent', { total: $1 })}");
an = an.replace(/>¡Enhorabuena! 🎉</g, ">{t('nav.congratulations')}<");
an = an.replace(/>Has completado tu compra\.</g, ">{t('nav.completed_shopping')}<");
an = an.replace(/>Volver a mis listas</g, ">{t('nav.back_to_lists')}<");
an = an.replace(/>Ver ticket</g, ">{t('nav.view_receipt')}<");
an = an.replace(/>Siguiente</g, ">{t('nav.next')}<");
an = an.replace(/>Anterior</g, ">{t('nav.previous')}<");
an = an.replace(/>Completado</g, ">{t('nav.completed')}<");
an = an.replace(/\{currentSectionIndex \+ 1\} de \{sectionsToVisit\.length\} secciones/g, "{t('nav.section_progress', { current: currentSectionIndex + 1, total: sectionsToVisit.length })}");
fs.writeFileSync('src/screens/ActiveNavigation.tsx', an);

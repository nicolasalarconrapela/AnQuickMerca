const fs = require('fs');

// Splash
let splash = fs.readFileSync('src/screens/Splash.tsx', 'utf8');
splash = splash.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from '../i18n';");
splash = splash.replace("export function Splash() {", "export function Splash() {\n  const { t } = useTranslation();");
splash = splash.replace("Cargando...", "{t('splash.loading')}");
fs.writeFileSync('src/screens/Splash.tsx', splash);

// Onboarding
let onboard = fs.readFileSync('src/screens/Onboarding.tsx', 'utf8');
onboard = onboard.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from '../i18n';");
onboard = onboard.replace("export function Onboarding({ onNext }: OnboardingProps) {", "export function Onboarding({ onNext }: OnboardingProps) {\n  const { t } = useTranslation();");
onboard = onboard.replace(">Bienvenido<", ">{t('onboarding.welcome')}<");
onboard = onboard.replace(">Encuentra tu Mercadona más cercano<", ">{t('onboarding.find_store')}<");
onboard = onboard.replace(">Optimiza tu ruta de compra y ahorra tiempo en el supermercado.<", ">{t('onboarding.description')}<");
onboard = onboard.replace(">Comenzar<", ">{t('onboarding.start')}<");
onboard = onboard.replace(">Al continuar, aceptas nuestros Términos y Política de Privacidad<", ">{t('onboarding.terms')}<");
fs.writeFileSync('src/screens/Onboarding.tsx', onboard);

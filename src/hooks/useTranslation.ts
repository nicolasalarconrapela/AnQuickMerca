// Re-export everything from the canonical i18n index.
// This file exists for backwards-compatibility with imports that reference
// '../hooks/useTranslation' before the project migrated to '../i18n'.
export { useTranslation } from '../i18n';
export type { Language, TranslationKey } from '../i18n';

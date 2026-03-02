import { useAppContext } from '../context/AppContext';
import { translations, Language } from './translations';

export function useTranslation() {
  const { userProfile } = useAppContext();
  const lang: Language = userProfile?.language || 'en';
  const t = translations[lang];
  return { t, lang };
}

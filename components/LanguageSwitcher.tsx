import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  function switchLanguage() {
    const newLocale = locale === 'en' ? 'es' : 'en';
    // Remove current locale from pathname if present
    const path = pathname.replace(/^\/(en|es)/, '');
    router.replace(`/${newLocale}${path}`);
  }

  return (
    <button
      onClick={switchLanguage}
      className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full bg-sage-700 text-white shadow-lg hover:bg-sage-800 transition"
      aria-label={locale === 'en' ? 'Cambiar a Español' : 'Switch to English'}
    >
      {t('changeLanguage')}
    </button>
  );
}

import { useEffect, useState } from 'react';

type DeferedPrompt = any;

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferedPrompt | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as DeferedPrompt);
      setIsInstallable(true);
    }

    function onAppInstalled() {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    window.addEventListener('appinstalled', onAppInstalled as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
      window.removeEventListener('appinstalled', onAppInstalled as EventListener);
    };
  }, []);

  const promptToInstall = async () => {
    if (!deferredPrompt) return { outcome: 'no-prompt' };
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      return choice;
    } catch (err) {
      return { outcome: 'error', error: err };
    }
  };

  return { isInstallable, promptToInstall };
}

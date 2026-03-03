import React from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export const InstallButton: React.FC = () => {
  const { isInstallable, promptToInstall } = useInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-6 right-4 z-50">
      <button
        onClick={async () => {
          const result = await promptToInstall();
          console.log('Install prompt result', result);
        }}
        className="bg-sky-500 text-white px-4 py-2 rounded-lg shadow-lg"
        aria-label="Install app"
      >
        Instalar
      </button>
    </div>
  );
};

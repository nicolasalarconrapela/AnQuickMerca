import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { useLogoBase64 } from '../hooks/useLogoBase64';

export function Splash() {
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    // Animate progress from 0 to 100 over ~1800ms
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5; // Random steps for realistic feel
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const logo = useLogoBase64();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="relative flex flex-col items-center justify-between h-full w-full max-w-md p-8">
        <div className="flex-1"></div>
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center mb-2">
            <img src={logo || '/icon.svg'} alt="AnQuickMerca Logo" width="96" height="96" style={{ borderRadius: '20px' }} />
          </div>
          <div className="text-center">
            <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-bold tracking-tight mb-2">
              AnQuickMerca
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
              {t.splash_tagline}
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-end w-full pb-12">
          <div className="w-full space-y-4">
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, progress)}%` }}
              ></div>
            </div>
            <div className="flex justify-center">
              <p className="text-slate-400 dark:text-slate-500 text-sm font-medium tracking-wide">
                {t.splash_loading} {Math.min(100, progress)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

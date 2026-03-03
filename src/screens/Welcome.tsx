import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Globe, ArrowRight, ChevronDown, Sun, Moon, Monitor } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';

interface Props {
    onNext: () => void;
}

export function Welcome({ onNext }: Props) {
    const { setUserProfile, setTheme: setAppTheme } = useAppContext();
    const [name, setName] = useState('');
    const [language, setLanguage] = useState<'en' | 'es'>('en');
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const t = translations[language];

    React.useEffect(() => {
        // Apply theme immediately when user changes selection
        if (setAppTheme) setAppTheme(theme);
    }, [theme, setAppTheme]);

    const handleStart = () => {
        if (name.trim()) {
            setUserProfile({ name: name.trim(), language, theme });
            onNext();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-900 px-8 py-12 relative overflow-hidden text-slate-900 dark:text-white">
            {/* Background blobs for premium look */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[30%] bg-primary/20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[30%] bg-indigo-500/20 blur-[100px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm space-y-12 relative z-10"
            >
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4"
                    >
                        <User size={48} strokeWidth={1.5} />
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        {t.welcome_title}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                        {t.welcome_subtitle}
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                            {t.welcome_name_label}
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                autoFocus
                                placeholder={t.welcome_name_placeholder}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary/50 dark:focus:border-primary/50 rounded-2xl p-4 pl-12 text-lg font-bold outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400"
                            />
                                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Globe size={14} />
                            {t.welcome_language_label}
                        </label>
                        <div className="relative">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 pl-12 pr-10 text-lg font-bold outline-none transition-all appearance-none cursor-pointer focus:border-primary/50 text-slate-900 dark:text-white"
                            >
                                <option value="en">🇺🇸 English</option>
                                <option value="es">🇪🇸 Español</option>
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl pointer-events-none">
                                {language === 'en' ? '🇺🇸' : '🇪🇸'}
                            </div>
                            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Sun size={14} />
                            Tema
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex-1 p-3 rounded-2xl border-2 transition-colors flex items-center justify-center gap-2 ${theme === 'light' ? 'border-primary bg-primary text-white' : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300'}`}
                                aria-pressed={theme === 'light'}
                            >
                                <Sun size={16} />
                                <span className="font-bold">Light</span>
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex-1 p-3 rounded-2xl border-2 transition-colors flex items-center justify-center gap-2 ${theme === 'dark' ? 'border-primary bg-primary text-white' : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300'}`}
                                aria-pressed={theme === 'dark'}
                            >
                                <Moon size={16} />
                                <span className="font-bold">Dark</span>
                            </button>
                            <button
                                onClick={() => setTheme('system')}
                                className={`flex-1 p-3 rounded-2xl border-2 transition-colors flex items-center justify-center gap-2 ${theme === 'system' ? 'border-primary bg-primary text-white' : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300'}`}
                                aria-pressed={theme === 'system'}
                            >
                                <Monitor size={16} />
                                <span className="font-bold">System</span>
                            </button>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={!name.trim()}
                    onClick={handleStart}
                    className={`w-full py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-2 shadow-xl transition-all ${name.trim()
                        ? 'bg-primary text-white shadow-primary/20 cursor-pointer'
                        : 'bg-slate-700 dark:bg-slate-800 text-slate-300 dark:text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                >
                    {t.welcome_continue}
                    <ArrowRight size={24} strokeWidth={2.5} />
                </motion.button>
            </motion.div>
        </div>
    );
}

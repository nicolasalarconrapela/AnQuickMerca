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
            <div className="text-center space-y-4">
                

            {/* Top-right compact icons (monitor + language + globe) */}
                <div className="absolute top-4 right-4 z-50 flex items-center ">
                    <div className="relative group">
                        <button
                            type="button"
                            onClick={() => setTheme(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system')}
                            title="Cambiar tema"
                            className={`p-2 rounded-md transition-colors ${theme === 'system' ? 'text-sky-300' : theme === 'light' ? 'text-yellow-300' : 'text-sky-400'}`}
                        >
                            <Monitor size={18} />
                        </button>
                        <div className="absolute -top-9 right-6 px-2 py-1 bg-black/80 text-white text-xs rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                            Tema: {theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Oscuro'}
                        </div>
                    </div>

                    <div className="relative group">
                        <button
                            type="button"
                            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                            title="Cambiar idioma"
                            className="px-2 py-1 rounded-md bg-transparent text-sky-300 font-bold text-sm"
                        >
                            {language === 'en' ? 'US' : 'ES'}
                        </button>
                    </div>

                    <div className="relative group">
                        <button
                            type="button"
                            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                            title="Cambiar idioma"
                            className="p-2 rounded-md bg-transparent text-sky-300"
                        >
                            <Globe size={16} />
                        </button>
                        <div className="absolute -top-9 right-6 px-2 py-1 bg-black/80 text-white text-xs rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                            Idioma: {language === 'en' ? 'English' : 'Español'}
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm space-y-12 relative z-10"
            >
                <div className="text-center space-y-4">
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

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Globe, ArrowRight, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';

interface Props {
    onNext: () => void;
}

export function Welcome({ onNext }: Props) {
    const { setUserProfile } = useAppContext();
    const [name, setName] = useState('');
    const [language, setLanguage] = useState<'en' | 'es'>('en');
    const t = translations[language];

    const handleStart = () => {
        if (name.trim()) {
            // Force theme to 'light' when saving profile
            setUserProfile({ name: name.trim(), language, theme: 'light' });
            onNext();
        }
    };

    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-900 px-8 py-12 relative overflow-hidden text-slate-900 dark:text-white">

            <div className="text-center space-y-4">

            {/* Top-right compact language icons */}
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                    <div className="relative group">
                        <button
                            type="button"
                            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                            title="Cambiar idioma"
                            className="px-2 py-1 rounded-md bg-transparent text-sky-300 font-bold text-sm"
                        >
                            {language === 'en' ? 'US' : 'ES'}
                        </button>
                        <div className="absolute -top-9 right-6 px-2 py-1 bg-black/80 text-white text-xs rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                            Idioma: {language === 'en' ? 'English' : 'Español'}
                        </div>
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
                    className={`w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-sm transition-all ${name.trim()
                        ? 'bg-primary text-white shadow-sm cursor-pointer'
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

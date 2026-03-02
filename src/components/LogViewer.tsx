import React, { useState, useEffect, useRef } from 'react';
import { logger, LogEntry, LogLevel } from '../utils/logger';
import { X, Trash2, Filter, ChevronDown, Terminal } from 'lucide-react';
import { useTranslation } from '../i18n';

interface LogViewerProps {
    onClose: () => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filterLevel, setFilterLevel] = useState<LogLevel | 'all'>('all');
    const [isAutoScrollDelay, setIsAutoScrollDelay] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = logger.subscribe((newLogs) => {
            setLogs([...newLogs]);
        });
        return unsubscribe;
    }, []);

    const filteredLogs = logs.filter(
        (log) => filterLevel === 'all' || log.level === filterLevel
    );

    const getLevelColor = (level: LogLevel) => {
        switch (level) {
            case 'error': return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50';
            case 'warn': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50';
            case 'info': return 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/50';
            case 'debug': return 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/50';
            default: return 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/50';
        }
    };

    const getLevelBadgeColor = (level: LogLevel) => {
        switch (level) {
            case 'error': return 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
            case 'warn': return 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
            case 'info': return 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800';
            case 'debug': return 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600';
            default: return 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600';
        }
    };

    return (
        <div className="absolute inset-0 z-[100] flex flex-col bg-white/95 dark:bg-slate-950/95 backdrop-blur-md font-mono text-sm shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 sticky top-0 z-10 shadow-sm">
                <h2 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <Terminal strokeWidth={2} className="w-5 h-5 text-indigo-500" />
                    {t.log_title}
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                        {filteredLogs.length}
                    </span>
                </h2>
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <select
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value as LogLevel | 'all')}
                            className="appearance-none pr-8 pl-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="all">{t.log_all_levels}</option>
                            <option value="info">{t.log_info}</option>
                            <option value="warn">{t.log_warnings}</option>
                            <option value="error">{t.log_errors}</option>
                            <option value="debug">{t.log_debug}</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-amber-500 transition-colors" />
                    </div>

                    <button
                        onClick={() => logger.clearLogs()}
                        className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-800"
                        title={t.log_clear}
                    >
                        <Trash2 size={18} strokeWidth={2} />
                    </button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                        title={t.log_close}
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Log List */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 space-y-2 scroll-smooth"
            >
                {filteredLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600 space-y-3 opacity-80">
                        <Terminal size={48} strokeWidth={1} className="text-slate-300 dark:text-slate-700" />
                        <p className="text-sm font-medium">{t.log_waiting}</p>
                    </div>
                ) : (
                    filteredLogs.map((log) => (
                        <div
                            key={log.id}
                            className={`p-3 rounded-lg border break-words shadow-sm hover:shadow-md transition-all group ${getLevelColor(log.level)}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md ${getLevelBadgeColor(log.level)}`}>
                                    {log.level}
                                </span>
                                <span className="text-xs font-semibold opacity-60 tabular-nums">
                                    {new Date(log.timestamp).toISOString().split('T')[1].slice(0, 12)}
                                </span>
                            </div>
                            <div className="whitespace-pre-wrap font-medium leading-relaxed tracking-tight break-all">
                                {log.message}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

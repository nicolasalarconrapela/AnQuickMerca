import re

with open('/app/src/components/ProductSearch.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex items-start justify-between gap-3">',
    '<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">'
)

content = content.replace(
    '<div className="flex-1 group flex items-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 focus-within:border-primary/50 p-2.5 rounded-2xl shadow-sm transition-all duration-300">',
    '<div className="w-full sm:flex-1 group flex items-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 focus-within:border-primary/50 p-2.5 rounded-2xl shadow-sm transition-all duration-300">'
)

with open('/app/src/components/ProductSearch.tsx', 'w') as f:
    f.write(content)

const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

if (!code.includes('setTheme:')) {
  // Add setTheme to AppContextType
  code = code.replace(
    '  setUserProfile: (profile: UserProfile | null) => void;',
    '  setUserProfile: (profile: UserProfile | null) => void;\n  setTheme: (theme: "light" | "dark" | "system") => void;'
  );

  // Add the method inside AppProvider
  code = code.replace(
    '  const addList = (list: ShoppingList) => setLists(prev => [...prev, list]);',
    `  const setTheme = (theme: "light" | "dark" | "system") => {
    if (userProfile) {
      setUserProfile({ ...userProfile, theme });
    } else {
      // Create a dummy profile if none exists just to hold the theme preference
      setUserProfile({ name: '', language: 'en', theme });
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Default to system if not set
    const currentTheme = userProfile?.theme || 'system';

    if (currentTheme === 'dark' || (currentTheme === 'system' && isSystemDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [userProfile?.theme]);

  const addList = (list: ShoppingList) => setLists(prev => [...prev, list]);`
  );

  // Export setTheme in AppContext.Provider
  code = code.replace(
    '      setUserProfile,',
    '      setUserProfile,\n      setTheme,'
  );

  fs.writeFileSync('src/context/AppContext.tsx', code);
  console.log('src/context/AppContext.tsx updated');
} else {
  console.log('src/context/AppContext.tsx already has setTheme');
}

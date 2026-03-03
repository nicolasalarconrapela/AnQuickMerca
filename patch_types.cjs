const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('theme?: "light" | "dark" | "system";')) {
  code = code.replace(
    '  language: "en" | "es";',
    '  language: "en" | "es";\n  theme?: "light" | "dark" | "system";'
  );
  fs.writeFileSync('src/types.ts', code);
  console.log('src/types.ts updated');
} else {
  console.log('src/types.ts already has theme property');
}

const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

if (!code.includes('@custom-variant dark')) {
  code = code.replace(
    '@import "tailwindcss";',
    '@import "tailwindcss";\n\n@custom-variant dark (&:is(.dark *));'
  );
  fs.writeFileSync('src/index.css', code);
  console.log('src/index.css updated for custom dark mode variant in tailwind v4');
} else {
  console.log('src/index.css already has custom dark mode variant');
}

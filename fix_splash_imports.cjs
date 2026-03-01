const fs = require('fs');
let splash = fs.readFileSync('src/screens/Splash.tsx', 'utf8');
if (!splash.includes('import { useTranslation }')) {
    splash = splash.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useTranslation } from '../i18n';");
    fs.writeFileSync('src/screens/Splash.tsx', splash);
}

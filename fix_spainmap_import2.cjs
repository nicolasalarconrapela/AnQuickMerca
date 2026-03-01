const fs = require('fs');
let code = fs.readFileSync('src/screens/SpainMap.tsx', 'utf8');

code = code.replace("import React, { useState, useMemo, useCallback } from 'react';", "import React, { useState, useMemo, useCallback } from 'react';\nimport { useTranslation } from '../i18n';");

fs.writeFileSync('src/screens/SpainMap.tsx', code);

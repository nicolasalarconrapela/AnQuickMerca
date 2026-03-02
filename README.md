<div align="center">
  <img src="public/icon-512x512.png" alt="AnQuickMerca Logo" width="120" height="120" style="border-radius: 24px;" />

  # AnQuickMerca

  **Optimiza tu compra en segundos · Optimize your shopping in seconds**

  [![CI](https://github.com/nicolasar/AnQuickMerca/actions/workflows/ci.yml/badge.svg)](https://github.com/nicolasar/AnQuickMerca/actions)
  [![Version](https://img.shields.io/badge/version-0.5.0--beta-blue)](./src/version.ts)
  [![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
  [![PWA](https://img.shields.io/badge/PWA-ready-purple)](./public/manifest.json)

  [🇪🇸 Español](#español) · [🇺🇸 English](#english)
</div>

---

## Español

### ¿Qué es AnQuickMerca?

AnQuickMerca es una **Progressive Web App (PWA)** diseñada para optimizar tus compras en Mercadona. Crea listas de la compra inteligentes, navega por la tienda con rutas optimizadas y busca productos con IA.

### Características principales

- 🛒 **Gestión de listas** — Crea, edita y organiza tus listas de la compra
- 🗺️ **Navegación en tienda** — Rutas optimizadas por pasillos para reducir tiempo en tienda
- 🔍 **Búsqueda con IA** — Encuentra productos con ayuda de Gemini AI
- 🌍 **Selección de tienda** — Mapa interactivo de toda España con tiendas Mercadona
- 📱 **Instalable como app** — Funciona offline como app nativa en móvil
- 🌐 **Bilingüe** — Interfaz completa en Español e Inglés
- 🔁 **Listas recurrentes** — Configura compras diarias, semanales, mensuales o anuales
- 💰 **Total estimado** — Calcula el coste de tu compra en tiempo real

### Tech Stack

| Tecnología | Uso |
|-----------|-----|
| React 19 + TypeScript | Frontend framework |
| Vite 6 | Build tool y dev server |
| Tailwind CSS 4 | Estilos y diseño |
| Motion (Framer Motion) | Animaciones |
| Lucide React | Iconografía |
| Google Gemini AI | Búsqueda inteligente de productos |
| amCharts 5 | Mapa interactivo de España |
| PWA (Web App Manifest) | Instalación y soporte offline |

### Instalación y desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/nicolasar/AnQuickMerca.git
cd AnQuickMerca

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local y añade tu GEMINI_API_KEY

# Iniciar servidor de desarrollo
npm run dev
# Abre http://localhost:3000
```

### Variables de entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `GEMINI_API_KEY` | API Key de Google Gemini para búsqueda de productos | Sí |

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo en puerto 3000
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Verificación de tipos TypeScript
```

### Estructura del proyecto

```
AnQuickMerca/
├── src/
│   ├── components/     # Componentes reutilizables (modales, mapa, búsqueda)
│   ├── context/        # Estado global con React Context
│   ├── hooks/          # Custom hooks (useTranslation, usePanZoom)
│   ├── i18n/           # Sistema de internacionalización (ES/EN)
│   ├── screens/        # Pantallas de la aplicación
│   ├── utils/          # Utilidades (logger)
│   ├── data/           # Datos del mapa del supermercado
│   └── types.ts        # Definiciones de tipos TypeScript
├── public/
│   ├── data/           # Datos de productos (Algolia) y GeoJSON de España
│   └── manifest.json   # Configuración PWA
└── .github/            # Templates de Issues, PRs y CI/CD
```

### Contribuir

1. Haz fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y haz commit: `git commit -m 'feat: añadir nueva funcionalidad'`
4. Push a tu rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request usando el template

### Convenciones de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — Nueva funcionalidad
- `fix:` — Corrección de bugs
- `docs:` — Cambios en documentación
- `style:` — Cambios de estilo (no afectan lógica)
- `refactor:` — Refactorización de código
- `chore:` — Tareas de mantenimiento

---

## English

### What is AnQuickMerca?

AnQuickMerca is a **Progressive Web App (PWA)** designed to optimize your Mercadona shopping. Create smart shopping lists, navigate the store with optimized routes, and search for products using AI.

### Key Features

- 🛒 **List management** — Create, edit and organize your shopping lists
- 🗺️ **In-store navigation** — Optimized aisle routes to reduce time in store
- 🔍 **AI-powered search** — Find products with Gemini AI assistance
- 🌍 **Store selection** — Interactive map of Spain with all Mercadona locations
- 📱 **Installable as app** — Works offline as a native-like app on mobile
- 🌐 **Bilingual** — Full interface in Spanish and English
- 🔁 **Recurring lists** — Set up daily, weekly, monthly or yearly shopping
- 💰 **Estimated total** — Real-time cost calculation for your shopping

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/nicolasar/AnQuickMerca.git
cd AnQuickMerca

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Start development server
npm run dev
# Open http://localhost:3000
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API Key for product search | Yes |

### Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request using the template

### Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Style changes (no logic impact)
- `refactor:` — Code refactoring
- `chore:` — Maintenance tasks

---

<div align="center">
  Made with ❤️ for smarter shopping

  **AnQuickMerca** · v0.5.0-beta
</div>

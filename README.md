<div align="center">

<img src="public/icon.svg" alt="AnQuickMerca Logo" width="120" />

# AnQuickMerca

**Your Supermarket GPS — Optimize your grocery shopping in seconds**

[![Version](https://img.shields.io/badge/version-0.5.0--beta-blue)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](tsconfig.json)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](package.json)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](vite.config.ts)

</div>

---

## About

AnQuickMerca is a mobile-first web application designed to transform the tedious task of grocery shopping into a high-efficiency experience. It acts as a **logistical GPS** for your supermarket visits — helping you create shopping lists, find products using Algolia-powered search, and navigate optimized routes through the store layout.

## Features

- **Smart Shopping Lists** — Create, manage, and organize multiple shopping lists with product search powered by Algolia
- **Store Selection via Spain Map** — Interactive map for selecting your Mercadona store by Community, Province, and City
- **Store Layout Navigation** — Visual store map with aisle-by-aisle navigation to optimize your shopping route
- **Product Search** — Real-time search with product details, prices, and images
- **Active Navigation Mode** — Step-by-step in-store guidance with progress tracking
- **PWA Support** — Installable on mobile devices for a native-like experience
- **Dark Mode** — Full dark/light theme support
- **Multi-language** — English and Spanish support
- **AI-Powered** — Gemini API integration for intelligent features

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript 5.8** | Type safety |
| **Vite 6** | Build tool & dev server |
| **Tailwind CSS 4** | Styling |
| **Motion** | Animations |
| **Lucide React** | Icons |
| **Algolia** | Product search data |
| **Gemini API** | AI features |
| **amCharts 5** | Map visualizations |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Gemini API Key](https://ai.google.dev/)

### Installation

```bash
# Clone the repository
git clone https://github.com/nicolasar/AnQuickMerca.git
cd AnQuickMerca

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Set your `GEMINI_API_KEY` in `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

### Development

```bash
# Start dev server on port 3000
npm run dev
```

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Other Commands

```bash
# Type-check without emitting
npm run lint

# Clean build artifacts
npm run clean
```

## Project Structure

```
AnQuickMerca/
├── public/              # Static assets (icons, manifest, GeoJSON)
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React context (global state)
│   ├── data/            # Static JSON data
│   ├── hooks/           # Custom React hooks
│   ├── screens/         # App screens/pages
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app with screen router
│   ├── main.tsx         # Entry point
│   └── types.ts         # TypeScript type definitions
├── in/data/             # Raw input data (Algolia, categories, locations)
├── .github/             # Issue & PR templates
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies & scripts
```

## Contributing

Contributions are welcome! Please see the [issue templates](.github/ISSUE_TEMPLATE/) and [PR template](.github/PULL_REQUEST_TEMPLATE.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

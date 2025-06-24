import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import electron from 'vite-plugin-electron'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    electron({
      entry: 'src/electron/main.ts',
      vite: {
        build: {
          outDir: 'dist-electron',
          rollupOptions: {
            input: {
              preload: 'src/electron/preload.cts'
            }
          }
        }
      }
    })
  ],
  base: './',
  build: {
    outDir: 'dist-react',
  },
  server: {
    port: 5123,
    strictPort: true
  },
})

// my-cbt-app/
// ├── electron/                 # Electron-specific code (main process)
// │   ├── main.ts               # Main process entry point
// │   └── preload.ts            # Preload script for secure IPC
// ├── src/                      # React application code (renderer process)
// │   ├── api/                  # Data handling and business logic
// │   ├── assets/               # Images, fonts, etc.
// │   ├── components/           # Reusable React components
// │   │   ├── common/           # Buttons, inputs, etc.
// │   │   └── modules/          # Feature-specific components (e.g., Question, Timer)
// │   ├── hooks/                # Custom React hooks
// │   ├── pages/                # Top-level page components (e.g., Login, Test, Results)
// │   ├── services/             # Services for interacting with the backend or local storage
// │   ├── state/                # State management (e.g., Redux, Zustand)
// │   ├── styles/               # Global styles and Tailwind CSS configuration
// │   ├── types/                # TypeScript type definitions
// │   └── App.tsx               # Main React component
// ├── package.json
// ├── tsconfig.json
// └── ...other configuration files
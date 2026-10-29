/**
 * Optional backend configuration helper.
 *
 * Greenmart ships with a fully client-side demo dataset (`src/data/*`).
 * No backend is wired up in this project, and **no credentials are embedded
 * in the frontend bundle** — this module only reads public configuration from
 * `import.meta.env` so the app can report whether a backend has been
 * configured for a future integration.
 *
 * Add a `.env` file based on `.env.example` to point the app at a real API.
 */

export interface BackendConfig {
  url: string
  anonKey: string
}

function readEnv(key: string): string {
  const env = import.meta.env as Record<string, string | undefined>
  return env[key]?.trim() ?? ''
}

/** Returns the public backend configuration, or `null` when none is set. */
export function getBackendConfig(): BackendConfig | null {
  const url = readEnv('VITE_SUPABASE_URL')
  const anonKey = readEnv('VITE_SUPABASE_ANON_KEY')
  if (!url || !anonKey) return null
  return { url, anonKey }
}

/**
 * True when a backend URL has been configured. The current build always runs
 * against the bundled mock dataset regardless of this flag.
 */
export function isBackendConfigured(): boolean {
  return getBackendConfig() !== null
}

/** Human readable label describing where the UI data comes from. */
export function getDataSourceLabel(): string {
  return isBackendConfigured()
    ? 'Backend configured — demo dataset still in use'
    : 'Local demo dataset (no backend connected)'
}

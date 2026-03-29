# Linting-Migration: ESLint → Biome

**Datum:** 2026-03-29
**Scope:** Linting-Setup von ESLint auf Biome umstellen, Husky + lint-staged einrichten, CI erweitern
**Referenz:** bilder-zum-malen Linting-Setup als Vorlage

## 1. Dependencies

### Entfernen

- `eslint` (^9.33.0)
- `@eslint/js` (^9.33.0)
- `@typescript-eslint/eslint-plugin` (^8.39.0)
- `@typescript-eslint/parser` (^8.39.0)
- `typescript-eslint` (^8.39.0)
- `astro-eslint-parser` (^1.2.2)
- `eslint-plugin-astro` (^1.3.1)
- `globals` (^16.3.0)

### Hinzufügen

- `@biomejs/biome` (^2.4.8)
- `husky` (^9.1.7)
- `lint-staged` (^16.4.0)

### Behalten (unverändert)

- `prettier` (^3.6.2)
- `prettier-plugin-astro` (^0.14.1)
- `@astrojs/check` (^0.9.8)
- `typescript` (^5.8.3)

## 2. Konfigurationsdateien

### Löschen

- `eslint.config.js`

### Neu: `biome.json`

Adaptiert von bilder-zum-malen mit angepassten ignore-Pfaden:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true,
    "includes": ["**"],
    "ignore": [
      "dist",
      "node_modules",
      ".astro",
      ".github",
      ".claude",
      "docs",
      "types.generated.d.ts"
    ]
  },
  "formatter": {
    "enabled": true,
    "lineWidth": 120,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "error",
        "noUnusedVariables": "warn"
      },
      "style": {
        "noNonNullAssertion": "off"
      }
    }
  },
  "css": {
    "parser": {
      "cssModules": false
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingCommas": "none"
    }
  },
  "overrides": [
    {
      "includes": ["*.astro"],
      "linter": {
        "rules": {
          "correctness": {
            "noUnusedImports": "off",
            "noUnusedVariables": "off"
          }
        }
      },
      "formatter": {
        "enabled": false
      }
    },
    {
      "includes": ["**/*.css"],
      "linter": {
        "rules": {
          "suspicious": {
            "noUnknownAtRules": "off"
          }
        }
      }
    }
  ]
}
```

### Behalten (unverändert)

- `.prettierrc.cjs`
- `.prettierignore`
- `.editorconfig`

## 3. Package.json Scripts

```json
"check": "npm run check:astro && npm run check:biome && npm run check:prettier",
"check:astro": "astro check",
"check:biome": "biome check .",
"check:prettier": "prettier --check \"src/**/*.astro\"",
"fix": "biome check --write . && prettier -w \"src/**/*.astro\""
```

Prettier-Scope wird auf `src/**/*.astro` eingeschränkt — Biome übernimmt JS/TS/JSON-Formatierung.

## 4. Lint-staged Konfiguration

In `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx,js,mjs,cjs,json}": "biome check --write --no-errors-on-unmatched",
  "*.astro": "prettier --write"
}
```

## 5. Husky Pre-commit Hook

```bash
#!/usr/bin/env sh
npx lint-staged
```

Setup via `npx husky init` + Hook-Datei anpassen.

## 6. VS Code Integration

### `.vscode/extensions.json`

- Entfernen: `dbaeumer.vscode-eslint`
- Hinzufügen: `biomejs.biome`

### `.vscode/settings.json`

- ESLint-Einstellungen entfernen (`eslint.validate`, `eslint.useFlatConfig`)
- Biome als Default-Formatter für JS/TS setzen

## 7. CI Workflow (`.github/workflows/actions.yaml`)

Neuer `check`-Job:

```yaml
check:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 22
    - run: npm ci --legacy-peer-deps
    - run: npm run check
```

## 8. Migrationsschritte

1. ESLint-Dependencies entfernen, Biome/Husky/lint-staged installieren
2. `eslint.config.js` löschen, `biome.json` erstellen
3. Package.json Scripts + lint-staged aktualisieren
4. Husky initialisieren + Pre-commit-Hook einrichten
5. VS Code Settings/Extensions anpassen
6. CI Workflow erweitern
7. `npm run fix` ausführen — alle Dateien einmalig formatieren/fixen
8. Ergebnis committen

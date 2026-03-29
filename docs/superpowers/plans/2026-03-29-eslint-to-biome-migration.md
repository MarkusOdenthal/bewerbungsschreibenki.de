# ESLint → Biome Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace ESLint with Biome as linter/formatter, add Husky + lint-staged pre-commit hooks, and add a CI check job.

**Architecture:** Biome handles linting and formatting for JS/TS/JSON/CSS. Prettier remains only for .astro files (Biome has no Astro parser). Pre-commit hooks via Husky + lint-staged run both tools on staged files.

**Tech Stack:** Biome 2.x, Prettier 3.x, Husky 9.x, lint-staged 16.x, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-03-29-eslint-to-biome-migration-design.md`

---

### Task 1: Remove ESLint dependencies and config

**Files:**
- Delete: `eslint.config.js`
- Modify: `package.json`

- [ ] **Step 1: Uninstall ESLint packages**

```bash
npm uninstall eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser typescript-eslint astro-eslint-parser eslint-plugin-astro globals
```

- [ ] **Step 2: Delete ESLint config**

```bash
rm eslint.config.js
```

- [ ] **Step 3: Verify ESLint is fully removed**

```bash
grep -r "eslint" package.json
```

Expected: No matches (the old scripts will be updated in Task 3).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json eslint.config.js
git commit -m "chore: remove ESLint and related dependencies"
```

---

### Task 2: Install Biome, Husky, lint-staged

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install new dependencies**

```bash
npm install --save-dev @biomejs/biome husky lint-staged
```

- [ ] **Step 2: Verify installation**

```bash
npx biome --version
```

Expected: Prints Biome version (2.x).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Biome, Husky, and lint-staged"
```

---

### Task 3: Create biome.json

**Files:**
- Create: `biome.json`

- [ ] **Step 1: Create `biome.json`**

Write the following to `biome.json` in the project root:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.8/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "includes": [
      "**",
      "!!**/dist",
      "!!**/node_modules",
      "!!**/.astro",
      "!!**/.github",
      "!!**/.claude",
      "!!**/docs",
      "!!**/types.generated.d.ts"
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
      "tailwindDirectives": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingCommas": "none"
    }
  },
  "assist": {
    "enabled": true,
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  },
  "overrides": [
    {
      "includes": ["**/*.astro"],
      "linter": {
        "enabled": true,
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
      "includes": ["src/assets/styles/tailwind.css"],
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

- [ ] **Step 2: Verify Biome config loads**

```bash
npx biome check --max-diagnostics=5 .
```

Expected: Biome runs and reports diagnostics (errors expected — we haven't fixed yet). No config errors.

- [ ] **Step 3: Commit**

```bash
git add biome.json
git commit -m "chore: add Biome configuration"
```

---

### Task 4: Update package.json scripts and lint-staged

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update scripts in `package.json`**

Replace the existing `check`, `check:eslint`, `check:prettier`, `fix`, `fix:eslint`, `fix:prettier` scripts. Keep `check:astro` unchanged.

Old scripts to replace:

```json
"check": "npm run check:astro && npm run check:eslint && npm run check:prettier",
"check:eslint": "eslint .",
"check:prettier": "prettier --check .",
"fix": "npm run fix:eslint && npm run fix:prettier",
"fix:eslint": "eslint --fix .",
"fix:prettier": "prettier -w .",
```

New scripts:

```json
"check": "npm run check:astro && npm run check:biome && npm run check:prettier",
"check:biome": "biome check .",
"check:prettier": "prettier --check \"src/**/*.astro\"",
"fix": "biome check --write . && prettier -w \"src/**/*.astro\"",
```

Remove `fix:eslint` and `fix:prettier` (no longer needed — `fix` is a single command now).

- [ ] **Step 2: Add lint-staged config to `package.json`**

Add at the top level of `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx,js,mjs,cjs,json}": "biome check --write --no-errors-on-unmatched",
  "*.astro": "prettier --write"
}
```

- [ ] **Step 3: Add prepare script for Husky**

Add to scripts:

```json
"prepare": "husky"
```

- [ ] **Step 4: Verify scripts parse correctly**

```bash
node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8')); console.log('Valid JSON')"
```

Expected: `Valid JSON`

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "chore: update scripts for Biome and add lint-staged config"
```

---

### Task 5: Set up Husky pre-commit hook

**Files:**
- Create: `.husky/pre-commit`

- [ ] **Step 1: Initialize Husky**

```bash
npx husky init
```

This creates `.husky/` directory with a default `pre-commit` file.

- [ ] **Step 2: Write pre-commit hook**

Replace the content of `.husky/pre-commit` with:

```bash
npx lint-staged
```

- [ ] **Step 3: Make hook executable**

```bash
chmod +x .husky/pre-commit
```

- [ ] **Step 4: Commit**

```bash
git add .husky/pre-commit
git commit -m "chore: add Husky pre-commit hook with lint-staged"
```

---

### Task 6: Update VS Code settings and extensions

**Files:**
- Modify: `.vscode/settings.json`
- Modify: `.vscode/extensions.json`

- [ ] **Step 1: Update `.vscode/settings.json`**

Replace the full content with:

```json
{
  "css.customData": ["./vscode.tailwind.json"],
  "files.associations": {
    "*.mdx": "markdown"
  },
  "prettier.documentSelectors": ["**/*.astro"],
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  },
  "yaml.schemas": {
    "./.vscode/astrowind/config-schema.json": "/src/config.yaml"
  }
}
```

Changes: removed `eslint.validate`, `eslint.useFlatConfig`. Biome extension auto-detects `biome.json`.

- [ ] **Step 2: Update `.vscode/extensions.json`**

Replace the full content with:

```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "bradlc.vscode-tailwindcss",
    "biomejs.biome",
    "esbenp.prettier-vscode",
    "unifiedjs.vscode-mdx"
  ],
  "unwantedRecommendations": []
}
```

Changes: replaced `dbaeumer.vscode-eslint` with `biomejs.biome`.

- [ ] **Step 3: Commit**

```bash
git add .vscode/settings.json .vscode/extensions.json
git commit -m "chore: update VS Code settings for Biome"
```

---

### Task 7: Add CI check job

**Files:**
- Modify: `.github/workflows/actions.yaml`

- [ ] **Step 1: Update `.github/workflows/actions.yaml`**

Replace the full content with:

```yaml
name: CI

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci --legacy-peer-deps
      - run: npm run check

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci --legacy-peer-deps
      - run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/actions.yaml
git commit -m "ci: add check job for Biome, Astro check, and Prettier"
```

---

### Task 8: Run autofix and verify

**Files:**
- Modify: All JS/TS/JSON/CSS files (formatting changes)

- [ ] **Step 1: Run Biome autofix**

```bash
npm run fix
```

Expected: Biome reformats JS/TS/JSON files, Prettier reformats .astro files. Some unused import removals possible.

- [ ] **Step 2: Run full check**

```bash
npm run check
```

Expected: All three checks pass (astro check, biome check, prettier check).

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit all formatting changes**

```bash
git add -A
git commit -m "style: apply Biome formatting to entire codebase"
```

---

### Task 9: Final verification

- [ ] **Step 1: Run full check suite again**

```bash
npm run check
```

Expected: All checks pass cleanly.

- [ ] **Step 2: Test pre-commit hook**

Create a test change and verify hook runs:

```bash
echo "// test" >> src/utils/utils.ts
git add src/utils/utils.ts
git commit -m "test: verify pre-commit hook" --no-gpg-sign
```

Expected: lint-staged runs Biome on the staged file. Commit succeeds.

- [ ] **Step 3: Revert test commit**

```bash
git reset HEAD~1
git checkout -- src/utils/utils.ts
```

- [ ] **Step 4: Done**

Migration complete. ESLint replaced with Biome, pre-commit hooks active, CI check job added.

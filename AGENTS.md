# AGENTS.md

Instruksjoner for AI-agenter som jobber i dette repoet.

## Formål

Intern brukerstøtte-app for arbeidssøkerregisteret. Kun brukt av utviklere i teamet. Appen er en POC der vi eksperimenterer med å ha så få avhengigheter som mulig, men likevel bruke Navs interne API-er med skikkelig autentisering via Deno og Hono.

## Arkitektur

Serveren kjører på **Deno** med **Hono** som web-rammeverk. All HTML rendres server-side med Hono JSX. Interaktive komponenter hydreres selektivt via en island-arkitektur — ingen SPA, ingen klient-side ruting.

Aksel brukes på to måter:
- **Vanilla CSS** via CDN (`@navikt/ds-css`) for typografi, spacing og grunnstiler
- **React-komponenter** (`@navikt/ds-react`) kun inne i islands der vi trenger interaktivitet (f.eks. `Accordion`)

### Mappestruktur

```
src/          — Hono-server, API-kall, auth, typer
views/        — Server-rendrede JSX-komponenter (Hono JSX)
client/       — React-islands og island-loader (React JSX)
static/       — Bundlet JS, CSS og statiske filer
.nais/        — Nais-konfigurasjon
```

## Island-arkitektur

Vi bruker et island-mønster for å hydrere React-komponenter selektivt i en ellers server-rendret app.

**Slik fungerer det:**

1. Serveren rendrer HTML med `data-island`-attributter og valgfrie `data-island-props` (JSON) på elementer som skal bli interaktive.
2. `build-client.ts` bruker esbuild til å bundle `client/island-loader.tsx` til `static/islands.js`. Støtter `--watch` for utvikling.
3. `client/island-loader.tsx` kjører i nettleseren: den finner alle `[data-island]`-elementer, slår opp komponentnavnet i et register, og monterer React-komponenten med `createRoot`.

**Legge til en ny island:**
1. Lag en React-komponent i `client/islands/`
2. Registrer den i `islandRegistry` i `client/island-loader.tsx`
3. Bruk `data-island="komponent-navn"` i server-rendret HTML

## Deno

Deno gir oss innebygd TypeScript-støtte, et permissions-basert sikkerhetssystem og import maps — uten behov for separat bundler, transpiler eller pakkebehandler for server-koden.

Prosjektet bruker **Deno workspaces** med to separate JSX-konfigurasjoner:
- **Rot (`deno.json`):** `jsxImportSource: "hono/jsx"` — server-side JSX via Hono
- **Client (`client/deno.json`):** `jsxImportSource: "react"` — React JSX for islands

`deno task start` kjører med eksplisitt begrensede tillatelser (`--allow-env`, `--allow-net`, `--allow-read`) og `--cached-only` i produksjon, slik at alt er forhåndscachet i Docker-imaget.

## Auth og API-kall

Appen er beskyttet med **Azure AD sidecar** via Nais. Kall mot interne API-er bruker:
- **OBO-token** (On-Behalf-Of) for bruker-kontekst (`@navikt/oasis`)
- **M2M-token** (Machine-to-Machine) for server-til-server-kall

Outbound access policy i Nais begrenser hvilke apper vi kan kalle.

## Avhengigheter

Bevisst minimalt sett:
- `hono` (jsr) — web-rammeverk
- `react` / `react-dom` (npm) — kun for client-side islands
- `@navikt/ds-react` / `@navikt/ds-css` — Aksel designsystem
- `@navikt/oasis` — token-håndtering (OBO/M2M)
- `@navikt/arbeidssokerregisteret-utils` — domenespesifikke hjelpefunksjoner
- `esbuild` — bundling av islands (kun build-tid)

## Konvensjoner

- Server-komponenter bruker Hono JSX (`views/`), ikke React
- Interaktive elementer hører hjemme i `client/islands/`
- CSS skrives i `static/stylesheet.css`, Aksel-stiler kommer fra CDN
- Vanilla JS i `static/app.js` for enkel DOM-interaksjon uten React

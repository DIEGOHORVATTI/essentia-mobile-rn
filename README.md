# Essentia Saúde — App de Pacientes (React Native + FHIR)

App mobile de consulta de **pacientes** que consome a **API pública FHIR R4** (padrão mundial de interoperabilidade em saúde). Case técnico para a vaga de Dev Mobile na **Essentia Technologies** — domínio alinhado ao produto deles (gestão de clínicas), com dados 100% públicos e identidade da marca (dourado).

## Funcionalidades
- **Listagem** com imagem, nome e descrição + **scroll infinito** (cursor FHIR).
- **Busca** por nome e **filtros** (gênero, status, cidade com autocomplete, ordenação) — tudo via API.
- **Detalhe** do paciente + **condições clínicas** (ICD-10, status, datas) em bottom sheet.
- **Favoritos** (aba própria), **skeletons** de loading, erro com retry, dark/light e splash animado.

> A imagem é um **avatar gerado pelo nome** (FHIR não traz foto); os dados são 100% FHIR.

## Rodar
```bash
bun install
bun start          # Expo Go (QR)  |  bun run android
bun run ci         # typecheck + lint + testes
bun run smoke:fhir # testa a integração FHIR sem subir o app
```

## Libs e por quê
- **Expo Router + TypeScript** — base e navegação por arquivos, tipada.
- **oRPC + Zod** — a API FHIR vira um **contrato tipado**; os tipos fluem pros hooks.
- **TanStack Query** — cache, `useInfiniteQuery` (scroll infinito), retry/refetch.
- **Zustand** — favoritos locais, sem boilerplate.
- **NativeWind (Tailwind)** — `className` + tokens de tema.
- **@gorhom/bottom-sheet** — filtros e detalhe de condição.
- **oxlint + oxfmt** — lint/format rápidos (regra: `useEffect` só em hooks).
- **bun test** — testes da lógica pura (mappers, format, favoritos).

## Arquitetura
Por feature. A **borda de rede é tipada por contrato** e os dados crus do FHIR são traduzidos para um **modelo de domínio** (`mappers.ts`) antes da UI — os testes ficam na lógica pura.
```
src/contracts  contrato oRPC/FHIR (fonte de tipos)
src/lib        client FHIR, query client, utils
src/features/patients  mappers, hooks, components, filters
src/theme · src/components · src/hooks · src/stores · src/app
```

## CI/CD
- `ci.yml` — typecheck → lint → testes a cada push.
- `build.yml` — build Android na nuvem via **EAS** (requer secret `EXPO_TOKEN` + `eas init`).

## Melhorias futuras
Aba de Mapa (markers por cidade), aba de Configurações (tema), teclado nos sheets via `react-native-keyboard-controller` (dev build), Firebase Analytics (abstração já pronta em `lib/analytics.ts`), testes e2e.

<p align="center">
  <img src="assets/images/logo.png" width="96" alt="Essentia Saude" />
</p>

<h1 align="center">Essentia Saúde, App de Pacientes (React Native + FHIR)</h1>

App mobile de consulta de **pacientes** que consome a **API pública FHIR R4** (padrão mundial de interoperabilidade em saúde). Case técnico para a vaga de Dev Mobile na **Essentia Technologies**. Domínio alinhado ao produto deles (gestão de clínicas), com dados 100% públicos e identidade da marca (dourado).

## Funcionalidades
- [x] Listagem com imagem, nome e descrição + scroll infinito (cursor FHIR)
- [x] Busca por nome e filtros (gênero, status, cidade com autocomplete, ordenação) via API
- [x] Detalhe do paciente + condições clínicas (ICD-10, status, datas) em bottom sheet
- [x] Favoritos (aba própria, persistência local)
- [x] Mapa com clustering e avatares dos pacientes por localização
- [x] Skeletons (shimmer), erro com retry, dark/light e splash animado
- [x] Testes, CI (typecheck/lint/test) e build de APK no GitHub Actions
- [x] Cache offline (persistência do TanStack Query em AsyncStorage)
- [x] Testes e2e (fluxos Maestro em `.maestro/`)
- [ ] Aba de Configurações (tema claro/escuro/sistema)
- [ ] Teclado nativo nos bottom sheets (`react-native-keyboard-controller`, dev build)
- [ ] Firebase Analytics (abstração pronta em `lib/analytics.ts`)

> A imagem é um **avatar gerado pelo nome** (FHIR não traz foto); os dados são 100% FHIR.

## Rodar
```bash
bun install
bun start          # Expo Go (QR)  |  bun run android
bun run ci         # typecheck + lint + testes
bun run smoke:fhir # testa a integração FHIR sem subir o app
maestro test .maestro  # e2e (requer o Maestro CLI + o app instalado)
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
- `build-apk.yml` — **build do APK no próprio GitHub Actions** (gradle no runner): gera o APK como artifact e cria um release. Rode em Actions → *Build APK (GitHub)*.
- `build.yml` — alternativa via **EAS** na nuvem (requer secret `EXPO_TOKEN`).

## Screenshots

<p align="center">
  <img width="200" alt="Pacientes" src="https://github.com/user-attachments/assets/55bee660-9b40-405d-9c95-e8a044482b16" />
  <img width="200" alt="Detalhe" src="https://github.com/user-attachments/assets/efa3995f-00b0-4f2a-98ca-fbca85829c54" />
  <img width="200" alt="Condicoes" src="https://github.com/user-attachments/assets/9351305f-ab30-4779-9bb4-5957b8c9881a" />
  <img width="200" alt="Filtros" src="https://github.com/user-attachments/assets/59edf547-10c2-4eb0-8d6c-735abb21414b" />
  <img width="200" alt="Favoritos" src="https://github.com/user-attachments/assets/468b6fc5-52bd-40c4-afd0-dd57482345fd" />
  <img width="200" alt="Mapa" src="https://github.com/user-attachments/assets/94459fc0-db30-4166-9f98-20dcaec92a08" />
  <img width="200" alt="Splash" src="https://github.com/user-attachments/assets/a9b65f3a-07e5-4b17-ae1e-4b2d1db7027e" />
</p>

<h2>
  <img src="assets/images/logo.png" width="38" align="left" alt="Essentia Saude" />
  &nbsp;Essentia Saúde, App de Pacientes (React Native + FHIR)
</h2>

Fala pessoal esse é um app mobile de consulta de **pacientes** que consome a **API pública FHIR R4** (padrão mundial de interoperabilidade em saúde). Case técnico para a vaga de Dev Mobile na **Essentia Technologies**. Fiz um domínio alinhado ao produto deles (gestão de clínicas), com dados 100% públicos e identidade da marca um dark com um dourado pelo menos do site principal do grupo.

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
- [x] OTA updates (expo-updates + EAS Update)
- [x] Firebase Analytics integrado (`@react-native-firebase`, eventos instrumentados em `lib/analytics.ts`)
- [ ] Aba de Configurações (tema claro/escuro/sistema)
- [ ] Teclado nativo nos bottom sheets (`react-native-keyboard-controller`, dev build)

> A imagem dos pacientes é um **avatar gerado pelo nome** (FHIR não traz foto); os dados são 100% do FHIR.

## Rodar

### Testar (recomendado): baixar o APK
O app usa módulos nativos (Firebase, mapa), então **não roda no Expo Go**. O jeito mais fácil de testar é baixar o APK já buildado:

> **[Baixar o `essentia.apk` no último Release](https://github.com/DIEGOHORVATTI/essentia-mobile-rn/releases/latest)** e instalar no Android (permitir "fontes desconhecidas").

Um APK novo sai em **Actions -> Build APK (GitHub) -> Run workflow** (ou por tag `v*`).

### Rodar do código (dev build)
```bash
bun install
bunx expo run:android   # gera e instala o dev build no dispositivo/emulador
```

## Libs e por quê
- **Expo Router + TypeScript**: base e navegação por arquivos, tipada.
- **oRPC + Zod**: a API FHIR vira um **contrato tipado**; os tipos fluem pros hooks.
- **TanStack Query**: cache, `useInfiniteQuery` (scroll infinito), retry/refetch.
- **Zustand**: favoritos locais, sem boilerplate.
- **NativeWind (Tailwind)**: `className` + tokens de tema.
- **@gorhom/bottom-sheet**: filtros e detalhe de condição.
- **oxlint + oxfmt**: lint/format rápidos (regra: `useEffect` só em hooks).
- **bun test**: testes da lógica pura (mappers, format, favoritos).

## Arquitetura
Por feature. A **borda de rede é tipada por contrato** e os dados crus do FHIR são traduzidos para um **modelo de domínio** (`mappers.ts`) antes da UI: os testes ficam na lógica pura.
```
src/contracts  contrato oRPC/FHIR (fonte de tipos)
src/lib        client FHIR, query client, utils
src/features/patients  mappers, hooks, components, filters
src/theme | src/components | src/hooks | src/stores | src/app
```

## Decisões técnicas
- **Contrato oRPC para a API FHIR**: mesmo sendo uma API externa, descrevi as rotas num contrato tipado (Zod). Os tipos de input/output fluem do contrato para os hooks, uma fonte única de verdade e menos erro na borda de rede.
- **Camada de domínio (`mappers.ts`)**: os recursos crus do FHIR (verbosos e irregulares) viram um modelo enxuto antes de chegar na UI. Componentes ficam simples e os testes concentram na lógica pura.
- **Paginação por cursor** (não offset): funciona igual no HAPI e no SMART, seguindo o `Bundle.link[next]` do FHIR.
- **Avatar gerado pelo nome**: FHIR não traz foto do paciente; usei avatares determinísticos, comum em apps de saúde reais.
- **Mapa via Leaflet em WebView** (não `react-native-maps`): mapa nativo exige chave do Google Maps; Leaflet/OSM é keyless, roda no Expo Go e no dev build, com clustering e avatares nos markers.
- **Estado**: TanStack Query no servidor (cache + scroll infinito + persistência offline) e Zustand no cliente (favoritos).
- **Qualidade**: oxlint + oxfmt e uma regra própria que proíbe `useEffect` fora de hooks; testes de unidade + e2e (Maestro).
- **Analytics**: `lib/analytics.ts` abstrai a telemetria e envia os eventos ao **Firebase Analytics** (`@react-native-firebase`), com fallback quando o módulo nativo não está presente (ex.: Expo Go). Só roda em dev build/APK.

## Possíveis melhorias futuras
- **Configurações**: aba com tema (claro/escuro/sistema) e preferências persistidas.
- **Teclado nos bottom sheets**: `react-native-keyboard-controller` pro sheet subir junto com o teclado (precisa de dev build).
- **Autenticação real** e multi-perfil (médico/recepção), coerente com um produto de clínica.
- **Mais testes**: ampliar e2e (Maestro) e adicionar testes de componente (RN Testing Library).
- **i18n e acessibilidade**: strings traduzíveis, labels/foco e contraste testado.
- **Offline mais rico**: indicador de "sem conexão" e sincronização.
- **Mapa**: heatmap de verdade e filtro por cidade direto no mapa.

## CI/CD
- `ci.yml`: typecheck, lint, testes a cada push.
- `build-apk.yml`: **build do APK no próprio GitHub Actions** (gradle no runner): gera o APK como artifact e cria um release. Rode em Actions, *Build APK (GitHub)*.
- `build.yml`: alternativa via **EAS** na nuvem (requer secret `EXPO_TOKEN`).
- `ota-update.yml`: publica **update OTA** (`eas update`) a cada push na `main` (secret `EXPO_TOKEN` configurado).

## Screenshots

<p align="center">
  <img width="200" alt="Pacientes" src="https://github.com/user-attachments/assets/55bee660-9b40-405d-9c95-e8a044482b16" />
  <img width="200" alt="Detalhe" src="https://github.com/user-attachments/assets/efa3995f-00b0-4f2a-98ca-fbca85829c54" />
  <img width="200" alt="Condicoes" src="https://github.com/user-attachments/assets/9351305f-ab30-4779-9bb4-5957b8c9881a" />
  <img width="200" alt="Filtros" src="https://github.com/user-attachments/assets/59edf547-10c2-4eb0-8d6c-735abb21414b" />
  <img width="200" alt="Favoritos" src="https://github.com/user-attachments/assets/468b6fc5-52bd-40c4-afd0-dd57482345fd" />
  <img width="200" alt="Mapa" src="https://github.com/user-attachments/assets/94459fc0-db30-4166-9f98-20dcaec92a08" />
  <img width="200" alt="Splash" src="https://github.com/user-attachments/assets/a9b65f3a-07e5-4b17-ae1e-4b2d1db7027e" />
  <img width="200" alt="image" src="https://github.com/user-attachments/assets/c25db4a7-9d5c-42b9-8f9d-b03b876d70eb" />
</p>

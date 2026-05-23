# Research: Vitrine Home Screen

**Phase**: 0 — Outline & Research
**Date**: 2026-05-23

## Overview

No [NEEDS CLARIFICATION] markers remained in the spec. Research focused on confirming existing patterns, component contracts, and data flow architecture from the codebase.

## Existing Stack & Patterns (Confirmed)

| Concern | Decision | Rationale |
|---------|----------|-----------|
| **HTTP Layer** | `vitrineService.ts` with Axios (`src/services/`) | Already exists with `listarVitrine()`, `listarProdutos()`, `buscarProduto()` |
| **Base API** | `api.ts` with auth interceptor | Already exists — injects JWT Bearer token from authStore |
| **State Management** | `useState` local in component (no store) | Constitution VI prohibits Zustand for per-screen data; vitrine data is display-only, no cross-screen sync needed |
| **Navigation Contract** | `VitrineStackParamList` with `Produto: { produtoId: string }` | Already defined in `src/navigation/types.ts` |
| **UI Components** | New vitrine-specific components in `src/components/vitrine/` | Following feature-isolation pattern from Constitution V; shared atomic components stay in `ui/` |
| **Styling** | NativeWind with Tailwind classes + color tokens (mar, areia, espuma, ardosia, coral, laranja) | Existing pattern from auth screens |
| **Mock Strategy** | Local data file `src/services/vitrineDataMock.ts` matching `VitrineData` interface | Single-file swap when backend ready (FR-031, FR-032) |
| **Loading** | Skeleton loader component or inline ActivityIndicator | Constitution VI allows simple loading states |
| **Error Handling** | Inline error + "Tentar novamente" button | Pattern consistent with auth screens |

## Key Types to Add (src/types/index.ts)

The following types must be added to satisfy the spec's data model:

- `Banner`: `{ titulo, subtitulo, descricao, imagem }`
- `ProdutoResumo`: `{ id, especie, foto, precoPorKg, pesoDisponivel, badges?, pescador: { id, nome } }`
- `VitrineData`: `{ banner?, pescadores[], categorias[], produtos[] }`

(Existing `Pescador`, `Categoria` types may need extension — review current definitions.)

## Navigation Flow

```
VitrineScreen (home tab)
  ├── toca banner → (no navigation, purely visual)
  ├── toca pescador → local filter (no navigation)
  ├── toca categoria → local filter (no navigation)
  ├── toca produto card → navigate to ProdutoScreen({ produtoId })
  └── busca texto → local filter over produtos[].especie
```

## Alternatives Considered

| Alternative | Rejected Because |
|-------------|-----------------|
| Zustand store for vitrine data | Constitution VI: no cache library; vitrine is display-only per screen |
| React Query / SWR | Constitution VI prohibits external caching libs |
| Server-side search via API | Spec opts for local filter in MVP; endpoint prepared for future |
| Paginated product list | Spec states single-call endpoint for vitrine; no pagination |
| FlatList for product grid | Better performance for large lists but Constitution says "no cache"; ScrollView with simple map is acceptable for MVP scale |

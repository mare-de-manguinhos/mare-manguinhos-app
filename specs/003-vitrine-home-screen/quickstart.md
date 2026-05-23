# Quickstart: Vitrine Home Screen

**Phase**: 1 — Design & Contracts

## What You're Building

A tela inicial do Maré de Manguinhos — a VitrineScreen. É a home do app de delivery com banner promocional, lista de pescadores, filtros de categoria, busca por texto e grid de produtos.

## Integration Points

- **API**: `GET /api/app/vitrine` (mockado localmente enquanto o backend não existe)
- **Navigation**: já integrada ao `VitrineStack` como tela inicial (Vitrine → Produto)
- **Services**: `vitrineService.ts` já existe com os métodos necessários

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/types/index.ts` | **Modify** | Add `VitrineData`, `Banner`, `ProdutoResumo` types |
| `src/services/vitrineDataMock.ts` | **Create** | Mock data matching `VitrineData` interface |
| `src/services/vitrineService.ts` | **Modify** | Add mock fallback when API unavailable |
| `src/components/vitrine/SearchBar.tsx` | **Create** | Search bar component |
| `src/components/vitrine/VitrineBanner.tsx` | **Create** | Promotional banner component |
| `src/components/vitrine/PescadorCard.tsx` | **Create** | Pescador avatar card |
| `src/components/vitrine/CategoriaChip.tsx` | **Create** | Category filter chip |
| `src/components/vitrine/ProdutoCard.tsx` | **Create** | Product card for grid |
| `src/screens/vitrine/VitrineScreen.tsx` | **Modify** | Full implementation |

## Key Decisions

- **Loading**: Skeleton loader while fetching (or spinner for simplicity)
- **Error**: Inline error + "Tentar novamente"
- **Filtering**: Local only (over already-loaded data)
- **Search**: Local filter on `especie` with 300ms debounce
- **Mock**: Single file swap to activate real API
- **State**: `useState` only — no Zustand store for vitrine

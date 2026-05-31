# Implementation Plan: MkDocs Documentação Viva

**Branch**: `011-mkdocs-documentacao-viva` | **Date**: 2026-05-31 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/011-mkdocs-documentacao-viva/spec.md`

## Summary

Implementar MkDocs com tema Material como plataforma de documentação viva do projeto Maré de Manguinhos. A configuração consumirá os documentos existentes em `docs/` (PRD, Arquitetura, Mapeamento de Rotas) como fontes primárias da verdade e adicionará uma visão geral da estrutura do código-fonte como fonte secundária. O deploy será automatizado via GitHub Actions para GitHub Pages.

## Technical Context

**Language/Version**: Python 3.9+ (runtime para MkDocs)  
**Primary Dependencies**: mkdocs, mkdocs-material (tema), mkdocs-section-index (navegação por seções)  
**Storage**: N/A (geração de site estático, sem banco de dados)  
**Testing**: Inspeção visual do site gerado localmente antes do deploy  
**Target Platform**: GitHub Pages (HTML/CSS/JS estático)  
**Project Type**: Site de documentação estática  
**Performance Goals**: Site carrega em <3s em banda larga, busca retorna resultados em <2s  
**Constraints**: Site 100% estático, sem server-side runtime, compatível com GitHub Pages  
**Scale/Scope**: 3-5 páginas de documentação, índice navegável, busca full-text

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Esta feature é de **documentação exclusivamente** — não envolve alteração de código-fonte do app. Portanto, os princípios I a VI da constituição (Arquitetura em Camadas, TypeScript, Segurança, Domínio, Isolamento, YAGNI) **não se aplicam**.

**Princípios aplicáveis:**

| Princípio | Status | Justificativa |
|-----------|--------|---------------|
| VII. Colaboração Acadêmica via Git | ✅ OK | Commits de documentação devem seguir Conventional Commits (`docs:`). A configuração MkDocs e workflow do GitHub Actions residem na branch `main` como infraestrutura do projeto. |
| VI. Escopo MVP (YAGNI) | ✅ OK | Nenhuma funcionalidade fora do escopo está sendo adicionada. A documentação é suporte ao MVP, não uma feature do app. |
| I. Camadas (indiretamente) | ⚠️ N/A | O MkDocs não faz parte das 3 camadas do app. A documentação da arquitetura em camadas será incluída no site. |

**GATE**: ✅ Aprovado — nenhuma violação de princípios.

## Project Structure

### Documentation (this feature)

```
specs/011-mkdocs-documentacao-viva/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Research findings
├── data-model.md        # Phase 1: Documentation structure
├── quickstart.md        # Phase 1: Setup and run guide
├── contracts/           # Phase 1: MkDocs config + CI workflow spec
│   └── mkdocs-schema.md
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
mare-manguinhos-app/
├── mkdocs.yml                 # MkDocs configuration file (NEW)
├── docs/                      # Source documents (EXISTING)
│   ├── index.md               # Home page for MkDocs site (NEW)
│   ├── prd-mvp-app-mare-manguinhos.md
│   ├── arch-mvp-app-mare-manguinhos.md
│   ├── map-routes-backend-mare-manguinhos.md
│   ├── pitch-app-mare-manguinhos.pptx
│   └── codebase/              # Codebase overview (NEW)
│       └── overview.md
├── .github/
│   └── workflows/
│       └── docs.yml           # GitHub Actions for MkDocs deploy (NEW)
├── requirements-docs.txt      # Python deps for MkDocs (NEW)
└── src/                       # App source (EXISTING - referenced in docs)
```

**Structure Decision**: Estrutura plana na raiz do repositório, com `mkdocs.yml` como ponto de configuração. Os documentos Markdown existentes em `docs/` são mantidos inalterados. A página inicial (`docs/index.md`) é o único novo documento de conteúdo. O workflow CI/CD e o arquivo de dependências vivem em seus locais convencionais.

## Complexity Tracking

> Nenhuma violação da constituição. Seção não aplicável.

## Phases

### Phase 0: Research

See [research.md](research.md) for findings. Key questions investigated:
- MkDocs Material theme: optimal configuration for this project
- GitHub Pages deployment: workflow patterns for MkDocs
- MkDocs navigation: how to structure with existing docs
- Plugin selection: what's needed vs nice-to-have

### Phase 1: Design & Contracts

See artifacts:
- [data-model.md](data-model.md) — Documentation structure and navigation design
- [contracts/mkdocs-schema.md](contracts/mkdocs-schema.md) — MkDocs configuration specification
- [quickstart.md](quickstart.md) — How to run the docs locally

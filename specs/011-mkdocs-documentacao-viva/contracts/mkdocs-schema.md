# Contract: MkDocs Configuration Specification

> Defines the expected structure and configuration contract for the MkDocs documentation site.

## 1. mkdocs.yml (Root Configuration)

O arquivo `mkdocs.yml` na raiz do repositório é o **contrato central** que define toda a configuração do site de documentação.

### Required Fields

```yaml
site_name: "Maré de Manguinhos"
site_description: "Documentação do App Consumidor — Maré de Manguinhos"
site_url: "https://<org>.github.io/mare-manguinhos-app/"
repo_url: "https://github.com/<org>/mare-manguinhos-app"
```

### Theme Configuration

```yaml
theme:
  name: material
  language: pt-BR
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.top
    - search.highlight
    - content.code.copy
  palette:
    primary: teal
    accent: deep orange
```

### Navigation Structure

```yaml
nav:
  - Home: index.md
  - Produto:
    - PRD: prd-mvp-app-mare-manguinhos.md
  - Técnico:
    - Arquitetura: arch-mvp-app-mare-manguinhos.md
    - Rotas da API: map-routes-backend-mare-manguinhos.md
  - Desenvolvimento:
    - Codebase: codebase/overview.md
```

### Plugins

```yaml
plugins:
  - search
  - section-index
```

### Extra

```yaml
extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/<org>/mare-manguinhos-app
  generator: false
```

### Markdown Extensions

```yaml
markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences
  - tables
  - toc:
      permalink: true
```

## 2. docs/ Directory Contract

### Required Files

| File | Status | Description |
|------|--------|-------------|
| `docs/index.md` | **NEW** | Home page. Must contain project overview, purpose, and navigation links. |
| `docs/prd-mvp-app-mare-manguinhos.md` | Existing | PRD document. Must NOT be modified. |
| `docs/arch-mvp-app-mare-manguinhos.md` | Existing | Architecture document. Must NOT be modified. |
| `docs/map-routes-backend-mare-manguinhos.md` | Existing | Routes mapping. Must NOT be modified. |
| `docs/pitch-app-mare-manguinhos.pptx` | Existing | Pitch deck. Will be ignored by MkDocs. |

### Optional Files

| File | Status | Description |
|------|--------|-------------|
| `docs/codebase/overview.md` | **NEW** | Codebase overview documenting src/ structure. |

## 3. Deployment Contract

### requirements-docs.txt (Root)

```
mkdocs>=1.6
mkdocs-material>=9.5
mkdocs-section-index>=0.3
```

### GitHub Actions Workflow (.github/workflows/docs.yml)

```yaml
name: docs
on:
  push:
    branches: [main]
    paths:
      - "docs/**"
      - "mkdocs.yml"
      - "requirements-docs.txt"
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.9"
      - uses: actions/cache@v4
        with:
          key: mkdocs-${{ hashFiles('requirements-docs.txt') }}
          path: ~/.cache/pip
      - run: pip install -r requirements-docs.txt
      - run: mkdocs build --strict
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site/
  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 4. Validation Rules

- `mkdocs.yml` DEVE ser YAML válido
- Todos os paths em `nav` DEVEM corresponder a arquivos existentes em `docs/`
- `mkdocs build --strict` DEVE passar sem warnings
- O tema DEVE ser `material` (único tema suportado)
- A saída do build DEVE estar em `site/` (convenção MkDocs)
- Nenhum arquivo fora de `docs/` DEVE ser incluído no build (config `docs_dir: docs`)

# Data Model: MkDocs Documentation Structure

> Defines the information architecture and entity model for the MkDocs living documentation.

## Overview

O site de documentação é composto por **documentos fonte** (arquivos Markdown em `docs/`) organizados em uma **árvore de navegação** definida no `mkdocs.yml`. Cada documento representa uma entidade de informação independente.

## Entities

### 1. DocumentationPage

Cada página é um arquivo Markdown renderizado como uma página HTML pelo MkDocs.

| Attribute | Type | Description |
|-----------|------|-------------|
| `slug` | `string` | Identificador usado na URL e no `nav` do mkdocs.yml |
| `title` | `string` | Título exibido na navegação e no H1 da página |
| `sourceFile` | `path` | Caminho relativo ao arquivo Markdown em `docs/` |
| `order` | `integer` | Posição na hierarquia de navegação |
| `section` | `string` | Seção agrupadora (Home, Produto, Técnico, etc.) |
| `isIndex` | `boolean` | Se é a página inicial do site |

### 2. NavigationTree

Árvore de navegação definida no `mkdocs.yml` que organiza as páginas em seções.

```
Home (index.md)
├── Produto
│   ├── PRD (prd-mvp-app-mare-manguinhos.md)
├── Técnico
│   ├── Arquitetura (arch-mvp-app-mare-manguinhos.md)
│   ├── Rotas da API (map-routes-backend-mare-manguinhos.md)
├── Desenvolvimento
│   ├── Codebase Overview (codebase/overview.md)
```

### 3. MkDocsConfig

Configuração central do site.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `siteName` | `string` | "Maré de Manguinhos" | Nome do projeto exibido no header |
| `theme` | `string` | "material" | Tema MkDocs |
| `themeFeatures` | `list` | [navigation.tabs, navigation.sections] | Features do tema Material |
| `palette` | `object` | {primary: "teal", accent: "deep orange"} | Esquema de cores |
| `language` | `string` | "pt-BR" | Idioma da interface |
| `plugins` | `list` | [search, section-index] | Plugins ativos |
| `nav` | `tree` | — | Estrutura de navegação |
| `extra` | `object` | {social: [], analytics: {}} | Configurações extras |

### 4. DeployPipeline

Pipeline de CI/CD que constrói e publica o site.

| Attribute | Type | Description |
|-----------|------|-------------|
| `trigger` | `event` | Push na branch `main` com paths docs/**, mkdocs.yml, requirements-docs.txt |
| `pythonVersion` | `string` | "3.9" |
| `buildStep` | `command` | `mkdocs build --strict` |
| `outputDir` | `path` | `site/` |
| `targetBranch` | `string` | `gh-pages` |
| `cacheStrategy` | `strategy` | Cache pip dependencies por hash de `requirements-docs.txt` |

## Relationships

```
NavigationTree
  └── DocumentationPage (1..N): uma árvore contém várias páginas
  └── MkDocsConfig (1:1): a árvore é definida dentro da config

MkDocsConfig
  └── DeployPipeline (1:1): a config é usada pelo pipeline para build

DocumentationPage
  └── Codebase (0..1): páginas podem referenciar partes do código-fonte
```

## State (do site)

O site MkDocs é **imutável após o build** (estático). Não há estado transicional. Estados relevantes:

| State | Description |
|-------|-------------|
| `source` | Documentos Markdown no diretório `docs/` |
| `building` | Processo de compilação (`mkdocs build`) |
| `published` | Site HTML publicado no GitHub Pages |
| `failed` | Build falhou (erro de sintaxe, link quebrado) |

## Validation Rules

- Todo arquivo Markdown em `docs/` referenciado no `nav` DEVE existir
- O título de cada página NÃO DEVE exceder 60 caracteres
- A página `index.md` DEVE existir na raiz de `docs/`
- O `mkdocs.yml` DEVE ser válido (YAML bem formado)
- O build DEVE ser executado com `--strict` para capturar warnings como erros

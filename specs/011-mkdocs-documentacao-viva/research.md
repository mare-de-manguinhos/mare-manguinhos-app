# Research: MkDocs Documentação Viva

> Phase 0 research findings for MkDocs living documentation setup.

## 1. MkDocs Material Theme

**Decision**: Adotar `mkdocs-material` como tema.

**Rationale**:
- Tema mais popular do ecossistema MkDocs (25k+ GitHub stars)
- Suporte nativo a busca full-text (lunr.js) sem plugins adicionais
- Responsivo em mobile e desktop
- Suporte a tabs de navegação, seções aninhadas, dark mode
- Plugin `mkdocs-section-index` para navegação por seções hierárquicas
- Tema ativamente mantido e compatível com MkDocs mais recente

**Alternativas consideradas**:
- `mkdocs-readthedocs`: Tema clássico, menos recursos visuais, sem tabs
- `mkdocs-bootswatch`: Temas Bootstrap, menos polidos
- Tema próprio: Overhead de manutenção desnecessário

## 2. GitHub Pages Deployment

**Decision**: Publicar via GitHub Actions para GitHub Pages na branch `gh-pages`.

**Rationale**:
- Repositório já hospedado no GitHub
- GitHub Pages é gratuito e integrado nativamente
- GitHub Actions já disponível no mesmo ecossistema
- Padrão amplamente documentado com `actions/deploy-pages`

**Alternativas consideradas**:
- Netlify: Serviço externo, mais configuração
- Vercel: Overkill para docs estáticos
- Deploy manual: Propenso a erro, sem automação

## 3. Navigation Structure

**Decision**: Estrutura plana com seções no índice, documentação existente mantida inalterada.

**Rationale**:
- Os arquivos existentes em `docs/` já estão bem escritos e completos
- Renomeá-los ou movê-los quebraria referências cruzadas existentes
- O arquivo `index.md` na raiz de `docs/` serve como landing page do site
- A navegação no `mkdocs.yml` usa paths relativos para os arquivos existentes

**Seções propostas**:
- Home (`index.md`) — visão geral do projeto, propósito, links rápidos
- Product Requirements Document (`prd-mvp-app-mare-manguinhos.md`)
- Arquitetura do App (`arch-mvp-app-mare-manguinhos.md`)
- Mapeamento de Rotas (`map-routes-backend-mare-manguinhos.md`)
- Codebase (`codebase/overview.md`) — visão geral do código-fonte

## 4. Plugin Selection

**Decision**: Mínimo de plugins possível.

| Plugin | Necessário? | Motivo |
|--------|-------------|--------|
| search (built-in) | ✅ Sim | Busca full-text essencial |
| mkdocs-section-index | ✅ Sim | Navegação com subseções |
| mkdocs-material (tema) | ✅ Sim | Tema com search incluso |
| mkdocs-minify-plugin | ❌ Não | Site pequeno, sem necessidade de minificação |
| mkdocs-awesome-pages | ❌ Não | Estrutura simples não justifica |
| mkdocs-redirects | ❌ Não | Sem URLs legadas para redirecionar |

## 5. Python and Dependencies

**Decision**: Usar Python 3.9+ com pip para gerenciar dependências do MkDocs.

**Rationale**:
- Ambiente Python padrão, disponível em GitHub Actions runners
- Arquivo `requirements-docs.txt` na raiz para transparência
- Dependências separadas do Node.js (app mobile)

**Dependências mínimas**:
```
mkdocs>=1.6
mkdocs-material>=9.5
mkdocs-section-index>=0.3
```

## 6. CI/CD Workflow

**Decision**: GitHub Action executada em push na branch `main` quando arquivos em `docs/`, `mkdocs.yml` ou `requirements-docs.txt` são modificados.

**Rationale**:
- Deploy automático sem intervenção manual
- Filtragem por path evita builds desnecessários
- Workflow reutilizável de `actions/deploy-pages`
- Cache de dependências pip para builds mais rápidos

**Workflow steps**:
1. Checkout do repositório
2. Setup Python 3.9
3. Cache pip dependencies
4. Instalar dependências: `pip install -r requirements-docs.txt`
5. Build: `mkdocs build --strict`
6. Deploy para GitHub Pages

## 7. Quickstart Local

Os desenvolvedores podem visualizar a documentação localmente com:
```bash
pip install -r requirements-docs.txt
mkdocs serve
```

Isso levanta um servidor local em `http://127.0.0.1:8000` com live-reload.

## 8. Configuration Reference

- **MkDocs config location**: `/mkdocs.yml` (raiz do repositório)
- **Python deps**: `/requirements-docs.txt` (raiz do repositório)
- **Workflow CI**: `.github/workflows/docs.yml`
- **Source docs**: `docs/`
- **Output directory**: `site/` (gerado pelo `mkdocs build`, gitignored)
- **Deploy branch**: `gh-pages` (gerenciada pelo GitHub Actions)

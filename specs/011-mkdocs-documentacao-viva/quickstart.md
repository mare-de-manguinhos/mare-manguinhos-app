# Quickstart: MkDocs Documentação Viva

> Como configurar e executar a documentação MkDocs localmente.

## Pré-requisitos

- Python 3.9 ou superior
- pip (gerenciador de pacotes Python)
- Git

## Setup

```bash
# 1. Instalar dependências
pip install -r requirements-docs.txt

# 2. Servir localmente (com live-reload)
mkdocs serve
```

O servidor estará disponível em `http://127.0.0.1:8000`. Qualquer alteração em arquivos em `docs/` ou no `mkdocs.yml` será refletida automaticamente no navegador.

## Build

```bash
# Gerar site estático em site/
mkdocs build --strict
```

A flag `--strict` converte warnings em erros, garantindo que o build de produção seja limpo.

## Estrutura esperada

```
mkdocs.yml          # Configuração principal
docs/               # Documentos fonte
├── index.md        # Home page
├── prd-mvp-app-mare-manguinhos.md
├── arch-mvp-app-mare-manguinhos.md
├── map-routes-backend-mare-manguinhos.md
├── pitch-app-mare-manguinhos.pptx  # Ignorado pelo MkDocs
└── codebase/
    └── overview.md
requirements-docs.txt  # Dependências Python
```

## Comandos úteis

```bash
# Verificar configuração
mkdocs --version

# Validar config sem build
mkdocs build --strict --verbose

# Limpar build anterior
mkdocs build --clean
```

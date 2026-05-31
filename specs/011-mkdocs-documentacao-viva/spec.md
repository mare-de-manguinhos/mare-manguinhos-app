# Feature Specification: MkDocs Documentação Viva

**Feature Branch**: `011-mkdocs-documentacao-viva`  
**Created**: 2026-05-31  
**Status**: Draft  
**Input**: User description: "Implementar documentação viva com MkDocs usando docs/ e codebase como fontes da verdade"

## User Scenarios & Testing

### User Story 1 - Navegar pela documentação do projeto (Priority: P1)

Como desenvolvedor ou stakeholder do projeto Maré de Manguinhos, quero acessar uma documentação bem estruturada e organizada em um site, para entender a arquitetura, as decisões de projeto, o PRD e os endpoints da API sem precisar abrir arquivos Markdown soltos.

**Why this priority**: Sem uma documentação navegável, cada pessoa precisa buscar manualmente nos arquivos `docs/`, sem índice, sem busca e sem hierarquia visual — o que dificulta onboarding e consulta rápida.

**Independent Test**: Um site MkDocs é publicado com índice navegável contendo as seções de PRD, Arquitetura, Mapeamento de Rotas e Visão Geral do Projeto. Qualquer pessoa pode abrir o site e encontrar cada documento em até 2 cliques.

**Acceptance Scenarios**:

1. **Given** que o MkDocs está configurado e publicado, **When** um usuário acessa a URL do site, **Then** ele vê uma página inicial com índice de navegação contendo links para todas as seções de documentação.
2. **Given** que o usuário está na página inicial, **When** ele clica em "Arquitetura", **Then** o conteúdo do arquivo `docs/arch-mvp-app-mare-manguinhos.md` é exibido formatado com headings, tabelas e diagramas preservados.
3. **Given** que o usuário está em qualquer página, **When** ele usa a barra de busca, **Then** resultados relevantes aparecem com trechos do conteúdo correspondente.

---

### User Story 2 - Consultar decisões de projeto e architecture decision records (Priority: P2)

Como desenvolvedor trabalhando em uma nova funcionalidade, quero consultar as decisões de arquitetura e suas justificativas documentadas junto com a visão geral do código, para tomar decisões consistentes com o restante do projeto.

**Why this priority**: Decisões de projeto documentadas e acessíveis reduzem retrabalho e garantem que o time mantenha consistência arquitetural mesmo com membros em formação.

**Independent Test**: A seção de arquitetura do MkDocs inclui a tabela de Decisões e Justificativas (item 11 do doc de arquitetura) e uma visão geral da estrutura de pastas do `src/`. Um desenvolvedor pode consultar "por que Zustand e não Redux?" e encontrar a resposta documentada.

**Acceptance Scenarios**:

1. **Given** que a documentação está publicada, **When** um desenvolvedor acessa a página de Arquitetura, **Then** ele encontra a tabela de decisões de projeto com justificativas claras.
2. **Given** que a página de Arquitetura inclui a estrutura de pastas, **When** um desenvolvedor navega pela árvore de diretórios documentada, **Then** ele entende a organização do código-fonte e a responsabilidade de cada camada.

---

### User Story 3 - Deploy automatizado da documentação (Priority: P3)

Como mantenedor do projeto, quero que a documentação seja publicada automaticamente sempre que houver alterações nos arquivos `docs/` ou na configuração do MkDocs, para garantir que o site esteja sempre atualizado sem esforço manual.

**Why this priority**: Documentação desatualizada perde credibilidade rapidamente. Automatizar o deploy elimina o atrito de "lembrar de publicar" e incentiva atualizações frequentes.

**Independent Test**: Após um `git push` que modifica qualquer arquivo em `docs/`, o site de documentação é atualizado automaticamente em menos de 5 minutos sem intervenção manual.

**Acceptance Scenarios**:

1. **Given** que um arquivo em `docs/` foi modificado e enviado para o repositório remoto, **When** o CI/CD é executado, **Then** o site MkDocs é reconstruído e republicado automaticamente.
2. **Given** que o deploy foi executado com sucesso, **When** um usuário acessa a URL da documentação, **Then** ele vê a versão mais recente com as alterações aplicadas.

---

### Edge Cases

- O que acontece quando o diretório `docs/` está vazio ou não existe? O MkDocs deve exibir uma página inicial mínima informando que a documentação está sendo construída.
- Como o sistema se comporta se o build do MkDocs falhar (ex: erro de sintaxe em um arquivo Markdown)? O deploy anterior deve permanecer no ar e um alerta deve ser gerado no log do CI/CD.
- Como lidar com arquivos não-Markdown em `docs/` (ex: `.pptx`)? O MkDocs deve ignorá-los silenciosamente ou exibi-los como downloads.

## Requirements

### Functional Requirements

- **FR-001**: Sistema DEVE configurar MkDocs com um tema moderno e responsivo (ex: Material for MkDocs) que funcione em dispositivos móveis e desktop.
- **FR-002**: Sistema DEVE organizar a documentação existente em `docs/` em uma estrutura de navegação com índice, categorias e busca full-text.
- **FR-003**: Sistema DEVE incluir uma página inicial (home) com visão geral do projeto, propósito e links para as principais seções.
- **FR-004**: Sistema DEVE expor as decisões de arquitetura e design com justificativas em uma seção dedicada.
- **FR-005**: Sistema DEVE incluir o mapeamento de endpoints (tela → rota da API) como documentação navegável.
- **FR-006**: Sistema DEVE incluir uma visão geral da estrutura de diretórios do código-fonte com descrição da responsabilidade de cada camada.
- **FR-007**: Sistema DEVE ser publicável via GitHub Pages (ou serviço equivalente gratuito) integrado ao fluxo de CI/CD do repositório.
- **FR-008**: Sistema DEVE ser construído e publicado automaticamente em cada push na branch principal que modifique arquivos de documentação ou configuração.
- **FR-009**: Usuários DEVEM poder buscar conteúdo textual em toda a documentação através de uma barra de busca.
- **FR-010**: Sistema DEVE preservar tabelas, diagramas ASCII e formatação dos documentos Markdown existentes.

### Key Entities

- **Documentação Fonte (docs/)**: Conjunto de arquivos Markdown (PRD, Arquitetura, Rotas) que servem como entrada principal do MkDocs.
- **Site MkDocs**: Saída HTML estática gerada pelo MkDocs, publicada e navegável via navegador.
- **Configuração MkDocs (mkdocs.yml)**: Arquivo de configuração que define tema, navegação, plugins e estrutura do site.
- **Pipeline de Deploy**: Fluxo automatizado (GitHub Actions ou similar) que constrói e publica o site a cada atualização.
- **Código-fonte (src/)**: Fonte secundária da verdade; a estrutura de diretórios e as decisões de código são documentadas textualmente no site.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Um novo membro do time consegue entender a arquitetura do projeto, as tecnologias usadas e o fluxo do usuário em menos de 15 minutos lendo a documentação.
- **SC-002**: O site de documentação carrega em menos de 3 segundos em conexão banda larga e é responsivo em dispositivos móveis.
- **SC-003**: 100% dos documentos existentes em `docs/` são migrados para o MkDocs e estão acessíveis no site sem perda de conteúdo.
- **SC-004**: O deploy automatizado é concluído em menos de 3 minutos após um push na branch principal.
- **SC-005**: A busca full-text retorna resultados relevantes em menos de 2 segundos.
- **SC-006**: A documentação recebe zero alertas de build com erro (dead links, sintaxe inválida) após a configuração inicial.

## Assumptions

- O projeto já possui um repositório Git hospedado no GitHub, permitindo uso do GitHub Pages e GitHub Actions para deploy.
- O tema Material for MkDocs será adotado por ser o mais popular, maduro e com melhor suporte a busca, responsividade e plugins.
- O arquivo .pptx (pitch) em `docs/` será ignorado pelo MkDocs ou referenciado como link para download, não convertido.
- A estrutura de navegação seguirá a hierarquia natural dos documentos: Visão Geral > PRD > Arquitetura > Rotas da API.
- O deploy será feito via GitHub Pages na branch `gh-pages`, com GitHub Actions orquestrando o build.
- Python 3 e pip estarão disponíveis no ambiente de CI para instalação do MkDocs e plugins.

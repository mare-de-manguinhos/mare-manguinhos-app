# Product Requirements Document (PRD)
# Maré de Manguinhos — App Consumidor (Módulo Mobile)

---

## 1. Problema

Os moradores de Manguinhos (Serra, ES) e regiões vizinhas não têm acesso fácil ao pescado fresco capturado pela própria comunidade local. O consumidor que deseja comprar peixe direto do pescador artesanal enfrenta barreiras concretas:

- **Falta de visibilidade**: não sabe quais espécies estão disponíveis, em que quantidade e a que preço — sem ir pessoalmente ao cais.
- **Dependência de horário e presença física**: a venda acontece no momento em que o barco atraca, exigindo que o comprador esteja no lugar certo na hora certa.
- **Ausência de conveniência**: não há opção de entrega em domicílio, escolha de corte ou pagamento digital no modelo atual.
- **Desconfiança sobre frescor e origem**: canais genéricos de delivery não oferecem rastreabilidade de quem pescou, onde e quando.

**Quem tem esse problema:** Moradores locais de Manguinhos (especialmente idosos e famílias) e consumidores de bairros vizinhos que valorizam frescor, origem sustentável e conveniência mas não têm como acessar o pescado artesanal sem ir ao cais.

**Frequência:** A cada vez que o consumidor precisa comprar peixe, potencialmente 1 a 3 vezes por semana para famílias que consomem pescado regularmente.

**Consequências de não resolver:**
- O consumidor migra para supermercados ou peixarias com pescado de procedência desconhecida e menor frescor.
- O pescador artesanal perde um canal de venda com maior margem e é forçado a vender para atravessadores.
- A comunidade deixa de capturar o valor econômico que já produz.

---

## 2. Público-alvo

### 2.1 Segmento Primário — Morador Local de Manguinhos

| Campo                               | Descrição |
|-------------------------------------|-----------|
| **Perfil**                          | Moradores do bairro de Manguinhos, com laço afetivo com a comunidade pesqueira local |
| **Faixa etária**                    | 35 a 65 anos |
| **Contexto de uso**                 | Em casa, pelo celular, querendo comprar peixe fresco sem precisar se deslocar até o cais ou mercado |
| **Relação com tecnologia**          | Usuário habitual de WhatsApp e apps de delivery como iFood; confortável com pedidos online |
| **Benefícios esperados do produto** | Comodidade de receber em casa, confiança na procedência local, preço justo sem atravessador, apoio à comunidade |

### 2.2 Segmento Secundário — Consumidor Premium (Laranjeiras e região)

| Campo                               | Descrição |
|-------------------------------------|-----------|
| **Perfil**                          | Consumidor de classe média-alta, com interesse em alimentação saudável, sustentável e de origem rastreável |
| **Faixa etária**                    | 28 a 55 anos |
| **Contexto de uso**                 | Planeja refeições com antecedência; pesquisa origem dos alimentos; disposto a pagar mais por qualidade |
| **Relação com tecnologia**          | Alto grau de adoção de apps, pagamento digital e e-commerce |
| **Benefícios esperados do produto** | Frescor extremo (direto do barco), narrativa de impacto social, escolha de corte personalizado, entrega programada |

_O que ambos os segmentos esperam **ganhar**:_

> Acesso a peixe fresco de origem conhecida, com a conveniência de um app de delivery, sem precisar ir ao cais, sem depender de horário de atracação e com a certeza de que estão apoiando diretamente um pescador artesanal da comunidade.

---

## 3. Soluções Existentes

| Solução                             | Categoria                      | Resolve bem? |
|-------------------------------------|--------------------------------|--------------|
| **iFood / Rappi**                   | Super-app de delivery          | ❌ Não — sem nicho de pesca artesanal, sem vitrine por pescador, sem rastreabilidade de origem |
| **Peixarias físicas locais**        | Varejo presencial              | ⚠️ Parcialmente — resolve o acesso ao peixe fresco, mas exige deslocamento e não tem delivery |
| **Grupos de WhatsApp comunitários** | Mensageria informal            | ⚠️ Parcialmente — alguma visibilidade de disponibilidade, mas sem UX estruturada, sem pagamento integrado e sem entrega organizada |
| **Mercados e supermercados**        | Varejo generalista             | ⚠️ Parcialmente — conveniência e pagamento digital, mas pescado de procedência incerta e menor frescor |
| **Marketplaces de pesca (nicho)**   | E-commerce vertical            | ❌ Não — voltados a B2B ou regiões com logística estabelecida; sem foco em hiperlocal comunitário |

---

## 4. Concorrentes

| Tipo                    | Nome                           | Diferencial percebido pelo consumidor                                      |
|-------------------------|--------------------------------|----------------------------------------------------------------------------|
| **Concorrente direto 1**   | iFood Mercado                 | Marca consolidada, UX refinada, entrega rápida, ampla cobertura            |
| **Concorrente direto 2**   | Rappi                         | Super-app com delivery de alimentos frescos e conveniência                 |
| **Concorrente indireto 1** | Peixarias e feiras locais     | Confiança no produto, relacionamento presencial, sem taxa de serviço       |
| **Concorrente indireto 2** | Grupos de WhatsApp da comunidade | Zero fricção, direto com o pescador, sem intermediação digital          |

**Ponto de diferenciação do Maré de Manguinhos:**
> Único canal que combina vitrine digital atualizada em tempo real por pescador + escolha de corte + entrega hiperlocal + narrativa de impacto social verificável, tudo numa experiência mobile familiar ao usuário de delivery.

---

## 5. Indicadores de Sucesso do Produto

| Indicador                            | O que mede                                                          | Meta   | Benchmark de mercado              |
|--------------------------------------|---------------------------------------------------------------------|-------------------|-----------------------------------|
| **Taxa de conversão da vitrine**     | % de usuários que abrem o app e fazem ao menos 1 pedido            | ≥ 15%             | iFood mercado maduro: ~20–25%     |
| **Pedidos por semana**               | Volume total de pedidos realizados via app                         | ≥ 30 pedidos/sem  | —                                 |
| **Ticket médio**                     | Valor médio por pedido finalizado                                  | ≥ R$ 40,00        | Delivery de alimentos BR: ~R$ 42  |
| **Taxa de recompra em 30 dias**      | % de clientes que realizam 2+ pedidos no primeiro mês              | ≥ 30%             | Delivery de alimentos BR: ~35–40% |
| **Taxa de pedidos entregues**        | % de pedidos concluídos sem cancelamento após aceite               | ≥ 90%             | —                                 |
| **NPS do consumidor**                | Satisfação geral com a experiência do app                          | ≥ 45              | Apps de delivery referência: ~50  |
| **Tempo médio até o primeiro pedido**| Tempo entre cadastro e primeiro pedido realizado                   | ≤ 5 minutos       | —                                 |

---

## 6. Oportunidade (gap identificado)

> **Gap 1 — Vitrine dinâmica por pescador, não por produto**
> Nenhum app de delivery existente organiza sua vitrine por produtor/pescador. No Maré de Manguinhos, o consumidor escolhe *de quem* quer comprar criando um vínculo com o pescador e com a comunidade. Isso é de certa forma inédito no mercado de delivery e altamente diferenciador para o segmento.

> **Gap 2 — Disponibilidade em tempo real ligada à chegada dos barcos**
> O estoque do app é populado automaticamente à medida que os pescadores enviam áudios pelo WhatsApp ao se aproximar da costa. O consumidor sabe o que está disponível *hoje*, *agora*, não ontem. Nenhum concorrente oferece essa dinâmica de "vitrine viva" para pescado artesanal.

> **Gap 3 — Personalização do corte no fluxo de compra**
> A possibilidade de escolher entre peixe inteiro, limpo ou em filé diretamente no app, antes da entrega, é um diferencial que peixarias físicas oferecem no balcão, mas nenhum app de delivery generalista reproduz para pescado fresco.

> **Gap 4 — Hiperlocal com propósito**
> O consumidor de hoje, especialmente o segmento premium, valoriza saber que seu dinheiro fica na comunidade. O app comunica ativamente o impacto de cada compra — quem pescou, onde, e como a venda contribui para a Associação de Manguinhos.

---

## 7. Escopo do MVP

### ✅ Dentro do MVP

| Funcionalidade                  | Descrição                                                                                   |
|---------------------------------|---------------------------------------------------------------------------------------------|
| **Cadastro e login**            | Criação de conta por e-mail/telefone; autenticação simples                                  |
| **Vitrine hiperlocal**          | Listagem de pescados disponíveis em tempo real, organizados por pescador                    |
| **Página do produto**           | Foto, espécie, peso disponível, preço por kg, nome do pescador                              |
| **Escolha de corte**            | Seleção entre inteiro, limpo ou filé antes de adicionar ao carrinho                         |
| **Carrinho e checkout**         | Resumo do pedido, endereço de entrega, seleção de janela de horário                         |
| **Cálculo de frete**            | Exibição do custo de entrega via motoboy antes da confirmação                               |
| **Pagamento digital**           | Integração com Pix e cartão de crédito/débito                                               |
| **Acompanhamento do pedido**    | Status simplificado: Confirmado → Em preparo → A caminho → Entregue                        |
| **Histórico de pedidos**        | Lista de compras anteriores com possibilidade de repetir pedido                             |

### ❌ Fora do MVP (Backlog futuro)

| Funcionalidade                              | Justificativa de exclusão                                           |
|---------------------------------------------|---------------------------------------------------------------------|
| Módulo B2B para restaurantes                | Fluxo de compra em volume com precificação diferenciada; validar B2C primeiro |
| Programa de fidelidade / cashback           | Complexidade desnecessária na fase de validação                     |
| Avaliações e reviews de pescadores          | Relevante após base de usuários estabelecida                        |
| Notificações push de novos estoques         | Depende de infraestrutura de notificação; prioridade pós-MVP        |
| Login social (Google/Apple)                 | Simplificar autenticação no MVP com e-mail/telefone                 |

---

## 8. Fluxo Principal do Usuário (Happy Path)

```
Abre o app
    │
    ▼
Vê a vitrine com pescados disponíveis hoje
    │
    ▼
Seleciona um produto (ex: Robalo — 1kg — Filé)
    │
    ▼
Adiciona ao carrinho
    │
    ▼
Confirma endereço + escolhe entre entrega ou retirada
    │
    ▼
Revisa resumo do pedido + valor do frete (se aplicável)
    │
    ▼
Realiza pagamento (Pix ou cartão)
    │
    ▼
Acompanha status do pedido
    │
    ▼
Recebe o peixe em casa ou retira no local 🐟
```

---

## 9. Riscos e Mitigações

| Risco                                                    | Probabilidade | Impacto | Mitigação                                                                    |
|----------------------------------------------------------|---------------|---------|------------------------------------------------------------------------------|
| Baixa demanda inicial no app                             | Média         | Alto    | Campanha de pré-lançamento em grupos de WhatsApp locais e condomínios de Laranjeiras |
| Vitrine vazia por falta de estoque dos pescadores        | Média         | Alto    | Coordenação com equipe do módulo WhatsApp; exibir mensagem clara de "sem estoque hoje" |
| Abandono no checkout por problemas no pagamento          | Baixa         | Alto    | Usar gateway consolidado (ex: Stripe, Mercado Pago); testes extensivos de integração |
| Insatisfação com o prazo ou qualidade da entrega         | Média         | Alto    | Acordos prévios com motoboys parceiros; política clara de prazo no app       |
| Desistência por UX confusa no primeiro acesso            | Baixa         | Médio   | Onboarding guiado na primeira abertura; testes de usabilidade com público-alvo antes do lançamento |

---

## 10. Roadmap do Módulo

| Fase                  | Mês | Entregáveis                                                                               |
|-----------------------|-----|-------------------------------------------------------------------------------------------|
| 🔬 **Prototipação**   | 1   | Protótipo navegável no Figma; validação de UX              |
| 📱 **MVP**            | 2   | Vitrine funcional integrada ao backend; fluxo de cadastro e visualização de estoque       |
| 💳 **Checkout**       | 3   | Carrinho, escolha de corte, cálculo de frete, integração de pagamento e status do pedido  |
| 🚀 **Lançamento**     | 4   | App aberto ao público; campanhas de aquisição em Manguinhos e Laranjeiras                 |

---

## 11. Conclusão

O módulo Consumidor do **Maré de Manguinhos** é a face pública de um ecossistema pensado para transformar a realidade de uma comunidade pesqueira artesanal. O app não é apenas um canal de compra — é a vitrine digital de uma tradição, a ponte entre quem pesca e quem come, e a prova de que tecnologia bem aplicada gera impacto social real.

**Tradição no mar, inovação na entrega.**
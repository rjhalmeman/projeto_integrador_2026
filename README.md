# Projeto Integrador

Revisão de conceitos
 - Banco de Dados
 - Frontend
 - Backend
 - Fullstack


## Servidores / API

Sistema de login
 - 

# Projeto Integrador: Sistema PãoTech
> **Arquitetura Modular para Gestão e Vendas de Padarias**

---

## 1. Introdução e Contextualização
O **PãoTech** nasceu da necessidade de modernizar o fluxo de trabalho de padarias, separando a agilidade necessária no balcão de vendas da complexidade da gestão administrativa.

* **Problema:** Lentidão no atendimento e falta de controle de estoque centralizado.
* **Solução:** Uma plataforma Fullstack dividida em módulos especializados para cada perfil de usuário.

---

## 2. Estrutura Modular do Projeto
A arquitetura do projeto foi desenhada para separar as responsabilidades, facilitando a manutenção e a segurança.



### Organização de Diretórios:
* `paotech-auth/`: Módulo exclusivo para autenticação e controle de acesso.
* `paotech-backend/`: API REST central (Node.js + Express + Postgres).
* `paotech-adm/`: Painel do Gerente (Gestão de estoque, pessoas e relatórios).
* `paotech-cli/`: Interface do Ponto de Venda (PDV) e autoatendimento.

---

## 3. Engenharia de Software e Fluxo de Trabalho
Para garantir a qualidade e organização do código, aplicamos conceitos fundamentais de engenharia:

* **Versionamento:** Uso estratégico do **GitHub** com scripts de automação (`pushTo.sh`).
* **Segurança:** Implementação de `authGuard.js` no Frontend e `authMiddleware.js` no Backend.
* **Documentação:** Modelagem de dados e rotas documentadas em Markdown e diagramas DER.

---

## 4. Backend: O Coração do Sistema (`paotech-backend`)
O backend centraliza toda a inteligência do negócio e a persistência de dados.

* **Tecnologias:** Node.js, Express e PostgreSQL.
* **Banco de Dados:** Uso de relacionamentos N:N para gerenciar vendas e produtos.
* **Estrutura MVC:**
    * **Controllers:** Lógicas como cálculo de total da venda e baixa de estoque.
    * **Routes:** Endpoints protegidos por **Token Bearer**.
    * **Database:** Configuração de conexão e persistência.

---

## 5. Sistema de Login e Níveis de Acesso (`paotech-auth`)
A segurança é baseada em perfis de usuário, garantindo que cada um veja apenas o que lhe é permitido.

* **Nível ADM:** Acesso ao `paotech-adm` (CRUDs de produtos, funcionários e relatórios financeiros).
* **Nível USER:** Acesso ao `paotech-cli` (Apenas realização de pedidos e consulta de preços).
* **Mecanismo:** O `authGuard.js` verifica o token de acesso antes de renderizar qualquer página sensível.

---

## 6. Módulo Administrativo e Gestão (`paotech-adm`)
Focado na retaguarda da padaria, permitindo controle total sobre o negócio.

* **Gestão de Produtos:** Cadastro completo com categorias.
* **Gestão de Pessoas:** Controle de funcionários e suas funções.
* **Relacionamentos:** Vinculação de turmas/turnos de trabalho (`turma_has_pessoa`).
* **Relatórios:** Visualização de dados para tomada de decisão.

---

## 7. Módulo de Vendas e PDV (`paotech-cli`)
Interface otimizada para o atendimento ao cliente, visando velocidade e usabilidade.

* **Interface Limpa:** Menu de produtos acessível via JavaScript dinâmico.
* **Algoritmo de Venda:** Processamento de itens no carrinho e envio para o Backend.
* **Feedback em Tempo Real:** Validação de disponibilidade de produtos no estoque.

---

## 8. Conclusão e Resultados
O projeto integrou com sucesso todas as disciplinas do curso:

1.  **Algoritmos:** Lógica de vendas e autenticação.
2.  **Dev Web 1 e 2:** Desenvolvimento do Frontend (HTML/CSS/JS) e integração com Backend (Node/ORM).
3.  **Banco de Dados:** Modelagem e manipulação de dados reais com Postgres.
4.  **Engenharia de Software:** Organização modular e controle de versão.

---

## 9. Demonstração e Perguntas
* **Repositório:** [Link do GitHub]
* **Equipe:** [Nomes]

*Espaço aberto para dúvidas da banca examinadora.*
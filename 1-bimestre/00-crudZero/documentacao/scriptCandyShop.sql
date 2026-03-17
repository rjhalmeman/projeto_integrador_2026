-- Comandos para limpar e recriar o banco de dados
DROP TABLE IF EXISTS public.pagamento_has_forma_pagamento CASCADE;
DROP TABLE IF EXISTS public.pedido_has_produto CASCADE;
DROP TABLE IF EXISTS public.pagamento CASCADE;
DROP TABLE IF EXISTS public.pedido CASCADE;
DROP TABLE IF EXISTS public.produto CASCADE;
DROP TABLE IF EXISTS public.forma_pagamento CASCADE;
DROP TABLE IF EXISTS public.funcionario CASCADE;
DROP TABLE IF EXISTS public.cliente CASCADE;
DROP TABLE IF EXISTS public.cargo CASCADE;
DROP TABLE IF EXISTS public.pessoa CASCADE;

DROP SEQUENCE IF EXISTS public.cargo_id_cargo_seq;
DROP SEQUENCE IF EXISTS public.forma_pagamento_id_forma_pagamento_seq;
DROP SEQUENCE IF EXISTS public.pedido_id_pedido_seq;
DROP SEQUENCE IF EXISTS public.produto_id_produto_seq;

-- Tabela Pessoa
CREATE TABLE public.pessoa (
    cpf_pessoa character varying(20) NOT NULL PRIMARY KEY,
    nome_pessoa character varying(60),
    data_nascimento_pessoa date,
    endereco_pessoa character varying(150),
    senha_pessoa character varying(50),
    email_pessoa character varying(75) UNIQUE
);

-- Tabela Cargo
CREATE SEQUENCE public.cargo_id_cargo_seq;
CREATE TABLE public.cargo (
    id_cargo integer PRIMARY KEY DEFAULT nextval('public.cargo_id_cargo_seq'),
    nome_cargo character varying(45)
);

-- Tabela Funcionario
CREATE TABLE public.funcionario (
    pessoa_cpf_pessoa character varying(20) NOT NULL PRIMARY KEY,
    salario_funcionario double precision,
    cargo_id_cargo integer,
    porcentagem_comissao_funcionario double precision,
    FOREIGN KEY (pessoa_cpf_pessoa) REFERENCES public.pessoa(cpf_pessoa),
    FOREIGN KEY (cargo_id_cargo) REFERENCES public.cargo(id_cargo)
);

-- Tabela Cliente
CREATE TABLE public.cliente (
    pessoa_cpf_pessoa character varying(20) NOT NULL PRIMARY KEY,
    renda_cliente double precision,
    data_cadastro_cliente date,
    FOREIGN KEY (pessoa_cpf_pessoa) REFERENCES public.pessoa(cpf_pessoa)
);

-- Tabela Produto
CREATE SEQUENCE public.produto_id_produto_seq;
CREATE TABLE public.produto (
    id_produto integer PRIMARY KEY DEFAULT nextval('public.produto_id_produto_seq'),
    nome_produto character varying(45),
    quantidade_estoque_produto integer,
    preco_unitario_produto double precision
);

-- Tabela Pedido
CREATE SEQUENCE public.pedido_id_pedido_seq;
CREATE TABLE public.pedido (
    id_pedido integer PRIMARY KEY DEFAULT nextval('public.pedido_id_pedido_seq'),
    data_pedido date,
    cliente_pessoa_cpf_pessoa character varying(20),
    funcionario_pessoa_cpf_pessoa character varying(20),
    FOREIGN KEY (cliente_pessoa_cpf_pessoa) REFERENCES public.cliente(pessoa_cpf_pessoa),
    FOREIGN KEY (funcionario_pessoa_cpf_pessoa) REFERENCES public.funcionario(pessoa_cpf_pessoa)
);

-- Tabela Pedido_has_Produto
CREATE TABLE public.pedido_has_produto (
    produto_id_produto integer NOT NULL,
    pedido_id_pedido integer NOT NULL,
    quantidade integer,
    preco_unitario double precision,
    PRIMARY KEY (produto_id_produto, pedido_id_pedido),
    FOREIGN KEY (produto_id_produto) REFERENCES public.produto(id_produto),
    FOREIGN KEY (pedido_id_pedido) REFERENCES public.pedido(id_pedido)
);

-- Tabela Forma_Pagamento
CREATE SEQUENCE public.forma_pagamento_id_forma_pagamento_seq;
CREATE TABLE public.forma_pagamento (
    id_forma_pagamento integer PRIMARY KEY DEFAULT nextval('public.forma_pagamento_id_forma_pagamento_seq'),
    nome_forma_pagamento character varying(100)
);

-- Tabela Pagamento
CREATE TABLE public.pagamento (
    pedido_id_pedido integer NOT NULL PRIMARY KEY,
    data_pagamento timestamp without time zone,
    valor_total_pagamento double precision,
    FOREIGN KEY (pedido_id_pedido) REFERENCES public.pedido(id_pedido)
);

-- Tabela Pagamento_has_Forma_Pagamento
CREATE TABLE public.pagamento_has_forma_pagamento (
    pagamento_id_pedido integer NOT NULL,
    forma_pagamento_id_forma_pagamento integer NOT NULL,
    valor_pago double precision,
    PRIMARY KEY (pagamento_id_pedido, forma_pagamento_id_forma_pagamento),
    FOREIGN KEY (pagamento_id_pedido) REFERENCES public.pagamento(pedido_id_pedido),
    FOREIGN KEY (forma_pagamento_id_forma_pagamento) REFERENCES public.forma_pagamento(id_forma_pagamento)
);

-- Inserção de dados na tabela Cargo
INSERT INTO public.cargo (id_cargo, nome_cargo) VALUES
(0, 'Vendedor online'),
(1, 'Vendedor'),
(2, 'Gerente'),
(3, 'Caixa'),
(4, 'Supervisor'),
(5, 'Atendente'),
(6, 'Repositor'),
(7, 'Conferente'),
(8, 'Assistente'),
(9, 'Auxiliar'),
(10, 'Diretor');

-- Inserção de dados na tabela Pessoa
INSERT INTO public.pessoa (cpf_pessoa, nome_pessoa, data_nascimento_pessoa, endereco_pessoa, senha_pessoa, email_pessoa) VALUES
('00000000000', 'online', '1900-01-01', 'Loja', 'abc123', 'online@gmail.com'),
('1', 'Berola', '2025-10-16', 'Lá onde Judas perdeu a unha, s/n', '12345', 'berola@gmail.com'),
('2', 'dois', '2025-10-07', 'Rua das Magnólias', '123', 'dois@email.com'),
('10101010101', 'Juliana Dias ssss', '1989-10-25', 'lins, 352 ssss', '1111', 'juliana@email.comm'),
('11111111111', 'João Silva', '2025-01-01', 'algum lugar', '.123456', 'joao@email.com'),
('22222222222', 'Maria Souza', '1985-02-15', 'lá longe, 1234', '.123456', 'maria@email.com'),
('33333333333', 'Carlos Pereira', '1992-03-20', 'Rua que Judas perdeu as botas, 234', '.123456', 'carlos@email.com'),
('44444444444', 'Ana Lima', '1995-04-25', 'Alameda do medo, 4534 apto 13', '.123456', 'ana@email.com'),
('55555555555', 'Lucas Mendes', '1988-05-30', 'Rua sexta_feira, 13 _ apto 666', '.123456', 'lucas@email.com'),
('66666666666', 'Fernanda Costa', '1993-06-05', 'muito longe, 243', '.123456', 'fernanda@email.com'),
('77777777777', 'Ricardo Alves', '1987-07-10', 'far far faraway, 34', '.123456', 'ricardo@email.com'),
('88888888888', 'Patrícia Gomes', '1994-08-15', 'acolá, 54', '.123456', 'patricia@email.com'),
('99999999999', 'Marcos Rocha', '1991-09-20', 'kaxa prego _ ilha de itaparica', '.123456', 'marcos@email.com');

-- Inserção de dados na tabela Funcionario
INSERT INTO public.funcionario (pessoa_cpf_pessoa, salario_funcionario, cargo_id_cargo, porcentagem_comissao_funcionario) VALUES
('00000000000', 0, 0, 0),
('1', 1111, 9, 1),
('10101010101', 5000, 2, 15),
('22222222222', 3000, 2, 10),
('33333333333', 1500, 3, 3),
('44444444444', 2500, 4, 6),
('55555555555', 1800, 5, 4),
('66666666666', 1600, 6, 2),
('77777777777', 2200, 7, 5),
('88888888888', 1900, 8, 3),
('99999999999', 2800, 9, 7);

-- Inserção de dados na tabela Cliente
INSERT INTO public.cliente (pessoa_cpf_pessoa, renda_cliente, data_cadastro_cliente) VALUES
('1', 1111, '2025-10-11'),
('2', 22222, '2025-10-15'),
('10101010101', 4500, '2024-01-10'),
('11111111111', 2500, NULL),
('22222222222', 3200, '2024-01-02'),
('33333333333', 1800, '2024-01-03'),
('44444444444', 4000, '2024-01-04'),
('55555555555', 2100, '2024-01-05'),
('66666666666', 3500, '2024-01-06'),
('77777777777', 2700, '2024-01-07'),
('88888888888', 5000, '2024-01-08'),
('99999999999', 3800, '2024-01-09');

-- Inserção de dados na tabela Produto
INSERT INTO public.produto (id_produto, nome_produto, quantidade_estoque_produto, preco_unitario_produto) VALUES
(1, 'Chocolate', 100, 55),
(2, 'Bala', 200, 43),
(3, 'Pirulito', 150, 10),
(4, 'Biscoito', 80, 32),
(5, 'Refrigerante', 50, 70),
(6, 'Suco', 60, 45),
(7, 'Chiclete', 300, 75),
(8, 'Pão de Mel', 40, 60),
(9, 'Doce de Leite', 30, 85),
(10, 'Sorvete', 20, 12),
(50, 'ddddd', NULL, 20);

-- Inserção de dados na tabela Pedido
INSERT INTO public.pedido (id_pedido, data_pedido, cliente_pessoa_cpf_pessoa, funcionario_pessoa_cpf_pessoa) VALUES
(1, '2024-02-01', '44444444444', '22222222222'),
(2, '2024-02-02', '11111111111', '44444444444'),
(3, '2024-02-03', '55555555555', '66666666666'),
(4, '2024-02-04', '99999999999', '88888888888'),
(5, '2024-02-05', '33333333333', '10101010101'),
(7, '2024-02-07', '44444444444', '33333333333'),
(8, '2024-02-08', '66666666666', '55555555555'),
(9, '2024-02-09', '88888888888', '77777777777'),
(10, '2024-02-10', '10101010101', '99999999999'),
(11, '2025-11-12', '11111111111', '00000000000'),
(12, '2025-11-12', '1', '00000000000'),
(13, '2025-11-13', '1', '00000000000'),
(14, '2025-11-13', '1', '00000000000'),
(15, '2025-11-13', '1', '00000000000'),
(16, '2025-11-13', '1', '00000000000'),
(17, '2025-11-13', '1', '00000000000'),
(18, '2025-11-13', '1', '00000000000'),
(19, '2025-11-13', '1', '00000000000'),
(20, '2025-10-10', '33333333333', '22222222222');

-- Inserção de dados na tabela Pedido_has_Produto
INSERT INTO public.pedido_has_produto (produto_id_produto, pedido_id_pedido, quantidade, preco_unitario) VALUES
(1, 1, 2, 5.5),
(2, 1, 1000, 0.7),
(3, 1, 3, 1),
(2, 2, 10, 0.5),
(3, 2, 5, 1),
(4, 2, 3, 3.2),
(2, 3, 1, 0.5),
(4, 4, 4, 4),
(5, 5, 2, 7),
(2, 20, 1, 0.5);

-- Inserção de dados na tabela Forma_Pagamento
INSERT INTO public.forma_pagamento (id_forma_pagamento, nome_forma_pagamento) VALUES
(1, 'Dinheiro'),
(2, 'Cartão de Crédito'),
(3, 'Cartão de Débito'),
(4, 'Pix'),
(5, 'Boleto'),
(6, 'Vale Alimentação'),
(7, 'Transferência Bancária'),
(8, 'Cheque'),
(9, 'Crédito Loja'),
(10, 'Gift Card');

-- Inserção de dados na tabela Pagamento
INSERT INTO public.pagamento (pedido_id_pedido, data_pagamento, valor_total_pagamento) VALUES
(1, '2024-02-01 10:00:00', 50),
(2, '2024-02-02 11:00:00', 30),
(3, '2024-02-03 12:00:00', 20),
(4, '2024-02-04 13:00:00', 70),
(5, '2024-02-05 14:00:00', 100),
(7, '2024-02-07 16:00:00', 25),
(8, '2024-02-08 17:00:00', 45),
(9, '2024-02-09 18:00:00', 60),
(10, '2024-02-10 19:00:00', 90);

-- Inserção de dados na tabela Pagamento_has_Forma_Pagamento
INSERT INTO public.pagamento_has_forma_pagamento (pagamento_id_pedido, forma_pagamento_id_forma_pagamento, valor_pago) VALUES
(1, 1, 20),
(2, 2, 30),
(3, 3, 15),
(4, 4, 50),
(5, 5, 100);

-- Atualização das sequences
SELECT pg_catalog.setval('public.cargo_id_cargo_seq', 10, true);
SELECT pg_catalog.setval('public.forma_pagamento_id_forma_pagamento_seq', 10, true);
SELECT pg_catalog.setval('public.pedido_id_pedido_seq', 19, true);
SELECT pg_catalog.setval('public.produto_id_produto_seq', 10, true);
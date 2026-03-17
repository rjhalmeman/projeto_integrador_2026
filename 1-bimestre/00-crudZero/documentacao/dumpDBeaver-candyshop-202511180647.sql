--
-- PostgreSQL database dump
--

-- Dumped from database version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)

-- Started on 2025-11-18 06:47:48 -03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 211 (class 1259 OID 41502)
-- Name: cargo; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.cargo (
    id_cargo integer NOT NULL,
    nome_cargo character varying(45)
);


ALTER TABLE public.cargo OWNER TO radames;

--
-- TOC entry 210 (class 1259 OID 41501)
-- Name: cargo_id_cargo_seq; Type: SEQUENCE; Schema: public; Owner: radames
--

CREATE SEQUENCE public.cargo_id_cargo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cargo_id_cargo_seq OWNER TO radames;

--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 210
-- Name: cargo_id_cargo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: radames
--

ALTER SEQUENCE public.cargo_id_cargo_seq OWNED BY public.cargo.id_cargo;


--
-- TOC entry 213 (class 1259 OID 41523)
-- Name: cliente; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.cliente (
    pessoa_cpf_pessoa character varying(20) NOT NULL,
    renda_cliente double precision,
    data_cadastro_cliente date
);


ALTER TABLE public.cliente OWNER TO radames;

--
-- TOC entry 220 (class 1259 OID 41568)
-- Name: forma_pagamento; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.forma_pagamento (
    id_forma_pagamento integer NOT NULL,
    nome_forma_pagamento character varying(100)
);


ALTER TABLE public.forma_pagamento OWNER TO radames;

--
-- TOC entry 219 (class 1259 OID 41567)
-- Name: forma_pagamento_id_forma_pagamento_seq; Type: SEQUENCE; Schema: public; Owner: radames
--

CREATE SEQUENCE public.forma_pagamento_id_forma_pagamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forma_pagamento_id_forma_pagamento_seq OWNER TO radames;

--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 219
-- Name: forma_pagamento_id_forma_pagamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: radames
--

ALTER SEQUENCE public.forma_pagamento_id_forma_pagamento_seq OWNED BY public.forma_pagamento.id_forma_pagamento;


--
-- TOC entry 212 (class 1259 OID 41508)
-- Name: funcionario; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.funcionario (
    pessoa_cpf_pessoa character varying(20) NOT NULL,
    salario_funcionario double precision,
    cargo_id_cargo integer,
    porcentagem_comissao_funcionario double precision
);


ALTER TABLE public.funcionario OWNER TO radames;

--
-- TOC entry 218 (class 1259 OID 41557)
-- Name: pagamento; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.pagamento (
    pedido_id_pedido integer NOT NULL,
    data_pagamento timestamp without time zone,
    valor_total_pagamento double precision
);


ALTER TABLE public.pagamento OWNER TO radames;

--
-- TOC entry 222 (class 1259 OID 41589)
-- Name: pagamento_has_forma_pagamento; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.pagamento_has_forma_pagamento (
    pagamento_id_pedido integer NOT NULL,
    forma_pagamento_id_forma_pagamento integer NOT NULL,
    valor_pago double precision
);


ALTER TABLE public.pagamento_has_forma_pagamento OWNER TO radames;

--
-- TOC entry 217 (class 1259 OID 41541)
-- Name: pedido; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.pedido (
    id_pedido integer NOT NULL,
    data_pedido date,
    cliente_pessoa_cpf_pessoa character varying(20),
    funcionario_pessoa_cpf_pessoa character varying(20)
);


ALTER TABLE public.pedido OWNER TO radames;

--
-- TOC entry 221 (class 1259 OID 41574)
-- Name: pedido_has_produto; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.pedido_has_produto (
    produto_id_produto integer NOT NULL,
    pedido_id_pedido integer NOT NULL,
    quantidade integer,
    preco_unitario double precision
);


ALTER TABLE public.pedido_has_produto OWNER TO radames;

--
-- TOC entry 216 (class 1259 OID 41540)
-- Name: pedido_id_pedido_seq; Type: SEQUENCE; Schema: public; Owner: radames
--

CREATE SEQUENCE public.pedido_id_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pedido_id_pedido_seq OWNER TO radames;

--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 216
-- Name: pedido_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: radames
--

ALTER SEQUENCE public.pedido_id_pedido_seq OWNED BY public.pedido.id_pedido;


--
-- TOC entry 209 (class 1259 OID 41496)
-- Name: pessoa; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.pessoa (
    cpf_pessoa character varying(20) NOT NULL,
    nome_pessoa character varying(60),
    data_nascimento_pessoa date,
    endereco_pessoa character varying(150),
    senha_pessoa character varying(50),
    email_pessoa character varying(75)
);


ALTER TABLE public.pessoa OWNER TO radames;

--
-- TOC entry 215 (class 1259 OID 41534)
-- Name: produto; Type: TABLE; Schema: public; Owner: radames
--

CREATE TABLE public.produto (
    id_produto integer NOT NULL,
    nome_produto character varying(45),
    quantidade_estoque_produto integer,
    preco_unitario_produto double precision
);


ALTER TABLE public.produto OWNER TO radames;

--
-- TOC entry 214 (class 1259 OID 41533)
-- Name: produto_id_produto_seq; Type: SEQUENCE; Schema: public; Owner: radames
--

CREATE SEQUENCE public.produto_id_produto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.produto_id_produto_seq OWNER TO radames;

--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 214
-- Name: produto_id_produto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: radames
--

ALTER SEQUENCE public.produto_id_produto_seq OWNED BY public.produto.id_produto;


--
-- TOC entry 3248 (class 2604 OID 41505)
-- Name: cargo id_cargo; Type: DEFAULT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.cargo ALTER COLUMN id_cargo SET DEFAULT nextval('public.cargo_id_cargo_seq'::regclass);


--
-- TOC entry 3251 (class 2604 OID 41571)
-- Name: forma_pagamento id_forma_pagamento; Type: DEFAULT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.forma_pagamento ALTER COLUMN id_forma_pagamento SET DEFAULT nextval('public.forma_pagamento_id_forma_pagamento_seq'::regclass);


--
-- TOC entry 3250 (class 2604 OID 66561)
-- Name: pedido id_pedido; Type: DEFAULT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pedido ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedido_id_pedido_seq'::regclass);


--
-- TOC entry 3249 (class 2604 OID 41537)
-- Name: produto id_produto; Type: DEFAULT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.produto ALTER COLUMN id_produto SET DEFAULT nextval('public.produto_id_produto_seq'::regclass);


--
-- TOC entry 3425 (class 0 OID 41502)
-- Dependencies: 211
-- Data for Name: cargo; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.cargo VALUES (2, 'Gerente');
INSERT INTO public.cargo VALUES (3, 'Caixa');
INSERT INTO public.cargo VALUES (4, 'Supervisor');
INSERT INTO public.cargo VALUES (5, 'Atendente');
INSERT INTO public.cargo VALUES (6, 'Repositor');
INSERT INTO public.cargo VALUES (7, 'Conferente');
INSERT INTO public.cargo VALUES (8, 'Assistente');
INSERT INTO public.cargo VALUES (9, 'Auxiliar');
INSERT INTO public.cargo VALUES (10, 'Diretor');
INSERT INTO public.cargo VALUES (1, 'Vendedor ');
INSERT INTO public.cargo VALUES (0, 'Vendedor online');


--
-- TOC entry 3427 (class 0 OID 41523)
-- Dependencies: 213
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.cliente VALUES ('22222222222', 3200, '2024-01-02');
INSERT INTO public.cliente VALUES ('33333333333', 1800, '2024-01-03');
INSERT INTO public.cliente VALUES ('44444444444', 4000, '2024-01-04');
INSERT INTO public.cliente VALUES ('55555555555', 2100, '2024-01-05');
INSERT INTO public.cliente VALUES ('66666666666', 3500, '2024-01-06');
INSERT INTO public.cliente VALUES ('77777777777', 2700, '2024-01-07');
INSERT INTO public.cliente VALUES ('88888888888', 5000, '2024-01-08');
INSERT INTO public.cliente VALUES ('99999999999', 3800, '2024-01-09');
INSERT INTO public.cliente VALUES ('11111111111', 2500, NULL);
INSERT INTO public.cliente VALUES ('10101010101', 4500, '2024-01-10');
INSERT INTO public.cliente VALUES ('1', 1111, '2025-10-11');
INSERT INTO public.cliente VALUES ('2', 22222, '2025-10-15');


--
-- TOC entry 3434 (class 0 OID 41568)
-- Dependencies: 220
-- Data for Name: forma_pagamento; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.forma_pagamento VALUES (1, 'Dinheiro');
INSERT INTO public.forma_pagamento VALUES (2, 'Cartão de Crédito');
INSERT INTO public.forma_pagamento VALUES (3, 'Cartão de Débito');
INSERT INTO public.forma_pagamento VALUES (4, 'Pix');
INSERT INTO public.forma_pagamento VALUES (5, 'Boleto');
INSERT INTO public.forma_pagamento VALUES (6, 'Vale Alimentação');
INSERT INTO public.forma_pagamento VALUES (7, 'Transferência Bancária');
INSERT INTO public.forma_pagamento VALUES (8, 'Cheque');
INSERT INTO public.forma_pagamento VALUES (9, 'Crédito Loja');
INSERT INTO public.forma_pagamento VALUES (10, 'Gift Card');


--
-- TOC entry 3426 (class 0 OID 41508)
-- Dependencies: 212
-- Data for Name: funcionario; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.funcionario VALUES ('22222222222', 3000, 2, 10);
INSERT INTO public.funcionario VALUES ('33333333333', 1500, 3, 3);
INSERT INTO public.funcionario VALUES ('44444444444', 2500, 4, 6);
INSERT INTO public.funcionario VALUES ('55555555555', 1800, 5, 4);
INSERT INTO public.funcionario VALUES ('66666666666', 1600, 6, 2);
INSERT INTO public.funcionario VALUES ('77777777777', 2200, 7, 5);
INSERT INTO public.funcionario VALUES ('88888888888', 1900, 8, 3);
INSERT INTO public.funcionario VALUES ('99999999999', 2800, 9, 7);
INSERT INTO public.funcionario VALUES ('10101010101', 5000, 2, 15);
INSERT INTO public.funcionario VALUES ('1', 1111, 9, 1);
INSERT INTO public.funcionario VALUES ('00000000000', 0, 0, 0);


--
-- TOC entry 3432 (class 0 OID 41557)
-- Dependencies: 218
-- Data for Name: pagamento; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.pagamento VALUES (1, '2024-02-01 10:00:00', 50);
INSERT INTO public.pagamento VALUES (2, '2024-02-02 11:00:00', 30);
INSERT INTO public.pagamento VALUES (3, '2024-02-03 12:00:00', 20);
INSERT INTO public.pagamento VALUES (4, '2024-02-04 13:00:00', 70);
INSERT INTO public.pagamento VALUES (5, '2024-02-05 14:00:00', 100);
INSERT INTO public.pagamento VALUES (7, '2024-02-07 16:00:00', 25);
INSERT INTO public.pagamento VALUES (8, '2024-02-08 17:00:00', 45);
INSERT INTO public.pagamento VALUES (9, '2024-02-09 18:00:00', 60);
INSERT INTO public.pagamento VALUES (10, '2024-02-10 19:00:00', 90);


--
-- TOC entry 3436 (class 0 OID 41589)
-- Dependencies: 222
-- Data for Name: pagamento_has_forma_pagamento; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.pagamento_has_forma_pagamento VALUES (1, 1, 20);
INSERT INTO public.pagamento_has_forma_pagamento VALUES (2, 2, 30);
INSERT INTO public.pagamento_has_forma_pagamento VALUES (3, 3, 15);
INSERT INTO public.pagamento_has_forma_pagamento VALUES (4, 4, 50);
INSERT INTO public.pagamento_has_forma_pagamento VALUES (5, 5, 100);


--
-- TOC entry 3431 (class 0 OID 41541)
-- Dependencies: 217
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.pedido VALUES (3, '2024-02-03', '55555555555', '66666666666');
INSERT INTO public.pedido VALUES (7, '2024-02-07', '44444444444', '33333333333');
INSERT INTO public.pedido VALUES (8, '2024-02-08', '66666666666', '55555555555');
INSERT INTO public.pedido VALUES (9, '2024-02-09', '88888888888', '77777777777');
INSERT INTO public.pedido VALUES (10, '2024-02-10', '10101010101', '99999999999');
INSERT INTO public.pedido VALUES (20, '2025-10-10', '33333333333', '22222222222');
INSERT INTO public.pedido VALUES (4, '2024-02-04', '99999999999', '88888888888');
INSERT INTO public.pedido VALUES (5, '2024-02-05', '33333333333', '10101010101');
INSERT INTO public.pedido VALUES (1, '2024-02-01', '44444444444', '22222222222');
INSERT INTO public.pedido VALUES (2, '2024-02-02', '11111111111', '44444444444');
INSERT INTO public.pedido VALUES (11, '2025-11-12', '11111111111', '00000000000');
INSERT INTO public.pedido VALUES (12, '2025-11-12', '1', '00000000000');
INSERT INTO public.pedido VALUES (13, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (14, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (15, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (16, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (17, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (18, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (19, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (21, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (22, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (23, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (24, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (25, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (26, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (27, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (28, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (29, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (30, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (31, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (32, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (33, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (34, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (35, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (36, '2025-11-13', '1', '00000000000');
INSERT INTO public.pedido VALUES (37, '2025-11-14', '1', '00000000000');
INSERT INTO public.pedido VALUES (38, '2025-11-14', '1', '00000000000');
INSERT INTO public.pedido VALUES (39, '2025-11-14', '1', '00000000000');
INSERT INTO public.pedido VALUES (40, '2025-11-14', '1', '00000000000');
INSERT INTO public.pedido VALUES (41, '2025-11-14', '1', '00000000000');
INSERT INTO public.pedido VALUES (42, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (43, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (44, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (45, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (46, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (47, '2025-11-15', '1', '00000000000');
INSERT INTO public.pedido VALUES (48, '2025-11-16', '1', '00000000000');
INSERT INTO public.pedido VALUES (49, '2025-11-16', '1', '00000000000');
INSERT INTO public.pedido VALUES (50, '2025-11-16', '1', '00000000000');
INSERT INTO public.pedido VALUES (51, '2025-11-16', '1', '00000000000');
INSERT INTO public.pedido VALUES (52, '2025-11-16', '1', '00000000000');
INSERT INTO public.pedido VALUES (53, '2025-11-18', '1', '00000000000');
INSERT INTO public.pedido VALUES (54, '2025-11-18', '1', '00000000000');
INSERT INTO public.pedido VALUES (55, '2025-11-18', '1', '00000000000');


--
-- TOC entry 3435 (class 0 OID 41574)
-- Dependencies: 221
-- Data for Name: pedido_has_produto; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.pedido_has_produto VALUES (1, 1, 2, 5.5);
INSERT INTO public.pedido_has_produto VALUES (2, 2, 10, 0.5);
INSERT INTO public.pedido_has_produto VALUES (3, 2, 5, 1);
INSERT INTO public.pedido_has_produto VALUES (4, 2, 3, 3.2);
INSERT INTO public.pedido_has_produto VALUES (5, 5, 2, 7);
INSERT INTO public.pedido_has_produto VALUES (3, 1, 3, 1);
INSERT INTO public.pedido_has_produto VALUES (2, 3, 1, 0.5);
INSERT INTO public.pedido_has_produto VALUES (4, 4, 4, 4);
INSERT INTO public.pedido_has_produto VALUES (2, 1, 1000, 0.7);
INSERT INTO public.pedido_has_produto VALUES (2, 20, 1, 0.5);
INSERT INTO public.pedido_has_produto VALUES (1, 36, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (3, 36, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (8, 37, 200, 60);
INSERT INTO public.pedido_has_produto VALUES (10, 37, 100, 12);
INSERT INTO public.pedido_has_produto VALUES (2, 38, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (7, 38, 100, 75);
INSERT INTO public.pedido_has_produto VALUES (6, 38, 100, 45);
INSERT INTO public.pedido_has_produto VALUES (4, 39, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (5, 39, 100, 70);
INSERT INTO public.pedido_has_produto VALUES (6, 39, 100, 45);
INSERT INTO public.pedido_has_produto VALUES (1, 40, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 40, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 40, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 40, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (5, 40, 100, 70);
INSERT INTO public.pedido_has_produto VALUES (1, 41, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (3, 41, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 41, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (10, 42, 100, 12);
INSERT INTO public.pedido_has_produto VALUES (2, 42, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 42, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (1, 43, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 43, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 43, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (2, 44, 1, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 44, 1, 10);
INSERT INTO public.pedido_has_produto VALUES (3, 45, 1, 10);
INSERT INTO public.pedido_has_produto VALUES (2, 45, 4, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 47, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (2, 47, 1000, 43);
INSERT INTO public.pedido_has_produto VALUES (1, 48, 300, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 48, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (2, 49, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 49, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 49, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (2, 50, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 50, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 50, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (2, 51, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 51, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 51, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (2, 52, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (3, 52, 100, 10);
INSERT INTO public.pedido_has_produto VALUES (4, 52, 100, 32);
INSERT INTO public.pedido_has_produto VALUES (1, 53, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 53, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (1, 54, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 54, 100, 43);
INSERT INTO public.pedido_has_produto VALUES (1, 55, 100, 55);
INSERT INTO public.pedido_has_produto VALUES (2, 55, 100, 43);


--
-- TOC entry 3423 (class 0 OID 41496)
-- Dependencies: 209
-- Data for Name: pessoa; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.pessoa VALUES ('10101010101', 'Juliana Dias ssss', '1989-10-25', 'lins, 352 ssss', '1111', 'juliana@email.comm');
INSERT INTO public.pessoa VALUES ('33333333333', 'Carlos Pereira', '1992-03-20', 'Rua que Judas perdeu as botas, 234', '.123456', 'carlos@email.com');
INSERT INTO public.pessoa VALUES ('44444444444', 'Ana Lima', '1995-04-25', 'Alameda do medo, 4534 apto 13', '.123456', 'ana@email.com');
INSERT INTO public.pessoa VALUES ('55555555555', 'Lucas Mendes', '1988-05-30', 'Rua sexta_feira, 13 _ apto 666', '.123456', 'lucas@email.com');
INSERT INTO public.pessoa VALUES ('66666666666', 'Fernanda Costa', '1993-06-05', 'muito longe, 243', '.123456', 'fernanda@email.com');
INSERT INTO public.pessoa VALUES ('77777777777', 'Ricardo Alves', '1987-07-10', 'far far faraway, 34', '.123456', 'ricardo@email.com');
INSERT INTO public.pessoa VALUES ('88888888888', 'Patrícia Gomes', '1994-08-15', 'acolá, 54', '.123456', 'patricia@email.com');
INSERT INTO public.pessoa VALUES ('99999999999', 'Marcos Rocha', '1991-09-20', 'kaxa prego _ ilha de itaparica', '.123456', 'marcos@email.com');
INSERT INTO public.pessoa VALUES ('22222222222', 'Maria Souza', '1985-02-15', 'lá longe, 1234', '.123456', 'maria@email.com');
INSERT INTO public.pessoa VALUES ('1', 'Berola', '2025-10-16', 'Lá onde Judas perdeu a unha, s/n', '12345', 'berola@gmail.com');
INSERT INTO public.pessoa VALUES ('2', 'dois', '2025-10-07', 'Rua das Magnólias', '123', 'dois@email.com');
INSERT INTO public.pessoa VALUES ('00000000000', 'online', '1900-01-01', 'Loja', 'abc123', 'online@gmail.com');
INSERT INTO public.pessoa VALUES ('11111111111', 'João Silva', '2025-01-01', 'algum lugar', '.123456', 'joao@email.com');


--
-- TOC entry 3429 (class 0 OID 41534)
-- Dependencies: 215
-- Data for Name: produto; Type: TABLE DATA; Schema: public; Owner: radames
--

INSERT INTO public.produto VALUES (8, 'Pão de Mel', 40, 60);
INSERT INTO public.produto VALUES (9, 'Doce de Leite', 30, 85);
INSERT INTO public.produto VALUES (4, 'Biscoito', 80, 32);
INSERT INTO public.produto VALUES (1, 'Chocolate', 100, 55);
INSERT INTO public.produto VALUES (3, 'Pirulito', 150, 10);
INSERT INTO public.produto VALUES (5, 'Refrigerante', 50, 70);
INSERT INTO public.produto VALUES (50, 'ddddd', NULL, 20);
INSERT INTO public.produto VALUES (7, 'Chiclete', 300, 75);
INSERT INTO public.produto VALUES (10, 'Sorvete', 20, 12);
INSERT INTO public.produto VALUES (2, 'Bala', 200, 43);
INSERT INTO public.produto VALUES (6, 'Suco', 60, 45);


--
-- TOC entry 3446 (class 0 OID 0)
-- Dependencies: 210
-- Name: cargo_id_cargo_seq; Type: SEQUENCE SET; Schema: public; Owner: radames
--

SELECT pg_catalog.setval('public.cargo_id_cargo_seq', 10, true);


--
-- TOC entry 3447 (class 0 OID 0)
-- Dependencies: 219
-- Name: forma_pagamento_id_forma_pagamento_seq; Type: SEQUENCE SET; Schema: public; Owner: radames
--

SELECT pg_catalog.setval('public.forma_pagamento_id_forma_pagamento_seq', 10, true);


--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 216
-- Name: pedido_id_pedido_seq; Type: SEQUENCE SET; Schema: public; Owner: radames
--

SELECT pg_catalog.setval('public.pedido_id_pedido_seq', 55, true);


--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 214
-- Name: produto_id_produto_seq; Type: SEQUENCE SET; Schema: public; Owner: radames
--

SELECT pg_catalog.setval('public.produto_id_produto_seq', 10, true);


--
-- TOC entry 3257 (class 2606 OID 41507)
-- Name: cargo cargo_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_pkey PRIMARY KEY (id_cargo);


--
-- TOC entry 3261 (class 2606 OID 41527)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (pessoa_cpf_pessoa);


--
-- TOC entry 3269 (class 2606 OID 41573)
-- Name: forma_pagamento forma_pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.forma_pagamento
    ADD CONSTRAINT forma_pagamento_pkey PRIMARY KEY (id_forma_pagamento);


--
-- TOC entry 3259 (class 2606 OID 41512)
-- Name: funcionario funcionario_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_pkey PRIMARY KEY (pessoa_cpf_pessoa);


--
-- TOC entry 3273 (class 2606 OID 41593)
-- Name: pagamento_has_forma_pagamento pagamento_has_forma_pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pagamento_has_forma_pagamento
    ADD CONSTRAINT pagamento_has_forma_pagamento_pkey PRIMARY KEY (pagamento_id_pedido, forma_pagamento_id_forma_pagamento);


--
-- TOC entry 3267 (class 2606 OID 41561)
-- Name: pagamento pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pagamento
    ADD CONSTRAINT pagamento_pkey PRIMARY KEY (pedido_id_pedido);


--
-- TOC entry 3271 (class 2606 OID 41578)
-- Name: pedido_has_produto pedido_has_produto_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pedido_has_produto
    ADD CONSTRAINT pedido_has_produto_pkey PRIMARY KEY (produto_id_produto, pedido_id_pedido);


--
-- TOC entry 3265 (class 2606 OID 41546)
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id_pedido);


--
-- TOC entry 3253 (class 2606 OID 41500)
-- Name: pessoa pessoa_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pessoa
    ADD CONSTRAINT pessoa_pkey PRIMARY KEY (cpf_pessoa);


--
-- TOC entry 3255 (class 2606 OID 42000)
-- Name: pessoa pessoa_unique; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pessoa
    ADD CONSTRAINT pessoa_unique UNIQUE (email_pessoa);


--
-- TOC entry 3263 (class 2606 OID 41539)
-- Name: produto produto_pkey; Type: CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT produto_pkey PRIMARY KEY (id_produto);


--
-- TOC entry 3276 (class 2606 OID 41528)
-- Name: cliente cliente_pessoa_cpf_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pessoa_cpf_pessoa_fkey FOREIGN KEY (pessoa_cpf_pessoa) REFERENCES public.pessoa(cpf_pessoa);


--
-- TOC entry 3275 (class 2606 OID 41518)
-- Name: funcionario funcionario_cargo_id_cargo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_cargo_id_cargo_fkey FOREIGN KEY (cargo_id_cargo) REFERENCES public.cargo(id_cargo);


--
-- TOC entry 3274 (class 2606 OID 41513)
-- Name: funcionario funcionario_pessoa_cpf_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_pessoa_cpf_pessoa_fkey FOREIGN KEY (pessoa_cpf_pessoa) REFERENCES public.pessoa(cpf_pessoa);


--
-- TOC entry 3283 (class 2606 OID 41599)
-- Name: pagamento_has_forma_pagamento pagamento_has_forma_pagamento_forma_pagamento_id_forma_pag_fkey; Type: FK CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pagamento_has_forma_pagamento
    ADD CONSTRAINT pagamento_has_forma_pagamento_forma_pagamento_id_forma_pag_fkey FOREIGN KEY (forma_pagamento_id_forma_pagamento) REFERENCES public.forma_pagamento(id_forma_pagamento);


--
-- TOC entry 3282 (class 2606 OID 41594)
-- Name: pagamento_has_forma_pagamento pagamento_has_forma_pagamento_pagamento_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pagamento_has_forma_pagamento
    ADD CONSTRAINT pagamento_has_forma_pagamento_pagamento_id_pedido_fkey FOREIGN KEY (pagamento_id_pedido) REFERENCES public.pagamento(pedido_id_pedido);


--
-- TOC entry 3279 (class 2606 OID 41562)
-- Name: pagamento pagamento_pedido_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pagamento
    ADD CONSTRAINT pagamento_pedido_id_pedido_fkey FOREIGN KEY (pedido_id_pedido) REFERENCES public.pedido(id_pedido);


--
-- TOC entry 3277 (class 2606 OID 41547)
-- Name: pedido pedido_cliente_pessoa_cpf_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_cliente_pessoa_cpf_pessoa_fkey FOREIGN KEY (cliente_pessoa_cpf_pessoa) REFERENCES public.cliente(pessoa_cpf_pessoa);


--
-- TOC entry 3278 (class 2606 OID 41552)
-- Name: pedido pedido_funcionario_pessoa_cpf_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_funcionario_pessoa_cpf_pessoa_fkey FOREIGN KEY (funcionario_pessoa_cpf_pessoa) REFERENCES public.funcionario(pessoa_cpf_pessoa);


--
-- TOC entry 3281 (class 2606 OID 41584)
-- Name: pedido_has_produto pedido_has_produto_pedido_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pedido_has_produto
    ADD CONSTRAINT pedido_has_produto_pedido_id_pedido_fkey FOREIGN KEY (pedido_id_pedido) REFERENCES public.pedido(id_pedido);


--
-- TOC entry 3280 (class 2606 OID 41579)
-- Name: pedido_has_produto pedido_has_produto_produto_id_produto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: radames
--

ALTER TABLE ONLY public.pedido_has_produto
    ADD CONSTRAINT pedido_has_produto_produto_id_produto_fkey FOREIGN KEY (produto_id_produto) REFERENCES public.produto(id_produto);


-- Completed on 2025-11-18 06:47:48 -03

--
-- PostgreSQL database dump complete
--




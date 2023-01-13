--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

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

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id integer DEFAULT nextval('public.events_id_seq'::regclass) NOT NULL,
    type character varying DEFAULT ''::character varying NOT NULL,
    "timestamp" bigint NOT NULL,
    signature character varying DEFAULT ''::character varying NOT NULL,
    payload jsonb
);


--
-- Name: quest_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quest; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quest (
    id integer DEFAULT nextval('public.quest_id_seq'::regclass) NOT NULL,
    title character varying DEFAULT ''::character varying NOT NULL,
    label character varying DEFAULT ''::character varying NOT NULL,
    disabled boolean DEFAULT false NOT NULL,
    description character varying DEFAULT ''::character varying NOT NULL,
    dependencies jsonb,
    "isDraft" boolean DEFAULT true NOT NULL,
    "addTs" bigint,
    "tokenId" character varying,
    type smallint DEFAULT 0,
    difficulty smallint,
    "estimateTime" smallint,
    creator character varying NOT NULL,
    metadata jsonb,
    extradata jsonb,
    uri character varying
);


--
-- Name: COLUMN quest.type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quest.type IS '0:问答;1:编程';


--
-- Name: COLUMN quest.difficulty; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quest.difficulty IS '0:easy;1:moderate;2:difficult';


--
-- Name: COLUMN quest."estimateTime"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quest."estimateTime" IS '预估时间/min';


--
-- Name: COLUMN quest.creator; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quest.creator IS 'user address';


--
-- Name: COLUMN quest.metadata; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quest.metadata IS '元数据';


--
-- Name: COLUMN quest.extradata; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quest.extradata IS '额外数据';


--
-- Name: transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transaction (
    id integer DEFAULT nextval('public.transaction_id_seq'::regclass) NOT NULL,
    hash character varying NOT NULL,
    add_time timestamp without time zone DEFAULT now() NOT NULL,
    remark character varying,
    status smallint DEFAULT '-1'::integer NOT NULL,
    receipt jsonb
);


--
-- Name: COLUMN transaction.hash; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.transaction.hash IS '交易哈希';


--
-- Name: user_challenges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_challenges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_challenges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_challenges (
    id integer DEFAULT nextval('public.user_challenges_id_seq'::regclass) NOT NULL,
    address character varying DEFAULT ''::character varying NOT NULL,
    "questId" integer NOT NULL,
    status smallint DEFAULT 0,
    content jsonb,
    add_ts bigint NOT NULL,
    claimed boolean DEFAULT false NOT NULL,
    update_ts bigint,
    claim_ts bigint
);


--
-- Name: COLUMN user_challenges.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_challenges.status IS '0:进行中;1:等待验证;2:成功;';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    address character varying DEFAULT ''::character varying NOT NULL,
    "creationTimestamp" bigint NOT NULL,
    socials jsonb
);


--
-- Name: COLUMN users.address; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.address IS '钱包地址';


--
-- Name: COLUMN users."creationTimestamp"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users."creationTimestamp" IS '创建时间';


--
-- Name: COLUMN users.socials; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.socials IS '社交账号';




--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.events_id_seq', 1, true);


--
-- Name: quest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quest_id_seq', 1, false);


--
-- Name: transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transaction_id_seq', 1, true);


--
-- Name: user_challenges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_challenges_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: quest quest_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quest
    ADD CONSTRAINT quest_pkey PRIMARY KEY (id);


--
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);


--
-- Name: user_challenges user_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_challenges
    ADD CONSTRAINT user_challenges_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: address; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX address ON public.users USING btree (address);


--
-- Name: quest_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quest_title ON public.quest USING btree (title);


--
-- Name: quest_tokenId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "quest_tokenId" ON public.quest USING btree ("tokenId");


--
-- Name: transaction_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX transaction_hash ON public.transaction USING btree (hash);


--
-- Name: user_challenges_address; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_challenges_address ON public.user_challenges USING btree (address);


--
-- Name: user_challenges_questId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "user_challenges_questId" ON public.user_challenges USING btree ("questId");


--
-- PostgreSQL database dump complete
--


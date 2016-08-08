-- Table: public.audit_rate

-- DROP TABLE public.audit_rate;

CREATE TABLE public.audit_rate
(
  id serial NOT NULL,
  name character varying(100) NOT NULL,
  chg_class character varying(100) NOT NULL,
  chg_description1 character varying(500) NOT NULL,
  chg_description2 character varying(500),
  fac_bw_kb integer NOT NULL,
  rate integer NOT NULL,
  CONSTRAINT audit_rate_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.audit_rate
  OWNER TO postgres;

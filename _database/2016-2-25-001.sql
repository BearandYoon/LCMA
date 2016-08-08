-- Table: public.audit

-- DROP TABLE public.audit;

CREATE TABLE public.audit
(
  id serial NOT NULL,
  vendor_id integer NOT NULL,
  account_id integer NOT NULL,
  charge_id integer NOT NULL,
  invoice_qty integer NOT NULL,
  invoice_type character varying(100) NOT NULL,
  invoice_charge character varying(50) NOT NULL,
  audit_run_month date,
  audit_name character varying(100) NOT NULL,
  total_charges character varying(100) NOT NULL,
  total_charges_qty integer NOT NULL,
  total_impact character varying(100) NOT NULL,
  total_impact_qty integer NOT NULL,
  total_calculated_impact character varying(100) NOT NULL,
  total_dispute_impact character varying(100) NOT NULL,
  CONSTRAINT audit_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.audit
  OWNER TO postgres;

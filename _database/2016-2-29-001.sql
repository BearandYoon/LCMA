-- Table: public.employee

-- DROP TABLE public.employee;

CREATE TABLE public.employee
(
  id serial NOT NULL,
  first_name character varying(50) NOT NULL,
  last_name character varying(50) NOT NULL,
  home_site character varying(100) NOT NULL,
  mobile_number integer NOT NULL,
  office_number integer,
  status integer NOT NULL,
  gl_code1 integer NOT NULL,
  gl_code2 integer,
  gl_code3 integer,
  gl_code4 integer,
  gl_code5 integer,
  gl_code6 integer,
  gl_code7 integer,
  gl_code8 integer,
  CONSTRAINT employee_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

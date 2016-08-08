-- Table: building

-- DROP TABLE building;

CREATE TABLE building
(
  id serial NOT NULL,
  common_name character varying(255),
  addr_1 character varying(255),
  addr_2 character varying(255),
  addr_3 character varying(255),
  addr_city character varying(255),
  addr_state character varying(255),
  addr_zip character varying(255),
  geocode integer,
  CONSTRAINT building_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


-- Table: public.contacts

-- DROP TABLE public.contacts;

CREATE TABLE public.contacts
(
  id serial NOT NULL,
  first_name character varying(100) NOT NULL,
  last_name character varying(100) NOT NULL,
  title character varying(500) NOT NULL,
  function character varying(500) NOT NULL,
  company character varying(100) NOT NULL,
  vendor_id integer,
  site_id integer,
  email character varying(50),
  office_phone character varying(100),
  mobile_number character varying(100),
  address1 character varying(500),
  address2 character varying(500),
  address3 character varying(500),
  city character varying(250),
  state character varying(5),
  zip character varying(10),
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

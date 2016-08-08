-- Table: Sites
ALTER TABLE site
ADD building_id integer

-- TABLE: Building
ALTER TABLE building
Change common_name name character varying(255);

-- Table: public.equipment

-- DROP TABLE public.equipment;

CREATE TABLE public.equipment
(
  id serial NOT NULL,
  site_id integer NOT NULL,
  site_name character varying(100) NOT NULL,
  site_type integer NOT NULL,
  equip_type character varying(100) NOT NULL,
  equip_maker character varying(50) NOT NULL,
  equip_model character varying(50) NOT NULL,
  equip_serial character varying(100),
  acq_date date,
  in_svc_date date,
  vendor_id integer,
  contract_id integer,
  building_name character varying(100) NOT NULL,
  building_address character varying(500) NOT NULL,
  floor integer,
  room character varying(50),
  building_city character varying(250),
  building_state character varying(5),
  building_zip character varying(10),
  CONSTRAINT equipment_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

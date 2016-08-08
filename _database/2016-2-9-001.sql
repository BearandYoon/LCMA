-- Table: content_filter

-- DROP TABLE content_filter;

CREATE TABLE content_filter
(
  id serial NOT NULL,
  title character varying(500),
  module_id character varying(500),
  value character varying(4001),
  property_name character varying(250) NOT NULL,
  operator character varying(50) NOT NULL,
  type character varying(50),
  CONSTRAINT content_filter_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


-- Table: permission

-- DROP TABLE permission;

CREATE TABLE permission
(
  id serial NOT NULL,
  module_id character varying(250),
  role_id integer,
  CONSTRAINT permission_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


-- Table: permission_action

-- DROP TABLE permission_action;

CREATE TABLE permission_action
(
  id serial NOT NULL,
  name character varying(150),
  permission_id integer,
  CONSTRAINT permission_action_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

-- Table: permission_filter

-- DROP TABLE permission_filter;

CREATE TABLE permission_filter
(
  id serial NOT NULL,
  permission_id integer, --
  filter_id integer,
  CONSTRAINT permission_filter_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

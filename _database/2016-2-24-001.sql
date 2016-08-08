-- Table: "order"

-- DROP TABLE "order";

CREATE TABLE "order"
(
  id serial NOT NULL,
  vendor_id integer,
  status_id integer,
  next_status_date date,
  initiate_date date,
  due_date date,
  CONSTRAINT order_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

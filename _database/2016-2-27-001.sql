-- Table: inventory

-- DROP TABLE inventory;



CREATE TABLE "public"."inventory" (
"id" int4 DEFAULT nextval('inventory_id_seq'::regclass) NOT NULL,
"type_id" int4,
"sp_ckt_id" varchar(255) COLLATE "default",
"internal_id" varchar(255) COLLATE "default",
"vendor_id" int4,
"client" varchar(255) COLLATE "default",
"cir_bw" varchar(255) COLLATE "default",
"bw_max" varchar(255) COLLATE "default",
"contract_id" int4,
"est_mrc" varchar(255) COLLATE "default",
"est_nrc" varchar(255) COLLATE "default",
"term" varchar(36) COLLATE "default",
"int_ckt_id" varchar(255) COLLATE "default",
"status_id" int4,
"topology_id" varchar(255) COLLATE "default",
"ckt_type_id" int4,
"technology_id" int4,
"bw_model_id" int4,
"ckt_usage_id" int4,
"protected_id" int4,
"prim_failover_id" int4,
"disc_date" timestamptz(6),
"exp_date" timestamptz(6),
"install_date" timestamptz(6),
"int_svc_id" varchar(255) COLLATE "default",
"sp_svc_id" varchar(255) COLLATE "default",
"second_sp_id" varchar(255) COLLATE "default",
"sp_btn" varchar(255) COLLATE "default",
"svc_type_id" int4,
"fac_bw" varchar(255) COLLATE "default",
"ip_shared_trk_id" int4,
"conc_calls" int4,
"fail_rel_svc" varchar(255) COLLATE "default",
"rel_svc" varchar(255) COLLATE "default",
"site_a_id" integer,
"site_z_id" integer
)
WITH (OIDS=FALSE)
;

ALTER TABLE inventory
  OWNER TO postgres;

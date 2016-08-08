/*
Navicat PGSQL Data Transfer

Source Server         : localhost
Source Server Version : 90311
Source Host           : localhost:5432
Source Database       : Client_QA
Source Schema         : public

Target Server Type    : PGSQL
Target Server Version : 90311
File Encoding         : 65001

Date: 2016-03-06 13:23:21
*/


-- ----------------------------
-- Table structure for inventory_sites
-- ----------------------------
DROP TABLE IF EXISTS "public"."inventory_sites";
CREATE TABLE "public"."inventory_sites" (
"id" serial NOT NULL,
"inventory_id" int4,
"site_id" int4
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Alter Sequences Owned By
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table inventory_sites
-- ----------------------------
ALTER TABLE "public"."inventory_sites" ADD PRIMARY KEY ("id");

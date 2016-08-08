-- Column: mobile_number

-- ALTER TABLE "user" DROP COLUMN mobile_number;

ALTER TABLE "user" ADD COLUMN mobile_number character varying(100);

-- Column: is_active

-- ALTER TABLE "user" DROP COLUMN is_active;

ALTER TABLE "user" ADD COLUMN is_active boolean;
ALTER TABLE "user" ALTER COLUMN is_active SET DEFAULT true;

-- Column: final_charge

-- ALTER TABLE inv_dispute_charge DROP COLUMN final_charge;

ALTER TABLE inv_dispute_charge ADD COLUMN final_charge numeric;


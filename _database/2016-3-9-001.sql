-- Column: created_by

-- ALTER TABLE public.history DROP COLUMN created_by;

ALTER TABLE public.history ADD COLUMN created_by integer;
ALTER TABLE public.history ALTER COLUMN created_by SET NOT NULL;

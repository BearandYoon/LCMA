-- Foreign Key: permission_action_permission

-- ALTER TABLE permission_action DROP CONSTRAINT permission_action_permission;

ALTER TABLE permission_action
  ADD CONSTRAINT permission_action_permission FOREIGN KEY (permission_id)
      REFERENCES permission (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Key: permission_filter_permission

-- ALTER TABLE permission_filter DROP CONSTRAINT permission_filter_permission;

ALTER TABLE permission_filter
  ADD CONSTRAINT permission_filter_permission FOREIGN KEY (permission_id)
      REFERENCES permission (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Key: permission_filter_filter

-- ALTER TABLE permission_filter DROP CONSTRAINT permission_filter_filter;

ALTER TABLE permission_filter
  ADD CONSTRAINT permission_filter_filter FOREIGN KEY (filter_id)
      REFERENCES content_filter (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Key: user_in_role_user

-- ALTER TABLE user_in_role DROP CONSTRAINT user_in_role_user;

ALTER TABLE user_in_role
  ADD CONSTRAINT user_in_role_user FOREIGN KEY (user_id)
      REFERENCES "user" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;



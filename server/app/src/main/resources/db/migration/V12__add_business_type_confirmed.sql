PRAGMA foreign_keys = ON;

ALTER TABLE config
  ADD COLUMN business_type_confirmed BOOLEAN NOT NULL DEFAULT 0;

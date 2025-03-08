-- Create a temporary table without the download_url column
CREATE TABLE versions_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version TEXT NOT NULL UNIQUE,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Copy data from the original table to the new table
INSERT INTO versions_new (id, version, detected_at)
SELECT id, version, detected_at FROM versions;

-- Drop the original table
DROP TABLE versions;

-- Rename the new table to the original name
ALTER TABLE versions_new RENAME TO versions; 
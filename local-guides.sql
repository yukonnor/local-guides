\echo 'Delete and recreate local_guides db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE local_guides;
CREATE DATABASE local_guides;
\connect local_guides

\i local-guides-schema.sql
\i local-guides-seed.sql

\echo 'Delete and recreate local_guides_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE local_guides_test;
CREATE DATABASE local_guides_test;
\connect local_guides_test

\i local-guides-schema.sql
\i local-guides-seed.sql

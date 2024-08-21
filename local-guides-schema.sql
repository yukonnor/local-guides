CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guides (
  id SERIAL PRIMARY KEY,
  author_id INTEGER NOT NULL
    REFERENCES users(id) ON DELETE CASCADE,
  google_place_id VARCHAR(50),
  title TEXT NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT FALSE,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE rec_types AS ENUM('dontmiss', 'recommend', 'iftime', 'avoid');

CREATE TABLE guide_places (
  id SERIAL PRIMARY KEY,
  guide_id INTEGER NOT NULL
    REFERENCES guides(id) ON DELETE CASCADE,
  google_place_id VARCHAR(50) NOT NULL,
  description TEXT,
  rec_type rec_types,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guide_shares (
  id SERIAL PRIMARY KEY,
  guide_id INTEGER NOT NULL
    REFERENCES guides(id) ON DELETE CASCADE,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (guide_id, email)
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(25) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE place_tag (
  place_id INTEGER NOT NULL
    REFERENCES guide_places(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL
    REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (place_id, tag_id)
);



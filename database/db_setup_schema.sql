
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users 
    (id INTEGER PRIMARY KEY, 
    username TEXT NOT NULL, 
    email TEXT NOT NULL);

DROP TABLE IF EXISTS bundles;
CREATE TABLE IF NOT EXISTS bundles 
    (id INTEGER PRIMARY KEY, 
    user_id INTEGER NOT NULL, 
    bundle_name TEXT NOT NULL, 
    bundle_desc TEXT NOT NULL, 
    category_id INTEGER, 
    state_id INTEGER NOT NULL, 
    bundle_size INTEGER NOT NULL, 
    creation_date INTEGER NOT NULL, 
    updated_date INTEGER, 
    image_id INTEGER);

DROP TABLE IF EXISTS categories;
CREATE TABLE IF NOT EXISTS categories 
    (id INTEGER PRIMARY KEY, 
    category_name TEXT NOT NULL);
DROP TABLE IF EXISTS states;
CREATE TABLE IF NOT EXISTS states 
    (id INTEGER PRIMARY KEY, 
    state_name TEXT NOT NULL);

DROP TABLE IF EXISTS items;
CREATE TABLE IF NOT EXISTS items 
    (id INTEGER PRIMARY KEY, 
    bundle_id TEXT NOT NULL, 
    item_name TEXT NOT NULL, 
    image_id INTEGER);
    
DROP TABLE IF EXISTS bookmarks;
CREATE TABLE IF NOT EXISTS bookmarks 
    (user_id INTEGER, 
    bundle_id INTEGER, 
    PRIMARY KEY (user_id, bundle_id));
DROP TABLE IF EXISTS bundle_tags;
CREATE TABLE IF NOT EXISTS bundle_tags 
    (bundle_id INTEGER, 
    tag_id INTEGER, 
    PRIMARY KEY (bundle_id, tag_id));
DROP TABLE IF EXISTS tags;
CREATE TABLE IF NOT EXISTS tags 
    (id INTEGER PRIMARY KEY, 
    tag_name TEXT NOT NULL);

DROP TABLE IF EXISTS messages;
CREATE TABLE IF NOT EXISTS messages 
    (id INTEGER PRIMARY KEY, 
    bundle_id INTEGER NOT NULL, 
    buyer_id INTEGER NOT NULL);

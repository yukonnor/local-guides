const db = require("../../src/lib/db"); // Adjust the path as needed

async function seedTestDatabase() {
    // SQL to clear existing data
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM guide_shares");
    await db.query("DELETE FROM guides");
    await db.query("DELETE FROM guide_places");
    await db.query("DELETE FROM place_tag");
    await db.query("DELETE FROM tags");

    // SQL to insert test data
    const users = await db.query(`
    INSERT INTO users (username, password, email, is_admin)
    VALUES ('testauthor', 'testpassword', 'testuser@example.com', FALSE),
           ('testadmin', 'testpassword', 'testadmin@example.com', TRUE),
           ('testviewer', 'testpassword', 'testviewer@example.com', FALSE)
    RETURNING id;`);

    const testAuthorId = users.rows[0].id;
    const testAdminId = users.rows[1].id;
    const testViewerId = users.rows[2].id;

    const guides = await db.query(
        `INSERT INTO guides (author_id, google_place_id, title, is_private, latitude, longitude, description)
         VALUES ($1, 'ChIJIQBpAG2ahYAR_6128GcTUEo', 'Test Guide: San Francisco', FALSE, 37.7749, -122.4194, 'A guide for San Francisco'),
                ($1, 'ChIJLe6wqnKcskwRKfpyM7W2nX4', 'Test Guide: Portland', FALSE, 43.6591, -70.2568, 'A guide for Portland'),
                ($1, 'ChIJIQBpAG2ahYAR_6128GcTUEo', 'Test Private Guide: San Francisco', TRUE, 37.7749, -122.4194, 'A private guide for San Francisco'),
                ($1, 'ChIJIQBpAG2ahYAR_6128GcTUEo', 'Test Private Shared Guide: San Francisco', TRUE, 37.7749, -122.4194, 'A shared guide for San Francisco')
         RETURNING id`,
        [testAuthorId]
    );

    const publicGuideId = guides.rows[0].id;
    const sharedGuideId = guides.rows[3].id;

    const guidePlaces = await db.query(
        `INSERT INTO guide_places (guide_id, google_place_id, description, rec_type)
         VALUES ($1,'ChIJxeyK9Z3wloAR_gOA7SycJC0','You should check this place out!','dontmiss'),
                ($1,'ChIJU889QiB-j4ARzQofqaFrMJU','You should check this place out!','recommend')
         RETURNING id`,
        [publicGuideId]
    );

    const guidePlaceId = guidePlaces.rows[0].id;

    const tags = await db.query(
        `INSERT INTO tags (name)
         VALUES ('Nature'), ('Family'), ('Breakfast'), ('Brunch'), ('Lunch'), ('Dinner'), ('Adventure'), 
                ('Bar'), ('Drinks'), ('Art'), ('Shopping'), ('History'), ('Outdoors'), ('Relaxation'), ('Nightlife'), 
                ('Dancing'), ('Scenic'), ('Park'), ('Museum'), ('Culture'), ('Sports'), ('Film'), ('Beach'), ('Lake'), 
                ('Hiking'), ('Entertainment'), ('Kids'), ('Garden'), ('Music'), ('Events'), ('Photography'), ('Architecture'), 
                ('Tours'), ('Landmark'), ('Romantic'), ('Festivals'), ('Theater'), ('Wildlife'), ('Markets'), ('Fitness'), 
                ('Cafe'), ('Camping'), ('Sightseeing'), ('Odd'), ('Agriculture'), ('Comedy'), ('Biking'), ('Good View'), 
                ('Beer'), ('Wine'), ('Coffee/Tea')
         RETURNING id`
    );

    await db.query(
        `INSERT INTO place_tag (place_id, tag_id)
         VALUES ($1, $2),
                ($1, $3)`,
        [guidePlaceId, tags.rows[0].id, tags.rows[1].id]
    );

    await db.query(
        `INSERT INTO guide_shares (guide_id, email)
         VALUES ($1,'testadmin@example.com'),
                ($1,'testviewer@example.com')`,
        [sharedGuideId]
    );
}

async function commonBeforeAll() {
    // await seedTestDatabase(); // Opting to seed the db after tests instead
}

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    // Reset sequences for all relevant tables to start from 1
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE guides_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE guide_places_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE guide_shares_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE tags_id_seq RESTART WITH 1");

    await seedTestDatabase();

    await db.end();
}

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
};

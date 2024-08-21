-- both test users have the password "password"

INSERT INTO users (username, password, email, is_admin)
VALUES ('testuser',
        '$2b$13$zWm.mHd9IBxUK/OBGpCRAeIUfVKWvKtmvg1U93DMy20gnCnBeTZsi',
        'user@localguides.com',
        FALSE),
       ('testadmin',
        '$2b$13$vWONU1O3QzddsqGTOHUJWe3IB.tEQCzbAB.gO0mR3i1MAuK7hs9zm',
        'admin@localguides.com',
        TRUE),
        ('testviewer',
        '$2b$13$zWm.mHd9IBxUK/OBGpCRAeIUfVKWvKtmvg1U93DMy20gnCnBeTZsi',
        'viewer@localguides.com',
        FALSE);

INSERT INTO guides (author_id, google_place_id, title, is_private, latitude, longitude, description)
VALUES ('1',
        'ChIJIQBpAG2ahYAR_6128GcTUEo',
        'Test Guide: San Francisco California',
        FALSE,
        37.7749295,
        -122.4194155,
        'Here is my guide for San Francisco, California!'),
        ('1',
        'ChIJIQBpAG2ahYAR_6128GcTUEo',
        'Private Guide: San Francisco California',
        TRUE,
        37.7749295,
        -122.4194155,
        'Here is my private guide for San Francisco, California!'),
        ('1',
        'ChIJLe6wqnKcskwRKfpyM7W2nX4',
        'Test Guide: Portland Maine',
        FALSE,
        43.6590993,
        -70.2568189,
        'Here is my guide for Portland, Maine!')
       ;

INSERT INTO guide_places (guide_id, google_place_id, description, rec_type)
VALUES ('1',
        'ChIJxeyK9Z3wloAR_gOA7SycJC0',
        'You should check this place out!',
        'recommend'),
       ('1',
        'ChIJU889QiB-j4ARzQofqaFrMJU',
        'You should check this place out!',
        'dontmiss')
        ;

INSERT INTO tags (name)
VALUES 
('Nature'), 
('Family'), 
('Breakfast'), 
('Brunch'), 
('Lunch'), 
('Dinner'), 
('Adventure'), 
('Bar'), 
('Drinks'), 
('Art'), 
('Shopping'), 
('History'), 
('Outdoors'), 
('Relaxation'), 
('Nightlife'), 
('Dancing'), 
('Scenic'), 
('Park'), 
('Museum'), 
('Culture'), 
('Sports'), 
('Film'), 
('Beach'), 
('Lake'), 
('Hiking'), 
('Entertainment'), 
('Kids'), 
('Garden'), 
('Music'), 
('Events'), 
('Photography'), 
('Architecture'), 
('Tours'), 
('Landmark'), 
('Romantic'), 
('Festivals'), 
('Theater'), 
('Wildlife'), 
('Markets'), 
('Fitness'), 
('Cafe'), 
('Camping'), 
('Sightseeing'), 
('Odd'), 
('Agriculture'), 
('Comedy'), 
('Biking'), 
('Good View'), 
('Beer'), 
('Wine'), 
('Coffee/Tea')
;

INSERT INTO place_tag (place_id, tag_id)
VALUES (1, 1),
       (2, 2)
;

INSERT INTO guide_shares (guide_id, email)
VALUES (2, 'viewer@localguides.com')
;
const db = require("../lib/db");
const { sqlForPartialUpdate } = require("../utils/sql");
const { DatabaseError, NotFoundError, BadRequestError } = require("../utils/errors");

class Guide {
    static async getAll(limit, offset) {
        const query = `SELECT id,
                              author_id AS "authorId",
                              google_place_id AS "googlePlaceId",
                              title,
                              is_private AS "isPrivate",
                              latitude,
                              longitude,
                              description,
                              created_at AS "createdAt",
                              updated_at AS "updatedAt" 
                        FROM guides 
                        ORDER BY id ASC LIMIT $1 OFFSET $2`;

        try {
            const { rows } = await db.query(query, [limit, offset]);
            return rows;
        } catch (err) {
            console.error(`Database error in Guide.getAll: ${err.message}`);
            throw new Error(`Database error in Guide.getAll: ${err.message}`);
        }
    }

    static async getById(id) {
        const query = `SELECT   g.id,
                                g.author_id AS "authorId",
                                g.google_place_id AS "googlePlaceId",
                                g.title,
                                g.is_private AS "isPrivate",
                                g.latitude,
                                g.longitude,
                                g.description,
                                g.created_at AS "createdAt",
                                g.updated_at AS "updatedAt",
                                json_build_object('id', u.id, 'username', u.username) AS "author",
                                COALESCE(
                                    JSON_AGG(
                                        json_build_object('tagName', tg.name, 'count', tg.tag_count)
                                    ) FILTER (WHERE tg.name IS NOT NULL),
                                    '[]'
                                ) AS "placeTags"
                            FROM guides g
                            INNER JOIN users u ON g.author_id = u.id
                            LEFT JOIN (
                                SELECT 
                                    gp.guide_id, 
                                    t.name, 
                                    COUNT(*) AS tag_count
                                FROM guide_places gp
                                LEFT JOIN place_tag pt ON gp.id = pt.place_id
                                LEFT JOIN tags t ON pt.tag_id = t.id
                                GROUP BY gp.guide_id, t.name
                            ) tg ON g.id = tg.guide_id
                            WHERE g.id = $1
                            GROUP BY 
                                g.id, 
                                g.author_id, 
                                g.google_place_id, 
                                g.title, 
                                g.is_private, 
                                g.latitude, 
                                g.longitude, 
                                g.description, 
                                g.created_at, 
                                g.updated_at, 
                                u.id, 
                                u.username`;

        try {
            await this.checkIfGuideExists(id);

            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in Guide.getById: ${err.message}`);
                throw new DatabaseError(`Database error in Guide.getById: ${err.message}`);
            }
        }
    }

    static async getByAuthorId(userId) {
        const query = `SELECT id
                       FROM guides 
                       WHERE author_id = $1`;
        try {
            await this.checkIfUserExists(userId);

            const { rows } = await db.query(query, [userId]);
            return rows;
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in Guide.getByAuthorId: ${err.message}`);
                throw new DatabaseError(`Database error in Guide.getByAuthorId: ${err.message}`);
            }
        }
    }

    static async getNearbyByLatLong(lat, long, limit = 20, offset = 0) {
        // TODO: index lat long for better performance
        // Note: "nearby" is defined as 1 degree of latitude, or roughly a 'bounding box' of ~69 miles
        const query = `SELECT g.id,
                              2 * 3961 * asin(
                                sqrt(
                                    sin(radians(($1 - g.latitude) / 2))^2 +
                                    cos(radians($1)) * cos(radians(g.latitude)) *
                                    sin(radians(($2 - g.longitude) / 2))^2
                                )
                             ) AS "distanceInMiles"
                        FROM guides g
                        WHERE latitude BETWEEN ($1 - 1.0) AND ($1 + 1.0) 
                        AND   longitude BETWEEN ($2- 1.0 / cos(radians($1))) AND ($2 + 1.0 / cos(radians($1)))
                        ORDER BY 2 ASC LIMIT $3 OFFSET $4`;

        try {
            const { rows } = await db.query(query, [lat, long, limit, offset]);
            return rows;
        } catch (err) {
            console.error(`Database error in Guide.getNearbyByLatLong: ${err.message}`);
            throw new DatabaseError(`Database error in Guide.getNearbyByLatLong: ${err.message}`);
        }
    }

    static async getRandom() {
        // TODO: Replace with more performant method. This is O(n).
        const query = `SELECT g.id
                       FROM guides g
                       INNER JOIN guide_places gp ON g.id = gp.guide_id
                       WHERE g.is_private = FALSE
                       ORDER BY RANDOM()
                       LIMIT 1`;

        try {
            const { rows } = await db.query(query);
            return rows[0];
        } catch (err) {
            console.error(`Database error in Guide.getRandom: ${err.message}`);
            throw new DatabaseError(`Database error in Guide.getRandom: ${err.message}`);
        }
    }

    // TODO: handle optional google_place_id and description
    static async create({ authorId, googlePlaceId, title, isPrivate, latitude, longitude }) {
        const query = `INSERT INTO guides (author_id, google_place_id, title, is_private, latitude, longitude)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING id,
                                author_id AS "authorId",
                                google_place_id AS "googlePlaceId",
                                title,
                                is_private AS "isPrivate",
                                latitude,
                                longitude,
                                description,
                                created_at AS "createdAt",
                                updated_at AS "updatedAt"`;

        try {
            // fail if user doesn't exist
            await this.checkIfUserExists(authorId);

            const { rows } = await db.query(query, [
                authorId,
                googlePlaceId,
                title,
                isPrivate,
                latitude,
                longitude,
            ]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in Guide.create: ${err.message}`);
                throw new DatabaseError(`Database error in Guide.create: ${err.message}`);
            }
        }
    }

    /** Update guide data with `data`.
     *
     *  This is a "partial update". Data can include: {title, description, isPrivate}
     *  Returns full guide object or undefined if not found.
     */

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {
            title: "title",
            description: "description",
            isPrivate: "is_private",
        });
        const idIndex = "$" + (values.length + 1);

        const query = `UPDATE guides 
                      SET ${setCols}, updated_at = CURRENT_TIMESTAMP 
                      WHERE id = ${idIndex} 
                      RETURNING id,
                                author_id AS "authorId",
                                google_place_id AS "googlePlaceId",
                                title,
                                is_private AS "isPrivate",
                                latitude,
                                longitude,
                                description,
                                created_at AS "createdAt",
                                updated_at AS "updatedAt"`;

        try {
            // Perform checks before update
            await this.checkIfGuideExists(id);

            // Update guide
            const result = await db.query(query, [...values, id]);
            return result.rows[0];
        } catch (err) {
            if (err instanceof NotFoundError) {
                throw err; // Re-throw NotFoundError
            } else {
                console.error(`Database error in Guide.create: ${err.message}`);
                throw new DatabaseError(`Database error in GuidePlace.create: ${err.message}`);
            }
        }
    }

    /** Delete given guide from database;
     *
     *  Returns the ID of the deleted guide.
     **/

    static async delete(id) {
        const query = `DELETE
                        FROM guides
                        WHERE id = $1
                        RETURNING id`;

        try {
            // Perform checks before delete
            await this.checkIfGuideExists(id);

            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (err) {
            if (err instanceof NotFoundError) {
                throw err; // Re-throw NotFoundError
            } else {
                console.error(`Database error in Guide.create: ${err.message}`);
                throw new DatabaseError(`Database error in GuidePlace.create: ${err.message}`);
            }
        }
    }

    static async checkIfGuideExists(guideId) {
        try {
            const guideResult = await db.query("SELECT id FROM guides WHERE id = $1", [guideId]);

            if (guideResult.rows.length === 0) {
                throw new NotFoundError(`Guide ${guideId} doesn't exist.`);
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in Guide.checkIfGuideExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in Guide.checkIfGuideExists: ${err.message}`);
                throw new DatabaseError(`Database error in checkIfGuideExists: ${err.message}`);
            }
        }
    }

    static async checkIfUserExists(userId) {
        try {
            const userResult = await db.query("SELECT id FROM users WHERE id = $1", [userId]);

            if (userResult.rows.length === 0) {
                throw new NotFoundError(`User ${userId} doesn't exist.`);
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in Guide.checkIfUserExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in Guide.checkIfUserExists: ${err.message}`);
                throw new DatabaseError(
                    `Database error in Guide.checkIfUserExists: ${err.message}`
                );
            }
        }
    }
}

module.exports = Guide;

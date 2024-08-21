const db = require("../lib/db");
const { sqlForPartialUpdate } = require("../utils/sql");
const { NotFoundError, BadRequestError, DatabaseError } = require("../utils/errors");

class GuidePlace {
    static async getAll(limit = 20, offset = 0) {
        // Note: adds 'tags' to results which is an array of {id, name} tag objects
        const query = `SELECT gp.id, 
                              gp.guide_id AS "guideId",
                              gp.google_place_id AS "googlePlaceId",
                              gp.description,
                              gp.rec_type AS "recType",
                              COALESCE(
                                    JSON_AGG(
                                        JSON_BUILD_OBJECT('id', t.id, 'name', t.name)
                                    ) FILTER (WHERE t.id IS NOT NULL),
                                    '[]'
                                ) AS tags,
                              gp.created_at AS "createdAt",
                              gp.updated_at AS "updatedAt"
                       FROM guide_places gp
                       LEFT JOIN place_tag pt ON gp.id = pt.place_id
                       LEFT JOIN tags t ON pt.tag_id = t.id
                       GROUP BY gp.id
                       ORDER BY gp.id ASC LIMIT $1 OFFSET $2`;

        try {
            const { rows } = await db.query(query, [limit, offset]);
            return rows;
        } catch (err) {
            console.error(`Database error in GuidePlace.getAll: ${err.message}`);
            throw new DatabaseError(`Database error in GuidePlace.getAll: ${err.message}`);
        }
    }

    static async getById(id) {
        // Note: adds 'tags' to results which is an array of {id, name} tag objects
        const query = `SELECT gp.id, 
                              gp.guide_id AS "guideId",
                              gp.google_place_id AS "googlePlaceId",
                              gp.description,
                              gp.rec_type AS "recType",
                              COALESCE(
                                    JSON_AGG(
                                        JSON_BUILD_OBJECT('id', t.id, 'name', t.name)
                                    ) FILTER (WHERE t.id IS NOT NULL),
                                    '[]'
                                ) AS tags,
                              gp.created_at AS "createdAt",
                              gp.updated_at AS "updatedAt" 
                        FROM guide_places gp
                        LEFT JOIN place_tag pt ON gp.id = pt.place_id
                        LEFT JOIN tags t ON pt.tag_id = t.id
                        WHERE gp.id = $1
                        GROUP BY gp.id`;

        try {
            // Perform checks before update
            await this.checkIfGuidePlaceExists(id);

            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError) {
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in GuidePlace.getByGuideId: ${err.message}`);
                throw new DatabaseError(
                    `Database error in GuidePlace.getByGuideId: ${err.message}`
                );
            }
        }
    }

    static async getByGuideId(guideId) {
        const query = `SELECT gp.id
                        FROM guide_places gp
                        WHERE guide_id = $1
                        GROUP BY gp.id`;
        try {
            // Perform checks before query
            await this.checkIfGuideExists(guideId);

            const { rows } = await db.query(query, [guideId]);
            return rows;
        } catch (err) {
            if (err instanceof NotFoundError) {
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in GuidePlace.getByGuideId: ${err.message}`);
                throw new DatabaseError(
                    `Database error in GuidePlace.getByGuideId: ${err.message}`
                );
            }
        }
    }

    static async getByGooglePlaceId(guideId, googlePlaceId) {
        // Note: Currently only used to check if a place is already on a guide when adding a new place
        const query = `SELECT id
                        FROM guide_places 
                        WHERE guide_id = $1 
                        AND   google_place_id = $2
                        GROUP BY id`;

        try {
            // Perform checks before query
            await this.checkIfGuideExists(guideId);

            const { rows } = await db.query(query, [guideId, googlePlaceId]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError) {
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in GuidePlace.getByGooglePlaceId: ${err.message}`);
                throw new DatabaseError(
                    `Database error in GuidePlace.getByGooglePlaceId: ${err.message}`
                );
            }
        }
    }

    static async create(guideId, { googlePlaceId, description, recType }) {
        const query = `INSERT INTO guide_places (guide_id, google_place_id, description, rec_type)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id, 
                                guide_id AS "guideId",
                                google_place_id AS "googlePlaceId",
                                description,
                                rec_type AS "recType",
                                created_at AS "createdAt",
                                updated_at AS "updatedAt" `;

        try {
            // Perform checks before insert
            await this.checkIfGuideExists(guideId);
            await this.checkIfDuplicateGooglePlace(guideId, googlePlaceId);

            // Insert guide place
            const { rows } = await db.query(query, [guideId, googlePlaceId, description, recType]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw NotFoundError with additional context if necessary
            } else {
                console.error(`Database error in GuidePlace.create: ${err.message}`);
                throw new DatabaseError(`Database error in GuidePlace.create: ${err.message}`);
            }
        }
    }

    /** Update guide_place data with {data}.
     *
     *  This is a "partial update". Data can include: {description, recType}
     *  Returns full guide object or undefined if not found.
     */

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {
            description: "description",
            recType: "rec_type",
        });
        const idIndex = "$" + (values.length + 1);

        const query = `UPDATE guide_places 
                      SET ${setCols}, updated_at = CURRENT_TIMESTAMP 
                      WHERE id = ${idIndex} 
                      RETURNING id, 
                                guide_id AS "guideId",
                                google_place_id AS "googlePlaceId",
                                description,
                                rec_type AS "recType",
                                created_at AS "createdAt",
                                updated_at AS "updatedAt" `;

        try {
            // Perform checks before update
            await this.checkIfGuidePlaceExists(id);

            // Update guide place
            const { rows } = await db.query(query, [...values, id]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError) {
                throw err; // Re-throw NotFoundError
            } else {
                console.error(`Database error in GuidePlace.update: ${err.message}`);
                throw new DatabaseError(`Database error in GuidePlace.update: ${err.message}`);
            }
        }
    }

    /** Delete given guide_place from database;
     *
     *  Returns the ID of the deleted guide_place or undefined if not found.
     */

    static async delete(id) {
        const query = `DELETE
                        FROM guide_places
                        WHERE id = $1
                        RETURNING id, guide_id as "guideId"`;

        try {
            // Perform checks before delete
            await this.checkIfGuidePlaceExists(id);

            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (err) {
            if (err instanceof NotFoundError) {
                throw err; // Re-throw NotFoundError
            } else {
                console.error(`Database error in GuidePlace.delete: ${err.message}`);
                throw new DatabaseError(`Database error in GuidePlace.delete: ${err.message}`);
            }
        }
    }

    static async checkIfGuideExists(guideId) {
        try {
            const guideResults = await db.query(`SELECT id FROM guides WHERE id = $1`, [guideId]);

            if (guideResults.rows.length === 0) {
                throw new NotFoundError(
                    `Can't create/edit/fetch guide place. Guide ${guideId} doesn't exist.`
                );
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in GuidePlace.checkIfGuideExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in GuidePlace.checkIfGuideExists: ${err.message}`);
                throw new DatabaseError(
                    `Database error in GuidePlace.checkIfGuideExists: ${err.message}`
                );
            }
        }
    }

    static async checkIfGuidePlaceExists(guidePlaceId) {
        try {
            const existingGuidePlace = await db.query(`SELECT id FROM guide_places WHERE id = $1`, [
                guidePlaceId,
            ]);

            if (existingGuidePlace.rows.length === 0) {
                throw new NotFoundError(`Guide Place ${guidePlaceId} doesn't exist.`);
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(
                    `NotFound error in GuidePlace.checkIfGuidePlaceExists: ${err.message}`
                );
                throw err; // Re-throw custom error
            } else {
                throw new DatabaseError(
                    `Database error in GuidePlace.checkIfGuideExists: ${err.message}`
                );
            }
        }
    }

    static async checkIfDuplicateGooglePlace(guideId, googlePlaceId) {
        try {
            const existingGuidePlace = await this.getByGooglePlaceId(guideId, googlePlaceId);
            if (existingGuidePlace)
                throw new BadRequestError("Place is already associted with guide.");
        } catch (err) {
            if (err instanceof BadRequestError) {
                console.error(
                    `BadRequest error in GuidePlace.checkIfDuplicateGooglePlace: ${err.message}`
                );
                throw err; // Re-throw custom error
            } else {
                console.error(
                    `Database error in GuidePlace.checkIfDuplicateGooglePlace: ${err.message}`
                );
                throw new DatabaseError(
                    `Database error in Guide.PlacecheckIfDuplicateGooglePlace: ${err.message}`
                );
            }
        }
    }
}

module.exports = GuidePlace;

const db = require("../lib/db");
const { NotFoundError, BadRequestError, DatabaseError } = require("../utils/errors");

class PlaceTag {
    static async getAll(limit = 20, offset = 0) {
        const query = `SELECT place_id as "placeId", 
                              tag_id as "tagId",
                              created_at as "createdAt"
                       FROM place_tag 
                       ORDER BY place_id ASC LIMIT $1 OFFSET $2`;

        try {
            const { rows } = await db.query(query, [limit, offset]);
            return rows;
        } catch (err) {
            console.error(`Database error in PlaceTag.getAll: ${err.message}`);
            throw new DatabaseError(`Database error in PlaceTag.getAll: ${err.message}`);
        }
    }

    static async getTagsByPlaceId(placeId) {
        const query = `SELECT t.id, t.name 
                       FROM place_tag pt
                       INNER JOIN tags t ON pt.tag_id = t.id
                       WHERE pt.place_id = $1`;

        try {
            await this.checkIfPlaceExists(placeId);

            const { rows } = await db.query(query, [placeId]);
            return rows;
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in PlaceTag.getTagsByPlaceId: ${err.message}`);
                throw new DatabaseError(
                    `Database error in PlaceTag.getTagsByPlaceId: ${err.message}`
                );
            }
        }
    }

    static async getTagsByGuideId(guideId) {
        const query = `SELECT      t.id, t.name, COUNT(p.id) as "count"
                        FROM       guide_places p 
                        INNER JOIN place_tag pt ON p.id = pt.place_id
                        INNER JOIN tags t ON pt.tag_id = t.id
                        WHERE      p.guide_id = $1
                        GROUP BY   1, 2`;

        try {
            await this.checkIfGuideExists(guideId);

            const { rows } = await db.query(query, [guideId]);

            // Convert the count to an integer
            const result = rows.map((row) => ({
                ...row,
                count: parseInt(row.count, 10),
            }));

            return result;
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in PlaceTag.getTagsByGuideId: ${err.message}`);
                throw new DatabaseError(
                    `Database error in PlaceTag.getTagsByGuideId: ${err.message}`
                );
            }
        }
    }

    static async getPlacesByTagId(tagId) {
        const query = `SELECT p.id as "placeId"
                       FROM place_tag pt
                       INNER JOIN guide_places p ON pt.place_id = p.id
                       WHERE pt.tag_id = $1`;
        try {
            await this.checkIfTagExists(tagId);

            const { rows } = await db.query(query, [tagId]);
            return rows;
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in PlaceTag.getPlacesByTagId: ${err.message}`);
                throw new DatabaseError(
                    `Database error in PlaceTag.getPlacesByTagId: ${err.message}`
                );
            }
        }
    }

    static async create(placeId, tagId) {
        // Note: this query also returns the tag name from the tags table
        const query = ` WITH inserted AS (
                        INSERT INTO place_tag (place_id, tag_id)
                        VALUES ($1, $2)
                        RETURNING place_id as "placeId", 
                                tag_id as "tagId",
                                created_at as "createdAt"
                            )
                        SELECT 
                            i."placeId", 
                            i."tagId", 
                            i."createdAt", 
                            t.name 
                        FROM inserted i
                        JOIN tags t ON i."tagId" = t.id;`;

        try {
            // Perform checks before insertion
            await this.checkIfPlaceExists(placeId);
            await this.checkIfTagExists(tagId);
            await this.checkIfDuplicatePlaceTag(placeId, tagId);

            // Insert place tag
            const { rows } = await db.query(query, [placeId, tagId]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in PlaceTag.create: ${err.message}`);
                throw new DatabaseError(`Database error in PlaceTag.create: ${err.message}`);
            }
        }
    }

    static async delete(placeId, tagId) {
        const query = `DELETE
                        FROM  place_tag
                        WHERE place_id = $1
                        AND   tag_id = $2
                        RETURNING place_id AS "placeId", 
                                  tag_id AS "tagId"`;

        try {
            await this.checkIfPlaceTagExists(placeId, tagId);

            const result = await db.query(query, [placeId, tagId]);
            return result.rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in PlaceTag.delete: ${err.message}`);
                throw new DatabaseError(`Database error in PlaceTag.delete: ${err.message}`);
            }
        }
    }

    static async deleteAll(placeId) {
        const query = `DELETE
             FROM place_tag
             WHERE place_id = $1
             RETURNING place_id AS "placeId", 
                       tag_id AS "tagId"`;

        try {
            await this.checkIfPlaceExists(placeId);

            const result = await db.query(query, [placeId]);
            return result.rows;
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in PlaceTag.deleteAll: ${err.message}`);
                throw new DatabaseError(`Database error in PlaceTag.deleteAll: ${err.message}`);
            }
        }
    }

    static async checkIfPlaceExists(placeId) {
        try {
            const placeResult = await db.query("SELECT id FROM guide_places WHERE id = $1", [
                placeId,
            ]);

            if (placeResult.rows.length === 0) {
                throw new NotFoundError(`Can't assign place tag. Place ${placeId} doesn't exist.`);
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in PlaceTag.checkIfPlaceExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in PlaceTag.checkIfPlaceExists: ${err.message}`);
                throw new DatabaseError(
                    `Database error in PlaceTag.checkIfPlaceExists: ${err.message}`
                );
            }
        }
    }

    static async checkIfPlaceTagExists(placeId, tagId) {
        try {
            const placeTagResult = await db.query(
                "SELECT place_id, tag_id FROM place_tag WHERE place_id = $1 AND tag_id = $2",
                [placeId, tagId]
            );

            if (placeTagResult.rows.length === 0) {
                throw new NotFoundError(
                    `Can't update/delete place tag. Tag ${tagId} not assigned to ${placeId}.`
                );
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in PlaceTag.checkIfPlaceTagExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in PlaceTag.checkIfPlaceTagExists: ${err.message}`);
                throw new DatabaseError(
                    `Database error in PlaceTag.checkIfPlaceTagExists: ${err.message}`
                );
            }
        }
    }

    static async checkIfGuideExists(guideId) {
        try {
            const guideResults = await db.query(`SELECT id FROM guides WHERE id = $1`, [guideId]);

            if (guideResults.rows.length === 0) {
                throw new NotFoundError(
                    `Can't create/edit/fetch place tags. Guide ${guideId} doesn't exist.`
                );
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in PlaceTag.checkIfGuideExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in PlaceTag.checkIfGuideExists: ${err.message}`);
                throw new DatabaseError(
                    `Database error in PlaceTag.checkIfGuideExists: ${err.message}`
                );
            }
        }
    }

    static async checkIfTagExists(tagId) {
        try {
            const tagResult = await db.query("SELECT id FROM tags WHERE id = $1", [tagId]);

            if (tagResult.rows.length === 0) {
                throw new NotFoundError(`Can't assign place tag. Tag ${tagId} doesn't exist.`);
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in PlaceTag.checkIfTagExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in PlaceTag.checkIfTagExists: ${err.message}`);
                throw new DatabaseError(
                    `Database error in PlaceTag.checkIfTagExists: ${err.message}`
                );
            }
        }
    }

    static async checkIfDuplicatePlaceTag(placeId, tagId) {
        try {
            const existingPlaceTag = await db.query(
                "SELECT * FROM place_tag WHERE place_id = $1 AND tag_id = $2",
                [placeId, tagId]
            );

            if (existingPlaceTag.rows.length) {
                throw new BadRequestError(
                    `Can't create place tag association. Place ${placeId} already has tag ${tagId}`
                );
            }
        } catch (err) {
            if (err instanceof BadRequestError) {
                console.error(
                    `BadRequest error in PlaceTag.checkIfDuplicatePlaceTag: ${err.message}`
                );
                throw err; // Re-throw custom error
            } else {
                console.error(
                    `Database error in PlaceTag.checkIfDuplicatePlaceTag: ${err.message}`
                );
                throw new DatabaseError(
                    `Database error in PlaceTag.checkIfDuplicatePlaceTag: ${err.message}`
                );
            }
        }
    }
}

module.exports = PlaceTag;

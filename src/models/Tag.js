const db = require("../lib/db");
const { BadRequestError, DatabaseError, NotFoundError } = require("../utils/errors");

class Tag {
    static async getAll() {
        // Note: This currently gets ALL tags to help with tag suggestions.
        // if modified to paginate, note that tag suggestions will need to be refactored.
        const query = `SELECT id,
                              name,
                              created_at AS "createdAt",
                              updated_at AS "updatedAt" 
                       FROM tags 
                       ORDER BY name ASC`;

        try {
            const { rows } = await db.query(query);
            return rows;
        } catch (err) {
            console.error(`Database error in Tag.getAll: ${err.message}`);
            throw new DatabaseError(`Database error in Tag.getAll: ${err.message}`);
        }
    }

    static async getById(id) {
        const query = `SELECT id,
                              name,
                              created_at AS "createdAt",
                              updated_at AS "updatedAt" 
                       FROM tags 
                       WHERE id = $1`;
        try {
            await this.checkIfTagExists(id);

            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in Tag.getById: ${err.message}`);
                throw new DatabaseError(`Database error in Tag.getById: ${err.message}`);
            }
        }
    }

    static async getByName(name) {
        const query = `SELECT id,
                              name,
                              created_at AS "createdAt",
                              updated_at AS "updatedAt" 
                       FROM tags 
                       WHERE name = $1`;
        try {
            // Note: we want to return an empty list if tagName doesn't exist
            const { rows } = await db.query(query, [name]);
            return rows[0];
        } catch (err) {
            console.error(`Database error in Tag.getByName: ${err.message}`);
            throw new DatabaseError(`Database error in Tag.getByName: ${err.message}`);
        }
    }

    static async create(tagName) {
        const query = `INSERT INTO tags (name)
                        VALUES ($1)
                        RETURNING id,
                                name,
                                created_at AS "createdAt",
                                updated_at AS "updatedAt"`;

        try {
            // Perfom checks before insertion
            await this.checkIfDuplicateTagName(tagName);

            // Insert tag
            const { rows } = await db.query(query, [tagName]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in Tag.create: ${err.message}`);
                throw new DatabaseError(`Database error in Tag.create: ${err.message}`);
            }
        }
    }

    /** Update tag data with `data`.
     *
     *  Data can include: {name}
     *  Returns full tag object or undefined if not found.
     */

    static async update(id, data) {
        const query = `UPDATE tags 
                      SET name = $1, updated_at = CURRENT_TIMESTAMP
                      WHERE id = $2
                      RETURNING id,
                                name,
                                created_at AS "createdAt",
                                updated_at AS "updatedAt"`;

        try {
            // Perfom checks before update
            await this.checkIfTagExists(id);
            await this.checkIfDuplicateTagName(data.name);

            // Update tag
            const result = await db.query(query, [data.name, id]);
            return result.rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in Tag.update: ${err.message}`);
                throw new DatabaseError(`Database error in Tag.update: ${err.message}`);
            }
        }
    }

    static async delete(id) {
        const query = `DELETE
                        FROM tags
                        WHERE id = $1
                        RETURNING id`;
        try {
            // Perfom checks before delete
            await this.checkIfTagExists(id);

            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in Tag.delete: ${err.message}`);
                throw new DatabaseError(`Database error in Tag.delete: ${err.message}`);
            }
        }
    }

    static async checkIfTagExists(tagId) {
        try {
            const tagResult = await db.query("SELECT id FROM tags WHERE id = $1", [tagId]);

            if (tagResult.rows.length === 0) {
                throw new NotFoundError(`Tag ${tagId} doesn't exist.`);
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in Tag.checkIfTagExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in Tag.checkIfTagExists: ${err.message}`);
                throw new DatabaseError(`Database error in Tag.checkIfTagExists: ${err.message}`);
            }
        }
    }

    static async checkIfTagNameExists(tagName) {
        try {
            const tagResult = await db.query("SELECT id FROM tags WHERE name = $1", [tagName]);

            if (tagResult.rows.length === 0) {
                throw new NotFoundError(`Tag ${tagName} doesn't exist.`);
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in Tag.checkIfTagNameExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in Tag.checkIfTagNameExists: ${err.message}`);
                throw new DatabaseError(
                    `Database error in Tag.checkIfTagNameExists: ${err.message}`
                );
            }
        }
    }

    static async checkIfDuplicateTagName(tagName) {
        try {
            const existingTag = await this.getByName(tagName);
            if (existingTag) {
                throw new BadRequestError(
                    `Can't create/update tag. Duplicate tag name: ${tagName}`
                );
            }
        } catch (err) {
            if (err instanceof BadRequestError) {
                console.error(`BadRequest error in Tag.checkIfTagExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in Tag.checkIfTagExists: ${err.message}`);
                throw new DatabaseError(`Database error in Tag.checkIfTagExists: ${err.message}`);
            }
        }
    }
}

module.exports = Tag;

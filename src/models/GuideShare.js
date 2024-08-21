const db = require("../lib/db");
const { NotFoundError, BadRequestError, DatabaseError } = require("../utils/errors");

class GuideShare {
    static async getAll(limit = 20, offset = 0) {
        const query = `SELECT id,
                              guide_id as "guideId",
                              email,
                              created_at as "createdAt"
                       FROM guide_shares 
                       ORDER BY id ASC LIMIT $1 OFFSET $2`;

        try {
            const { rows } = await db.query(query, [limit, offset]);
            return rows;
        } catch (err) {
            console.error(`Database error in GuideShare.getAll: ${err.message}`);
            throw new DatabaseError(`Database error in GuideShare.getAll: ${err.message}`);
        }
    }

    /**
     *  getSharesByGuideId returns users that a guide is shared with.
     */

    static async getSharesByGuideId(guideId) {
        const query = `SELECT gs.id, 
                              gs.email, 
                              u.id as "userId", 
                              u.username
                       FROM guide_shares gs
                       LEFT JOIN users u ON gs.email = u.email
                       WHERE guide_id = $1`;

        try {
            // perform checks
            await this.checkIfGuideExists(guideId);

            const { rows } = await db.query(query, [guideId]);
            return rows;
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in GuideShare.getSharesByGuideId: ${err.message}`);
                throw new DatabaseError(
                    `Database error in GuideShare.getSharesByGuideId: ${err.message}`
                );
            }
        }
    }

    /**
     *  getGuidesBySharedUserId returns guides that are shared with a given user.
     */

    static async getGuidesBySharedUserId(userId) {
        const query = `SELECT g.id
                       FROM guide_shares gs
                       INNER JOIN users u ON gs.email = u.email
                       INNER JOIN guides g ON gs.guide_id = g.id
                       WHERE u.id = $1`;

        try {
            // perform checks
            await this.checkIfUserExists(userId);

            const { rows } = await db.query(query, [userId]);
            return rows;
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(
                    `Database error in GuideShare.getGuidesBySharedUserId: ${err.message}`
                );
                throw new DatabaseError(
                    `Database error in GuideShare.getGuidesBySharedUserId: ${err.message}`
                );
            }
        }
    }

    static async create(guideId, email) {
        const query = `INSERT INTO guide_shares (guide_id, email)
                        VALUES ($1, $2)
                        RETURNING id,
                                guide_id as "guideId",
                                email,
                                created_at as "createdAt"`;

        try {
            // Perform checks before insertion
            await this.checkForDuplicateShare(guideId, email);
            await this.checkIfGuideExists(guideId);
            await this.checkIfSharingWithAuthor(guideId, email);
            // Note: guide is allowed be shared with an email that isn't associated with a user.

            // Insert guide share
            const { rows } = await db.query(query, [guideId, email]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in GuideShare.create: ${err.message}`);
                throw new DatabaseError(`Database error in GuideShare.create: ${err.message}`);
            }
        }
    }

    static async delete(id, guideId) {
        const query = `DELETE
                        FROM guide_shares
                        WHERE id = $1
                        AND   guide_id = $2
                        RETURNING id`;

        try {
            // perform checks
            await this.checkIfGuideShareExists(id, guideId);

            const result = await db.query(query, [id, guideId]);
            return result.rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in GuideShare.delete: ${err.message}`);
                throw new DatabaseError(`Database error in GuideShare.delete: ${err.message}`);
            }
        }
    }

    static async checkForDuplicateShare(guideId, email) {
        try {
            const existingGuideShare = await db.query(
                "SELECT * FROM guide_shares WHERE guide_id = $1 AND email = $2",
                [guideId, email]
            );

            if (existingGuideShare.rows.length) {
                throw new BadRequestError(
                    `Can't create guide share. Guide ${guideId} already shared with ${email}`
                );
            }
        } catch (err) {
            if (err instanceof BadRequestError) {
                console.error(
                    `BadRequest error in GuideShare.checkForDuplicateShare: ${err.message}`
                );
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in GuideShare.delete: ${err.message}`);
                throw new DatabaseError(
                    `Database error in GuideShare.checkForDuplicateShare: ${err.message}`
                );
            }
        }
    }

    static async checkIfGuideExists(guideId) {
        try {
            const guideResults = await db.query(`SELECT id FROM guides WHERE id = $1`, [guideId]);

            if (guideResults.rows.length === 0) {
                throw new NotFoundError(
                    `Can't create guide share. Guide ${guideId} doesn't exist.`
                );
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in GuideShare.checkIfGuideExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in GuideShare.checkIfGuideExists: ${err.message}`);
                throw new DatabaseError(`Database error in checkIfGuideExists: ${err.message}`);
            }
        }
    }

    static async checkIfGuideShareExists(id, guideId) {
        try {
            const guideShare = await db.query(
                `SELECT id FROM guide_shares
                 WHERE id = $1
                 AND   guide_id = $2`,
                [id, guideId]
            );

            if (guideShare.rows.length === 0) {
                throw new NotFoundError(
                    `Can't delete guide share. Share ${id} doesn't exist on Guide ${guideId}.`
                );
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(
                    `NotFound error in GuideShare.checkIfGuideShareExists: ${err.message}`
                );
                throw err; // Re-throw custom error
            } else {
                console.error(
                    `Database error in GuideShare.checkIfGuideShareExists: ${err.message}`
                );
                throw new DatabaseError(
                    `Database error in checkIfGuideShareExists: ${err.message}`
                );
            }
        }
    }

    static async checkIfUserExists(userId) {
        try {
            const userResults = await db.query(`SELECT id FROM users WHERE id = $1`, [userId]);

            if (userResults.rows.length === 0) {
                throw new NotFoundError(`Can't fetch guide shares. User ${userId} doesn't exist.`);
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in GuideShare.checkIfUserExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in GuideShare.checkIfUserExists: ${err.message}`);
                throw new DatabaseError(`Database error in checkIfUserExists: ${err.message}`);
            }
        }
    }

    static async checkIfSharingWithAuthor(guideId, email) {
        try {
            const sharedWithAuthor = await db.query(
                `SELECT u.email 
                 FROM guides g
                 INNER JOIN users u ON g.author_id = u.id
                 WHERE g.id = $1`,
                [guideId]
            );

            if (sharedWithAuthor.rows[0]?.email === email) {
                throw new BadRequestError(
                    `Can't create guide share. Can't share guide ${guideId} with email ${email} as email is associated with guide author.`
                );
            }
        } catch (err) {
            if (err instanceof BadRequestError) {
                console.error(
                    `BadRequest error in GuideShare.checkIfSharingWithAuthor: ${err.message}`
                );
                throw err; // Re-throw custom error
            } else {
                console.error(
                    `Database error in GuideShare.checkIfSharingWithAuthor: ${err.message}`
                );
                throw new DatabaseError(
                    `Database error in checkIfSharingWithAuthor: ${err.message}`
                );
            }
        }
    }
}

module.exports = GuideShare;

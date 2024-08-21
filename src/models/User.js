const db = require("../lib/db");
const { sqlForPartialUpdate } = require("../utils/sql");
const { NotFoundError, BadRequestError, DatabaseError } = require("../utils/errors");

class User {
    static async getAll(limit, offset) {
        const query = `SELECT id,
                              username,
                              email,
                              is_admin AS "isAdmin",
                              created_at AS "createdAt",
                              updated_at AS "updatedAt" 
                       FROM users 
                       ORDER BY id ASC LIMIT $1 OFFSET $2`;
        try {
            const { rows } = await db.query(query, [limit, offset]);
            return rows;
        } catch (err) {
            console.error(`Database error in User.getAll: ${err.message}`);
            throw new DatabaseError(`Database error in User.getAll: ${err.message}`);
        }
    }

    static async getById(id) {
        const query = `SELECT id,
                              username,
                              email,
                              is_admin AS "isAdmin",
                              created_at AS "createdAt",
                              updated_at AS "updatedAt"  
                       FROM users 
                       WHERE id = $1`;

        try {
            await this.checkIfUserExists(id);

            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in User.getById: ${err.message}`);
                throw new DatabaseError(`Database error in User.getById: ${err.message}`);
            }
        }
    }

    static async getByUsername(username) {
        const query = `SELECT id,
                              username,
                              password,
                              email,
                              is_admin AS "isAdmin",
                              created_at AS "createdAt",
                              updated_at AS "updatedAt"  
                        FROM users 
                        WHERE username = $1`;

        try {
            await this.checkIfUsernameExists(username);

            const { rows } = await db.query(query, [username]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in User.getByUsername: ${err.message}`);
                throw new DatabaseError(`Database error in User.getByUsername: ${err.message}`);
            }
        }
    }

    static async create({ username, password, email, isAdmin }) {
        const query = `INSERT INTO users (username, password, email, is_admin)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id,
                                username,
                                email,
                                is_admin AS "isAdmin",
                                created_at AS "createdAt",
                                updated_at AS "updatedAt"`;

        try {
            // Perform checks before insertion
            await this.checkForDuplicateUser(username);

            // Insert user
            const { rows } = await db.query(query, [username, password, email, isAdmin]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in User.create: ${err.message}`);
                throw new DatabaseError(`Database error in User.create: ${err.message}`);
            }
        }
    }

    /** Update user data with `data`.
     *
     *  This is a "partial update". Data can include: {username, password, email}
     *  Returns full user object or undefined if not found.
     */

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {
            username: "username",
            password: "password",
            email: "email",
        });
        const idIndex = "$" + (values.length + 1);

        const query = `UPDATE users 
                        SET ${setCols}, updated_at = CURRENT_TIMESTAMP
                        WHERE id = ${idIndex} 
                        RETURNING id,
                                  username,
                                  email,
                                  is_admin AS "isAdmin",
                                  created_at AS "createdAt",
                                  updated_at AS "updatedAt"`;

        try {
            // Perform checks before update
            await this.checkIfUserExists(id);

            // Update user
            const { rows } = await db.query(query, [...values, id]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in User.update: ${err.message}`);
                throw new DatabaseError(`Database error in User.update: ${err.message}`);
            }
        }
    }

    /** Delete user from database;
     *
     *  Returns the ID of the deleted user or undefined if not found.
     **/

    static async delete(id) {
        const query = `DELETE
                        FROM users
                        WHERE id = $1
                        RETURNING id`;

        try {
            await this.checkIfUserExists(id);

            const { rows } = await db.query(query, [id]);
            return rows[0];
        } catch (err) {
            if (err instanceof NotFoundError || err instanceof BadRequestError) {
                throw err; // Re-throw custom errors
            } else {
                console.error(`Database error in User.delete: ${err.message}`);
                throw new DatabaseError(`Database error in User.delete: ${err.message}`);
            }
        }
    }

    static async checkForDuplicateUser(username) {
        try {
            const existingUser = await db.query("SELECT id FROM users WHERE username = $1", [
                username,
            ]);

            if (existingUser.rows.length) {
                throw new BadRequestError(`Can't create user. Duplicate username: ${username}`);
            }
        } catch (err) {
            if (err instanceof BadRequestError) {
                console.error(`BadRequest error in User.checkForDuplicateUser: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in User.checkForDuplicateUser: ${err.message}`);
                throw new DatabaseError(`Database error in checkForDuplicateUser: ${err.message}`);
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
                console.error(`NotFound error in User.checkIfUserExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in User.checkIfUserExists: ${err.message}`);
                throw new DatabaseError(`Database error in checkIfUserExists: ${err.message}`);
            }
        }
    }

    static async checkIfUsernameExists(username) {
        try {
            const userResult = await db.query("SELECT id FROM users WHERE username = $1", [
                username,
            ]);

            if (userResult.rows.length === 0) {
                throw new NotFoundError(`User ${username} doesn't exist.`);
            }
        } catch (err) {
            if (err instanceof NotFoundError) {
                console.error(`NotFound error in User.checkIfUsernameExists: ${err.message}`);
                throw err; // Re-throw custom error
            } else {
                console.error(`Database error in User.checkIfUsernameExists: ${err.message}`);
                throw new DatabaseError(`Database error in checkIfUsernameExists: ${err.message}`);
            }
        }
    }
}

module.exports = User;

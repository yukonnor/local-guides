const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("@/config/config");
const User = require("@/models/User");
const {
    AppError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    DatabaseError,
} = require("../utils/errors");

class UserService {
    /** Get All Users
     *  Params: limit (how many guides to return), offset (for pagination)
     *  Returns: [{User}, {User}, ... ]
     * */

    static async getUsers(limit = 20, offset = 0) {
        let users;

        try {
            users = await User.getAll(limit, offset);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in UserService.getUsers: ${err.message}`);
                throw new AppError(`Service error in UserService.getUsers: ${err.message}`);
            }
        }
        if (!users.length) throw new AppError("App Error. No users found.");
        return users;
    }

    /** Get a User by ID
     *  Params: id (User ID)
     *  Returns: {User}
     * */

    static async getUserById(id) {
        let user;

        try {
            user = await User.getById(id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in UserService.getUserById: ${err.message}`);
                throw new AppError(`Service error in UserService.getUserById: ${err.message}`);
            }
        }
        return user;
    }

    /** Get a User by username
     *  Params: username (User username)
     *  Returns: {User}
     * */

    static async getUserByUsername(username) {
        let user;

        try {
            user = await User.getByUsername(username);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in UserService.getUserByUsername: ${err.message}`);
                throw new AppError(
                    `Service error in UserService.getUserByUsername: ${err.message}`
                );
            }
        }

        return user;
    }

    /** Register / Create a User
     *  Params: data (Obj: { username, password, email, isAdmin })
     *  Returns: {User}
     *
     *  Hashes the provided password with bcrypt for storage.
     * */

    static async registerUser(userData) {
        let newUser;
        let hashedPassword;
        let { username, password, email, isAdmin } = userData;
        if (isAdmin === undefined) isAdmin = false;

        // Username length check
        if (username.length < 1) {
            throw new BadRequestError(
                `Can't register user. Username must be at least 1 character long.`
            );
        }

        // PW length check
        if (password.length < 8) {
            throw new BadRequestError(
                `Can't register user. Password must be at least 8 characters long.`
            );
        }

        // Email provided check
        if (email.length < 1) {
            throw new BadRequestError(`Can't register user. Please provide an email address.`);
        }

        try {
            hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        } catch (err) {
            console.error(`Service error in UserService.registerUser -> PW hash: ${err.message}`);
            throw new AppError(
                `Service error in UserService.registerUser -> PW hash: ${err.message}`
            );
        }

        // Register user
        try {
            newUser = await User.create({
                username,
                password: hashedPassword,
                email,
                isAdmin,
            });
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in UserService.registerUser: ${err.message}`);
                throw new AppError(`Service error in UserService.registerUser: ${err.message}`);
            }
        }

        return newUser;
    }

    /** Authenticate a User
     *  Params: username (User username), password (provided password string from request or form)
     *  Returns: {User}
     * */

    static async authenticateUser(username, password) {
        let user;

        try {
            user = await User.getByUsername(username);
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in UserService.authenticateUser: ${err.message}`);
                throw new AppError(`Service error in UserService.authenticateUser: ${err.message}`);
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /** Update a User
     *  Params: id (User ID), data (Obj: {username, email})
     *  Returns: {User}
     * */

    static async updateUser(id, data) {
        let user;

        if (data.isAdmin || data.is_admin)
            throw new BadRequestError(`Can't update a user's admin status.`);

        if (data.username.length < 1)
            throw new BadRequestError(`Usernames must be one or more characters.`);

        try {
            user = await User.update(id, data);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in UserService.updateUser: ${err.message}`);
                throw new AppError(`Service error in UserService.updateUser: ${err.message}`);
            }
        }

        return user;
    }

    /** Delete a User
     *  Params: id (User ID)
     *  Returns: {id}
     * */

    static async deleteUser(id) {
        let userId;

        try {
            userId = await User.delete(id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in UserService.deleteUser: ${err.message}`);
                throw new AppError(`Service error in UserService.deleteUser: ${err.message}`);
            }
        }

        return userId;
    }
}

module.exports = UserService;

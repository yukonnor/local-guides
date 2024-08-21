/**
 * @jest-environment node
 */

const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("@/config/config");
const UserService = require("@/services/UserService");
const User = require("@/models/User");
const {
    AppError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../../../src/utils/errors");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("../testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("User Service", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return all users", async () => {
            const result = await UserService.getUsers();

            expect(result.length).toEqual(3);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "testauthor",
                    email: "testuser@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should limit users results", async () => {
            const result = await UserService.getUsers(1, 0);

            expect(result.length).toEqual(1);
        });

        it("should throw AppError if no users found", async () => {
            // Mock User.getAll to return an empty array
            jest.spyOn(User, "getAll").mockResolvedValue([]);

            await expect(UserService.getUsers()).rejects.toThrow(AppError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(User, "getAll").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(UserService.getUsers()).rejects.toThrow(BadRequestError);
        });
    });

    describe("getUserById", () => {
        it("should return a specific user based on id", async () => {
            const users = await UserService.getUsers();
            const result = await UserService.getUserById(users[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "testauthor",
                    email: "testuser@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a NotFound error if user id doesn't exist", async () => {
            await expect(UserService.getUserByUsername(999)).rejects.toThrow(NotFoundError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(User, "getById").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(UserService.getUserById()).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(User, "getById").mockRejectedValue(new Error("A random error"));

            await expect(UserService.getUserById()).rejects.toThrow(AppError);
        });
    });

    describe("getUserByUsername", () => {
        it("should return a specific user based on username", async () => {
            const result = await UserService.getUserByUsername("testauthor");

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "testauthor",
                    email: "testuser@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a NotFound error if username doesn't exist", async () => {
            await expect(UserService.getUserByUsername("FOOBAR")).rejects.toThrow(NotFoundError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(User, "getByUsername").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(UserService.getUserByUsername("FOOBAR")).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(User, "getByUsername").mockRejectedValue(new Error("A random error"));

            await expect(UserService.getUserByUsername("FOOBAR")).rejects.toThrow(AppError);
        });
    });

    describe("registerUser", () => {
        const NEW_USER = {
            username: "newuser",
            password: "password",
            email: "new@example.com",
            isAdmin: false,
        };

        it("should register a new user", async () => {
            jest.spyOn(bcrypt, "hash").mockResolvedValue("TESTHASH");

            const result = await UserService.registerUser(NEW_USER);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "newuser",
                    email: "new@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should default new user admin status to false", async () => {
            jest.spyOn(bcrypt, "hash").mockResolvedValue("TESTHASH");

            delete NEW_USER.isAdmin;

            const result = await UserService.registerUser(NEW_USER);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "newuser",
                    email: "new@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should enforce username and password length checks", async () => {
            jest.spyOn(bcrypt, "hash").mockResolvedValue("TESTHASH");

            NEW_USER.username = "";

            await expect(UserService.registerUser(NEW_USER)).rejects.toThrow(BadRequestError);

            NEW_USER.username = "newuser";
            NEW_USER.password = "short";

            await expect(UserService.registerUser(NEW_USER)).rejects.toThrow(BadRequestError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(User, "create").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(UserService.registerUser(NEW_USER)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(User, "create").mockRejectedValue(new Error("A random error"));

            await expect(UserService.registerUser(NEW_USER)).rejects.toThrow(AppError);
        });
    });

    describe("authenticateUser", () => {
        const CREDS = {
            username: "testauthor",
            password: "testpassword",
        };

        it("should authenticate a user", async () => {
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

            const result = await UserService.authenticateUser(CREDS.username, CREDS.password);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "testauthor",
                    email: "testuser@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should throw an UnauthorizeError if invalid credentials", async () => {
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            await expect(
                UserService.authenticateUser(CREDS.username, CREDS.password)
            ).rejects.toThrow(UnauthorizedError);
        });

        it("should throw an NotFoundError if user doesn't exist", async () => {
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            CREDS.username = "foobar";

            await expect(
                UserService.authenticateUser(CREDS.username, CREDS.password)
            ).rejects.toThrow(NotFoundError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(User, "getByUsername").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(
                UserService.authenticateUser(CREDS.username, CREDS.password)
            ).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(User, "getByUsername").mockRejectedValue(new Error("A random error"));

            await expect(
                UserService.authenticateUser(CREDS.username, CREDS.password)
            ).rejects.toThrow(AppError);
        });
    });

    describe("updateUser", () => {
        const USER_DATA = {
            username: "newuser",
            password: "newpassword",
            email: "newemail@example.com",
        };

        it("should update a user", async () => {
            const users = await User.getAll();
            const result = await UserService.updateUser(users[0].id, USER_DATA);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "newuser",
                    email: "newemail@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should throw an NotFoundError if user doesn't exist", async () => {
            await expect(UserService.updateUser(999, USER_DATA)).rejects.toThrow(NotFoundError);
        });

        it("should throw an BadRequestError if username too short or isAdmin modified", async () => {
            USER_DATA.username = "";
            const users = await User.getAll();

            await expect(UserService.updateUser(users[0].id, USER_DATA)).rejects.toThrow(
                BadRequestError
            );

            USER_DATA.username = "newusername";
            USER_DATA.isAdmin = true;

            await expect(UserService.updateUser(users[0].id, USER_DATA)).rejects.toThrow(
                BadRequestError
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(User, "update").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(UserService.updateUser(1, USER_DATA)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(User, "update").mockRejectedValue(new Error("A random error"));

            await expect(UserService.updateUser(1, USER_DATA)).rejects.toThrow(AppError);
        });
    });

    describe("deleteUser", () => {
        it("should delete a user", async () => {
            const users = await User.getAll();
            const result = await UserService.deleteUser(users[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: users[0].id,
                })
            );
        });

        it("should throw an NotFoundError if user doesn't exist", async () => {
            await expect(UserService.deleteUser(999)).rejects.toThrow(NotFoundError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(User, "delete").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(UserService.deleteUser(1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(User, "delete").mockRejectedValue(new Error("A random error"));

            await expect(UserService.deleteUser(1)).rejects.toThrow(AppError);
        });
    });
});

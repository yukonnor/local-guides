/**
 * @jest-environment node
 */

const db = require("@/lib/db");
const User = require("@/models/User");
const { NotFoundError, BadRequestError, DatabaseError } = require("@/utils/errors");
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

describe("User Model", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return all users", async () => {
            const result = await User.getAll();

            expect(result.length).toEqual(3);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "testuser",
                    email: "testuser@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should limit users results", async () => {
            const result = await User.getAll(1, 0);

            expect(result.length).toEqual(1);
        });
    });

    describe("getById", () => {
        it("should return a user", async () => {
            const users = await User.getAll();

            const result = await User.getById(users[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "testuser",
                    email: "testuser@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a NotFound error if user doesn't exist", async () => {
            // Mock `checkIfUserExists` to throw a `NotFoundError`
            jest.spyOn(User, "checkIfUserExists").mockImplementation(() => {
                throw new NotFoundError("User not found");
            });

            await expect(User.getById(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getByUsername", () => {
        it("should return a user", async () => {
            const result = await User.getByUsername("testuser");

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "testuser",
                    email: "testuser@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a NotFound error if user doesn't exist", async () => {
            // Mock `checkIfUsernameExists` to throw a `NotFoundError`
            jest.spyOn(User, "checkIfUsernameExists").mockImplementation(() => {
                throw new NotFoundError("User not found");
            });

            await expect(User.getByUsername("notreal")).rejects.toThrow(NotFoundError);
        });
    });

    describe("create", () => {
        it("should create a user", async () => {
            const newUser = {
                username: "newuser",
                password: "password",
                email: "newuser@example.com",
                isAdmin: false,
            };
            const result = await User.create(newUser);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "newuser",
                    email: "newuser@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a BadRequest error if dupe username provided", async () => {
            const dupeUser = {
                username: "testuser",
                password: "password",
                email: "testuser@example.com",
                isAdmin: false,
            };

            // Mock `checkForDuplicateUser` to throw a `BadRequestError`
            jest.spyOn(User, "checkForDuplicateUser").mockImplementation(() => {
                throw new BadRequestError("Duplicate user");
            });

            await expect(User.create(dupeUser)).rejects.toThrow(BadRequestError);
        });
    });

    describe("update", () => {
        it("should update a user", async () => {
            const user = await User.getByUsername("testuser");

            const data = {
                email: "newemail@example.com",
            };

            const result = await User.update(user.id, data);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: "testuser",
                    email: "newemail@example.com",
                    isAdmin: false,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a NotFound error if user id doesn't exist", async () => {
            const data = {
                email: "newemail@example.com",
            };

            // Mock `checkIfUserExists` to throw a `NotFoundError`
            jest.spyOn(User, "checkIfUserExists").mockImplementation(() => {
                throw new NotFoundError("User not found");
            });

            await expect(User.update(0, data)).rejects.toThrow(NotFoundError);
        });

        it("should throw an error if isAdmin is attempted to be modified", async () => {
            const user = await User.getByUsername("testuser");

            const data = {
                isAdmin: true,
            };

            await expect(User.update(user.id, data)).rejects.toThrow(DatabaseError);
        });
    });

    describe("delete", () => {
        it("should delete a user", async () => {
            const users = await User.getAll();
            const result = await User.delete(users[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should return a NotFound error if user doesn't exist", async () => {
            // Mock `checkIfUserExists` to throw a `NotFoundError`
            jest.spyOn(User, "checkIfUserExists").mockImplementation(() => {
                throw new NotFoundError("User not found");
            });

            await expect(User.delete(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkForDuplicateUser", () => {
        it("should return undefined if not a duplicate user", async () => {
            const result = await User.checkForDuplicateUser("fakeusername");

            expect(result).toEqual(undefined);
        });

        it("should return a BadRequestError error if duplicate user", async () => {
            const users = await User.getAll();
            await expect(User.checkForDuplicateUser(users[0].username)).rejects.toThrow(
                BadRequestError
            );
        });
    });

    describe("checkIfUserExists", () => {
        it("should return undefined if user exists", async () => {
            const users = await User.getAll();
            const result = await User.checkIfUserExists(users[0].id);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if user doesn't exist", async () => {
            await expect(User.checkIfUserExists(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfUsernameExists", () => {
        it("should return undefined if user exists", async () => {
            const users = await User.getAll();
            const result = await User.checkIfUsernameExists(users[0].username);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if user doesn't exist", async () => {
            await expect(User.checkIfUsernameExists("FOOBAR")).rejects.toThrow(NotFoundError);
        });
    });
});

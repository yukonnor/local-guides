const userCreateSchema = {
    type: "object",
    properties: {
        username: { type: "string", minLength: 1, maxLength: 30 },
        password: { type: "string", minLength: 8, maxLength: 100 },
        email: { type: "string", format: "email" },
        isAdmin: { type: "boolean" },
    },
    required: ["username", "password", "email"],
    additionalProperties: false,
};

export default userCreateSchema;

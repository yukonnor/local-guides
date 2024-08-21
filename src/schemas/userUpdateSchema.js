const userUpdateSchema = {
    type: "object",
    properties: {
        username: { type: "string", minLength: 1, maxLength: 30 },
        password: { type: "string", minLength: 8, maxLength: 100 },
        email: { type: "string", format: "email" },
    },
    anyOf: [{ required: ["username"] }, { required: ["password"] }, { required: ["email"] }],
    additionalProperties: false,
};

export default userUpdateSchema;

const guideShareSchema = {
    type: "object",
    properties: {
        email: { type: "string", format: "email" },
    },
    required: ["email"],
    additionalProperties: false,
};

export default guideShareSchema;

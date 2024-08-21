const tagSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
    },
    required: ["name"],
    additionalProperties: false,
};

export default tagSchema;

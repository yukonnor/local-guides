const placeCreateSchema = {
    type: "object",
    properties: {
        description: { type: "string" },
        recType: { enum: ["dontmiss", "recommend", "iftime", "avoid"] },
    },
    anyOf: [{ required: ["description"] }, { required: ["recType"] }],
    additionalProperties: false,
};

export default placeCreateSchema;

const placeCreateSchema = {
    type: "object",
    properties: {
        googlePlaceId: { type: "string" },
        description: { type: "string" },
        recType: { enum: ["dontmiss", "recommend", "iftime", "avoid"] },
    },
    required: ["googlePlaceId", "recType"],
    additionalProperties: false,
};

export default placeCreateSchema;

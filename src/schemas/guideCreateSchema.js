const guideCreateSchema = {
    type: "object",
    properties: {
        authorId: { type: "integer" },
        googlePlaceId: { type: "string" },
        title: { type: "string", minLength: 5 },
        isPrivate: { type: "boolean" },
        latitude: { type: "number" },
        longitude: { type: "number" },
    },
    required: ["authorId", "googlePlaceId", "title", "isPrivate", "latitude", "longitude"],
    additionalProperties: false,
};

export default guideCreateSchema;

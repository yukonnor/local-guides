const googleSearchPlaceSchema = {
    type: "object",
    properties: {
        placeType: { type: "string", enum: ["place", "locality"] },
        textQuery: { type: "string", minLength: 2, maxLength: 100 },
        latitude: { type: "number" },
        longitude: { type: "number" },
    },
    required: ["placeType", "textQuery"],
    additionalProperties: false,
};

export default googleSearchPlaceSchema;

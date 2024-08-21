const guideFetchSchema = {
    type: "object",
    properties: {
        latitude: { type: "number" },
        longitude: { type: "number" },
    },
    required: ["latitude", "longitude"],
    additionalProperties: false,
};
export default guideFetchSchema;

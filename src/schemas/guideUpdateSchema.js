const guideUpdateSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 5 },
        isPrivate: { type: "boolean" },
        description: { type: "string" },
    },
    anyOf: [{ required: ["title"] }, { required: ["isPrivate"] }, { required: ["description"] }],
    additionalProperties: false,
};
export default guideUpdateSchema;

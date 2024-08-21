export async function GET(request) {
    const message = {
        message:
            "Places can only be fetched via their associated guide. Use GET /api/guide/[id]/places.",
    };

    return Response.json(message);
}

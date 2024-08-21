const Guide = require("../models/Guide");
const GuidePlaceService = require("./GuidePlaceService");
const { AppError, NotFoundError, BadRequestError, DatabaseError } = require("../utils/errors");

class GuideService {
    /** Get All Guides
     *  Params: limit (how many guides to return), offset (for pagination)
     *  Returns: [{Guide}, {Guide}, ... ]
     * */

    static async getGuides(limit = 20, offset = 0) {
        let guides;

        try {
            guides = await Guide.getAll(limit, offset);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuideService.getGuides: ${err.message}`);
                throw new AppError(`Service error in GuideService.getGuides: ${err.message}`);
            }
        }

        if (!guides.length)
            throw new AppError(`Service error GuideService.getGuides: Error, no guides found.`);
        return guides;
    }

    /** Get a Guide by ID
     *  Params: id (Guide ID)
     *  Returns: {Guide}
     * */

    static async getGuideById(id) {
        let guide;

        try {
            guide = await Guide.getById(id);
            // append guide places and shares to guide object
            const places = await GuidePlaceService.getGuidePlacesByGuideId(id);
            guide["places"] = places;
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuideService.getGuideById: ${err.message}`);
                throw new AppError(`Service error in GuideService.getGuideById: ${err.message}`);
            }
        }

        return guide;
    }

    /** Get Guides by Author Id
     *  Params: userId
     *  Returns: [ {Guide}, {Guide}, ... ] or []
     * */

    static async getGuideByAuthorId(userId) {
        let guides;

        try {
            guides = await Guide.getByAuthorId(userId);

            // flush out the guides returned with details
            guides = await Promise.all(guides.map(({ id }) => this.getGuideById(id)));
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuideService.getGuideByAuthorId: ${err.message}`);
                throw new AppError(
                    `Service error in GuideService.getGuideByAuthorId: ${err.message}`
                );
            }
        }

        return guides;
    }

    /** Get "nearby" Guides by Lat, Long
     *  This is a special query that also returns a placeTags array of tags + count of
     *  places with tag for use on the guide search results page.
     *
     *  Params: lat, long, limit, offset
     *  Returns: [{Guide}, {Guide}, ... ], sorted by distance in miles to input lat,long
     * */

    static async getGuidesByLatLong(lat, long, limit = 20, offset = 0) {
        let guides;

        try {
            guides = await Guide.getNearbyByLatLong(lat, long, limit, offset);
            // flush out the guides returned with details
            // Fetch guide details for each guide
            guides = await Promise.all(
                guides.map(async (guide) => {
                    // Ensure this refers to the class instance
                    const guideDetails = await GuideService.getGuideById(guide.id);
                    return { ...guideDetails, distanceInMiles: guide.distanceInMiles };
                })
            );
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuideService.getGuidesByLatLong: ${err.message}`);
                throw new AppError(
                    `Service error in GuideService.getGuidesByLatLong: ${err.message}`
                );
            }
        }

        return guides;
    }

    /** Get a random public Guide
     *  Params: n/a
     *  Returns: {Guide}
     * */

    static async getRandomGuide() {
        let guide;

        try {
            guide = await Guide.getRandom();
            guide = await this.getGuideById(guide.id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuideService.getRandomGuide: ${err.message}`);
                throw new AppError(`Service error in GuideService.getRandomGuide: ${err.message}`);
            }
        }
        return guide;
    }

    /** Create a Guide
     *  Params: data (Obj: { authorId, googlePlaceId, title, isPrivate, latitude, longitude })
     *  Returns: {Guide}
     * */

    static async addGuide(data) {
        let guide;

        try {
            guide = await Guide.create(data);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuideService.addGuide: ${err.message}`);
                throw new AppError(`Service error in GuideService.addGuide: ${err.message}`);
            }
        }
        return guide;
    }

    /** Update a Guide
     *  Params: id (GuidePlace ID), data (Obj: {title, description, isPrivate})
     *  Returns: {Guide}
     * */

    static async updateGuide(id, data) {
        let guide;

        try {
            guide = await Guide.update(id, data);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuideService.updateGuide: ${err.message}`);
                throw new AppError(`Service error in GuideService.updateGuide: ${err.message}`);
            }
        }

        return guide;
    }

    /** Delete a Guide
     *  Params: id (Guide ID)
     *  Returns: {id}
     * */

    static async deleteGuide(id) {
        let deletedGuide;

        try {
            deletedGuide = await Guide.delete(id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuideService.deleteGuide: ${err.message}`);
                throw new AppError(`Service error in GuideService.deleteGuide: ${err.message}`);
            }
        }
        return deletedGuide;
    }
}

module.exports = GuideService;

const GuidePlace = require("../models/GuidePlace");
const { AppError, NotFoundError, BadRequestError, DatabaseError } = require("../utils/errors");

class GuidePlaceService {
    /** Get All Guide Places
     *  Params: limit (how many guide places to return), offset (for pagination)
     *  Returns: [{GuidePlace}, {GuidePlace}, ... ]
     * */

    static async getGuidePlaces(limit = 20, offset = 0) {
        let guidePlaces;

        try {
            guidePlaces = await GuidePlace.getAll(limit, offset);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuidePlaceService.getGuidePlaces: ${err.message}`);
                throw new AppError(
                    `Service error in GuidePlaceService.getGuidePlaces: ${err.message}`
                );
            }
        }

        if (!guidePlaces.length) throw new AppError(`App Error. No guide places found.`);
        return guidePlaces;
    }

    /** Get a Guide Place by ID
     *  Params: id (guide_places.id)
     *  Returns: {GuidePlace}
     * */

    static async getGuidePlaceById(id) {
        let guidePlace;

        try {
            guidePlace = await GuidePlace.getById(id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuidePlaceService.getGuidePlaces: ${err.message}`);
                throw new AppError(
                    `Service error in GuidePlaceService.getGuidePlaceById: ${err.message}`
                );
            }
        }

        return guidePlace;
    }

    /** Get all Guide Places for a Guide
     *  Params: guideId (Guide ID)
     *  Returns: [{GuidePlace}, {GuidePlace}, ... ]
     * */

    static async getGuidePlacesByGuideId(guideId) {
        let guidePlaces;

        try {
            guidePlaces = await GuidePlace.getByGuideId(guideId);
            // flush out the places returned with details
            guidePlaces = await Promise.all(
                guidePlaces.map(({ id }) => this.getGuidePlaceById(id))
            );
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(
                    `Service error in GuidePlaceService.getGuidePlaceById: ${err.message}`
                );
                throw new AppError(
                    `Service error in GuidePlaceService.getGuidePlaceById: ${err.message}`
                );
            }
        }

        return guidePlaces;
    }

    /** Create a Guide Place for a Guide
     *  Params: guideId (Guide ID), data (Obj: { googlePlaceId, description, recType })
     *  Returns: {GuidePlace}
     * */

    static async addGuidePlace(guideId, data) {
        let guidePlace;

        try {
            guidePlace = await GuidePlace.create(guideId, data);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuidePlaceService.addGuidePlace: ${err.message}`);
                throw new AppError(
                    `Service Error in GuidePlaceService.addGuidePlace: ${err.message}`
                );
            }
        }
        return guidePlace;
    }

    /** Update a Guide Place
     *  Params: id (GuidePlace ID), data (Obj: { description, recType })
     *  Returns: {GuidePlace}
     * */

    static async updateGuidePlace(id, data) {
        let guidePlace;

        try {
            guidePlace = await GuidePlace.update(id, data);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(
                    `Service error in GuidePlaceService.updateGuidePlace: ${err.message}`
                );
                throw new AppError(
                    `Service Error in GuidePlaceService.updateGuidePlace: ${err.message}`
                );
            }
        }
        return guidePlace;
    }

    /** Delete a Guide Place
     *  Params: id (GuidePlace ID)
     *  Returns: {id}
     * */

    static async deleteGuidePlace(id) {
        let guidePlace;

        try {
            guidePlace = await GuidePlace.delete(id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(
                    `Service error in GuidePlaceService.deleteGuidePlace: ${err.message}`
                );
                throw new AppError(
                    `Service Error in GuidePlaceService.deleteGuidePlace: ${err.message}`
                );
            }
        }
        return guidePlace;
    }
}

module.exports = GuidePlaceService;

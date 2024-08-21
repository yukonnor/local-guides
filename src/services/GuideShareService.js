const GuideShare = require("../models/GuideShare");
const { AppError, NotFoundError, BadRequestError, DatabaseError } = require("../utils/errors");
const GuideService = require("./GuideService");

class GuideShareService {
    /** Get All Guide Shares
     *  Params: limit (how many guide shares to return), offset (for pagination)
     *  Returns: [{GuideShare}, {GuideShare}, ... ]
     * */

    static async getGuideShares(limit = 20, offset = 0) {
        let guideShares;

        try {
            guideShares = await GuideShare.getAll(limit, offset);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuideShareService.getGuideShares: ${err.message}`);
                throw new AppError(
                    `Service error in GuideShareService.getGuideShares: ${err.message}`
                );
            }
        }

        if (!guideShares.length) throw new AppError(`App Error. No guide shares found.`);
        return guideShares;
    }

    /** Get Users that a Guide is shared with
     *  Params: id (Guide ID)
     *  Returns: [{share}, {share}, ...]
     * */

    static async getSharesByGuideId(id) {
        let shares;

        try {
            shares = await GuideShare.getSharesByGuideId(id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(
                    `Service error in GuideShareService.getSharesByGuideId: ${err.message}`
                );
                throw new AppError(
                    `Service error in GuideShareService.getSharesByGuideId: ${err.message}`
                );
            }
        }

        return shares;
    }

    /** Get Guides that were shared with a User
     *  Params: userId
     *  Returns: [{guide}, {guide}, ...] or []
     * */

    static async getGuidesBySharedUserId(userId) {
        let guides;

        try {
            guides = await GuideShare.getGuidesBySharedUserId(userId);
            // flush out the guides returned with details
            guides = await Promise.all(guides.map(({ id }) => GuideService.getGuideById(id)));
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(
                    `Service error in GuideShareService.getGuidesBySharedUserId: ${err.message}`
                );
                throw new AppError(
                    `Service error in GuideShareService.getGuidesBySharedUserId: ${err.message}`
                );
            }
        }
        return guides;
    }

    /** Share a Guide with an Email
     *  Params: guideId, email
     *  Returns: { addedShare: {GuideShare} }
     * */

    static async addShareToGuide(guideId, email) {
        if (!email.length)
            throw new BadRequestError("Please provide an email address to share guide.");

        let guideShare;

        try {
            guideShare = await GuideShare.create(guideId, email);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in GuideShareService.addShareToGuide: ${err.message}`);
                throw new AppError(
                    `Service error in GuideShareService.addShareToGuide: ${err.message}`
                );
            }
        }

        return guideShare;
    }

    /** Remove a share from a guide's share list
     *  Params: id (share id), guideId
     *  Returns: { id }
     * */

    static async deleteShareFromGuide(id, guideId) {
        let deletedGuideShare;

        try {
            deletedGuideShare = await GuideShare.delete(id, guideId);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(
                    `Service error in GuideShareService.deleteShareFromGuide: ${err.message}`
                );
                throw new AppError(
                    `Service error in GuideShareService.deleteShareFromGuide: ${err.message}`
                );
            }
        }

        return deletedGuideShare;
    }
}

module.exports = GuideShareService;

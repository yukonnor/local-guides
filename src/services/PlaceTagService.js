const Tag = require("@/models/Tag");
const PlaceTag = require("@/models/PlaceTag");
const { AppError, NotFoundError, BadRequestError, DatabaseError } = require("@/utils/errors");
const { toTitleCase } = require("@/utils/helpers");

class PlaceTagService {
    //////////// Tag Methods /////////////////////////////

    /** Get All Tags
     *  Params: N/A
     *  Returns: [{Tag}, {Tag}, ... ]
     *
     *  Note: removed linit and offset so that we show full set of available tags to users
     * */

    static async getTags() {
        let tags;

        try {
            tags = await Tag.getAll();
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in PlaceTagService.getTags: ${err.message}`);
                throw new AppError(`Service error in PlaceTagService.getTags: ${err.message}`);
            }
        }

        if (!tags.length) throw new AppError(`App Error. No tags found.`);
        return tags;
    }

    /** Get a Tag by ID
     *  Params: id (Tag ID)
     *  Returns: {Tag}
     * */

    static async getTagById(id) {
        let tag;

        try {
            tag = await Tag.getById(id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in PlaceTagService.getTagById: ${err.message}`);
                throw new AppError(`Service error in PlaceTagService.getTagById: ${err.message}`);
            }
        }

        return tag;
    }

    /** Get a Tag by Tag Name
     *  Params: name (Tag Name)
     *  Returns: {Tag} if found or undefined if not found
     * */

    static async getTagByName(name) {
        let tag;

        try {
            tag = await Tag.getByName(name);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in PlaceTagService.getTagByName: ${err.message}`);
                throw new AppError(`Service error in PlaceTagService.getTagByName: ${err.message}`);
            }
        }

        // Note: don't throw error if tag with name not found.
        if (!tag) return undefined;
        return tag;
    }

    /** Create a Tag
     *  Params: data (Obj: { name })
     *  Returns: {Tag}
     * */

    static async addTag(data) {
        let tag;

        try {
            const tagName = toTitleCase(data.name);
            tag = await Tag.create(tagName);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in PlaceTagService.addTag: ${err.message}`);
                throw new AppError(`Service error in PlaceTagService.addTag: ${err.message}`);
            }
        }

        return tag;
    }

    /** Update a Tag
     *  Params: id (Tag ID), data (Obj: {name})
     *  Returns: {Tag}
     * */

    static async updateTag(id, data) {
        let tag;

        try {
            const name = toTitleCase(data.name);
            tag = await Tag.update(id, { name });
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in PlaceTagService.updateTag: ${err.message}`);
                throw new AppError(`Service error in PlaceTagService.updateTag: ${err.message}`);
            }
        }
        return tag;
    }

    /** Delete a Tag
     *  Params: id (Tag ID)
     *  Returns: {id}
     * */

    static async deleteTag(id) {
        let tag;

        try {
            tag = await Tag.delete(id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in PlaceTagService.deleteTag: ${err.message}`);
                throw new AppError(`Service error in PlaceTagService.deleteTag: ${err.message}`);
            }
        }

        return tag;
    }

    ////////// Place-Tag Association Methods ///////////////////////

    /** Get All Place Tag associationas
     *  Params: limit (how many to return), offset (for pagination)
     *  Returns: [{PlaceTag}, {PlaceTag}, ... ]
     * */

    static async getPlaceTags(limit = 20, offset = 0) {
        let placeTags;

        try {
            placeTags = await PlaceTag.getAll(limit, offset);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in PlaceTagService.getPlaceTags: ${err.message}`);
                throw new AppError(`Service error in PlaceTagService.getPlaceTags: ${err.message}`);
            }
        }
        if (!placeTags.length) throw new AppError(`App Error. No place tags found.`);
        return placeTags;
    }

    /** Get a Tags by Place ID
     *  Params: id (Place ID)
     *  Returns: [{id, name}, {id, name}, ...]
     * */

    static async getTagsByPlaceId(id) {
        let tags;

        try {
            tags = await PlaceTag.getTagsByPlaceId(id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in PlaceTagService.getTagsByPlaceId: ${err.message}`);
                throw new AppError(
                    `Service error in PlaceTagService.getTagsByPlaceId: ${err.message}`
                );
            }
        }

        return tags;
    }

    /** Get a Tags by Guide ID
     *
     *  Gets distinct tags associated with a guide's places, along with the count of how many
     *  times that tag is assigned to places on the guide.
     *
     *  Params: id (guideId)
     *  Returns: [{tagId, tagName, count}, {tagId, tagName, count}, ...]
     * */

    static async getTagsByGuideId(id) {
        let tags;

        try {
            tags = await PlaceTag.getTagsByGuideId(id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in PlaceTagService.getTagsByGuideId: ${err.message}`);
                throw new AppError(
                    `Service error in PlaceTagService.getTagsByGuideId: ${err.message}`
                );
            }
        }

        return tags;
    }

    /** Get a Places tagged with Tag ID
     *  Params: id (Tag ID)
     *  Returns: [{placeId}, {placeId}, ...]
     * */

    static async getPlacesByTagId(id) {
        let places;

        try {
            places = await PlaceTag.getPlacesByTagId(id);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in PlaceTagService.getPlacesByTagId: ${err.message}`);
                throw new AppError(
                    `Service error in PlaceTagService.getPlacesByTagId: ${err.message}`
                );
            }
        }

        return places;
    }

    /** Add a Tag to a Place
     *  Params: placeId (Place ID), tagId (Tag ID)
     *  Returns: {PlaceTag}
     * */

    static async addTagToPlace(placeId, tagId) {
        let placeTag;

        try {
            placeTag = await PlaceTag.create(placeId, tagId);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(`Service error in PlaceTagService.addTagToPlace: ${err.message}`);
                throw new AppError(
                    `Service error in PlaceTagService.addTagToPlace: ${err.message}`
                );
            }
        }

        return placeTag;
    }

    /** Add multiple Tags to a Place
     *  Params: placeId (Place ID), tagIds (array of Tag IDs)
     *  Returns: [{id, name}, {id, name}]
     * */

    static async addTagsToPlace(placeId, tagIds) {
        let placeTags;

        try {
            placeTags = await Promise.all(
                tagIds.map(async (tagId) => {
                    const placeTag = await this.addTagToPlace(placeId, tagId);

                    return { id: placeTag.tagId, name: placeTag.name };
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
                console.error(`Service error in PlaceTagService.addTagsToPlace: ${err.message}`);
                throw new AppError(
                    `Service error in PlaceTagService.addTagsToPlace: ${err.message}`
                );
            }
        }

        return placeTags;
    }

    /** Remove a Tag from a Place
     *  Params: placeId (Guide ID), tagId (Tag ID)
     *  Returns: {placeId, tagId}
     * */

    static async deleteTagFromPlace(placeId, tagId) {
        let deletedPlaceTag;

        try {
            deletedPlaceTag = await PlaceTag.delete(placeId, tagId);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(
                    `Service error in PlaceTagService.deleteTagFromPlace: ${err.message}`
                );
                throw new AppError(
                    `Service error in PlaceTagService.deleteTagFromPlace: ${err.message}`
                );
            }
        }

        return deletedPlaceTag;
    }

    /** Remove all Tags from a Place
     *  Params: placeId (Place ID)
     *  Returns: [{placeId, tagId}, {placeId, tagId}]
     * */

    static async deleteTagsFromPlace(placeId) {
        let deletedPlaceTags;

        try {
            deletedPlaceTags = await PlaceTag.deleteAll(placeId);
        } catch (err) {
            if (
                err instanceof DatabaseError ||
                err instanceof NotFoundError ||
                err instanceof BadRequestError
            ) {
                throw err; // Re-throw prior errors
            } else {
                console.error(
                    `Service error in PlaceTagService.deleteTagsFromPlace: ${err.message}`
                );
                throw new AppError(
                    `Service error in PlaceTagService.deleteTagsFromPlace: ${err.message}`
                );
            }
        }

        return deletedPlaceTags;
    }

    /** Process tags from the PlaceTag input
     *
     *  If tag already exists in DB (has an ID) parses out the tag id.
     *  If the tag doesn't exist, create it and return the tag id.
     *
     *  Params:
     *   - tags: A list of tag objects (e.g. [ { value: 1, label: 'Nature' }, { value: 'NewTag', label: 'NewTag' }, ... ] )
     *   Note:  `value` is either the id of an existing tag or the tag label for new tags.
     *
     *  Returns an array of tag IDs.
     *   - [id, id, id, ...]
     */

    static async processTagsFromForm(tags) {
        let tagIds;

        try {
            tagIds = await Promise.all(
                tags.map(async (tag) => {
                    if (typeof tag.value === "number") {
                        return tag.value;
                    } else {
                        const tagName = toTitleCase(tag.value);

                        // double check if tag already exists
                        const existingTag = await this.getTagByName(tagName);

                        if (existingTag && existingTag.id) {
                            return existingTag.id;
                        }

                        // if not, create new tag
                        const newTag = await this.addTag({ name: tagName });

                        return newTag.id;
                    }
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
                console.error(
                    `Service error in PlaceTagService.processTagsFromForm: ${err.message}`
                );
                throw new AppError(
                    `Service error in PlaceTagService.processTagsFromForm: ${err.message}`
                );
            }
        }

        return tagIds;
    }
}

module.exports = PlaceTagService;

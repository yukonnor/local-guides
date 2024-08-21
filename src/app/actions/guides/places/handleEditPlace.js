"use server";
import GuidePlaceService from "@/services/GuidePlaceService";
import PlaceTagService from "@/services/PlaceTagService";

// Handle submit from PlaceEditForm
export async function handleEditPlace(placeId, formData) {
    // Note:  tags is a list of tag objects (e.g. [ { value: 1, label: 'Nature' }, { value: 'NewTag', label: 'NewTag' }, ... ] )
    const { description, recType, tags } = formData;

    try {
        // Update place tags
        // First, get tag ids
        let tagIds = await PlaceTagService.processTagsFromForm(tags);

        // Next, clear out existing tags on the Place
        await PlaceTagService.deleteTagsFromPlace(placeId);

        // Then, re-add tags based on the tagIds list
        const addedTags = await PlaceTagService.addTagsToPlace(placeId, tagIds);

        // Update place data
        const edittedPlace = await GuidePlaceService.updateGuidePlace(placeId, {
            description,
            recType,
        });

        // Add tag data to place
        edittedPlace.tags = addedTags;

        return edittedPlace;
    } catch (err) {
        console.error(`Error in actions.handleEditPlace: ${err.message}.`);
        throw err;
    }
}

// Populate the EditPlaceForm with place tag suggestions from the db
export async function getTagSuggestions() {
    // Note: getTags() currently returns ALL tags (no pagination).
    // This will likely require some refactoring to get the most common tags once the amount of tags increases.
    try {
        const allTags = await PlaceTagService.getTags();
        const tagSuggestions = allTags.map((tag) => ({ value: tag.id, label: tag.name }));

        return tagSuggestions;
    } catch (err) {
        console.error(`Error in actions.getTagSuggestions: ${err.message}.`);
        throw err;
    }
}

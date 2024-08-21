import GuideService from "@/services/GuideService";
import GuideShareService from "@/services/GuideShareService";

/** These functions can be imported to routes that require further authorization handling */

/**  isOwnerOrAdmin
 *   This function is to be used in API routes to determine if the requester is either the owner of the
 *   item being modified or and admin.
 *
 *   API routes that required user access get a user header. This function gets the value from that header. *
 */

export async function isOwnerOrAdmin(user, itemId, itemType) {
    if (!user) return false;

    let isOwner;

    try {
        itemId = Number(itemId);
    } catch {
        return false;
    }

    if (itemType === "guide") {
        const guide = await GuideService.getGuideById(itemId);
        isOwner = guide ? guide.authorId === user.id : false;
    } else if (itemType === "profile") {
        isOwner = user.id === itemId;
    } else {
        return false;
    }

    return user.isAdmin || isOwner;
}

/**  isPublicOrSharedWith
 *   This function is to be used in API routes to determine if the requester is able to get information
 *   about a guide. Private guides should only be visible by:
 *   - Their owner
 *   - Users the guide is shared with
 *   - Admins
 *
 *   API routes that required user access get a user header. This function gets the value from that header. *
 */

export async function isPublicOrSharedWith(user, guideId) {
    const guide = await GuideService.getGuideById(guideId);

    // Exit early if the guide is public
    if (!guide.isPrivate) return true;

    // If no user is provided, only public guides can be shown
    if (!user) return false;

    // Exit early if the user is an admin
    if (user.isAdmin) return true;

    // Exit early if the user is the author of the guide
    if (user.id === guide.authorId) return true;

    // Check if the guide is shared with the user
    const sharedGuides = await GuideShareService.getGuidesBySharedUserId(user.id);
    return sharedGuides.some((sharedGuide) => sharedGuide.id === guide.id);
}

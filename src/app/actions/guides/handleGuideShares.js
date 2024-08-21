"use server";
import GuideShareService from "@/services/GuideShareService";

// Handle submit from GuideShareForm (No redirects. )
export async function handleShareGuide(guideId, email) {
    try {
        const guideShare = await GuideShareService.addShareToGuide(guideId, email);
        return guideShare;
    } catch (err) {
        console.error(`Error in actions.handleShareGuide: ${err.message}.`);
        throw err;
    }
}

// Handle delete from GuideSharesCard
export async function handleDeleteShare(guideId, shareId) {
    try {
        const deletedShare = await GuideShareService.deleteShareFromGuide(shareId, guideId);
        return deletedShare;
    } catch (err) {
        console.error(`Error in actions.handleDeleteShare: ${err.message}.`);
        throw err;
    }
}

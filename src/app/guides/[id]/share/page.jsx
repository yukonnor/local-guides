import { getGuideById } from "@/services/GuideService";
import { getSharesByGuideId } from "@/services/GuideShareService";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionHandler";
import { isOwnerOrAdmin } from "@/lib/authMiddleware";
import GuideShareForm from "@/app/guides/[id]/_components/GuideShareForm";
import PageContent from "@/components/PageContent";

export const metadata = {
    title: "Share Guide | Local Guides",
};

export default async function ShareGuidePage({ params }) {
    const session = await getSession();
    let guide, guideShares;

    try {
        guide = await getGuideById(params.id);
        guideShares = await getSharesByGuideId(guide.id);
    } catch (err) {
        if (err.status === 404) {
            notFound(); // Show the 404 page
        } else {
            console.error("An error occurred:", err);
            throw new Error("Sorry, but we're unable to load this guide page."); // Throw user-facing error.
        }
    }

    // Auth: ensure either admin or owner of guide
    if (!(await isOwnerOrAdmin(session, guide.id, "guide"))) {
        redirect("/?alert=not-authorized-guide");
    }

    return (
        <PageContent>
            <GuideShareForm guide={guide} guideShares={guideShares} />
        </PageContent>
    );
}

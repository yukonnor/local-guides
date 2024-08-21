import { getSession } from "@/lib/sessionHandler";
import { getGuideById } from "@/services/GuideService";
import { redirect } from "next/navigation";
import { isOwnerOrAdmin } from "@/lib/authMiddleware";
import PageContent from "@/components/PageContent";
import PlaceAddForm from "@/app/guides/[id]/places/add/_components/PlaceAddForm";

export const metadata = {
    title: "Add Place | Local Guides",
};

export default async function AddPlace({ params }) {
    const session = await getSession();
    let guide;

    try {
        guide = await getGuideById(params.id);
    } catch (err) {
        if (err.status === 404) {
            notFound(); // Show the 404 page
        } else {
            console.error("An error occurred in <AddPlace>:", err);
            throw new Error("Sorry, but we're unable to load this guide page."); // Throw user-facing error.
        }
    }

    // Auth: ensure either admin or owner of guide
    if (!(await isOwnerOrAdmin(session, guide.id, "guide"))) {
        redirect("/?alert=not-authorized-guide");
    }

    return (
        <PageContent>
            <PlaceAddForm guide={guide} />
        </PageContent>
    );
}

import { getGuideById } from "@/services/GuideService";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionHandler";
import { isOwnerOrAdmin } from "@/lib/authMiddleware";
import PageContent from "@/components/PageContent";
import GuideEditForm from "@/app/guides/[id]/_components/GuideEditForm";

export const metadata = {
    title: "Edit Guide | Local Guides",
};

export default async function EditGuide({ params }) {
    const session = await getSession();
    let guide;

    try {
        guide = await getGuideById(params.id);
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
            <GuideEditForm guide={guide} />
        </PageContent>
    );
}

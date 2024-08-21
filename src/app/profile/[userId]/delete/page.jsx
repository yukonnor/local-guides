import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionHandler";
import ProfileDeleteForm from "../_components/ProfileDeleteForm";
import { isOwnerOrAdmin } from "@/lib/authMiddleware";
import PageContent from "@/components/PageContent";

export const metadata = {
    title: "Delete Profile | Local Guides",
};

export default async function DeleteProfile({ params }) {
    // Auth: ensure either admin or owner of profile
    const session = await getSession();
    const authorized = await isOwnerOrAdmin(session, params.userId, "profile");
    if (!authorized) {
        redirect("/?alert=not-authorized-profile");
    }
    // End Auth

    return (
        <PageContent>
            <ProfileDeleteForm userId={params.userId} />
        </PageContent>
    );
}

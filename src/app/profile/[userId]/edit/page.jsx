import { redirect } from "next/navigation";
import { getSession } from "@/lib/sessionHandler";
import { getUserById, updateUser } from "@/services/UserService";
import ProfileEditForm from "@/app/profile/[userId]/_components/ProfileEditForm";
import PageContent from "@/components/PageContent";
import { isOwnerOrAdmin } from "@/lib/authMiddleware";

export const metadata = {
    title: "Edit Profile | Local Guides",
};

export default async function EditProfile({ params }) {
    // Auth: ensure either admin or owner of profile
    const session = await getSession();
    const authorized = await isOwnerOrAdmin(session, params.userId, "profile");
    if (!authorized) {
        redirect("/?alert=not-authorized-profile");
    }
    // End Auth

    const user = await getUserById(params.userId);

    return (
        <PageContent>
            <ProfileEditForm user={user} />
        </PageContent>
    );
}

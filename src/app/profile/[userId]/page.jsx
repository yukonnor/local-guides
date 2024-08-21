import { getSession } from "@/lib/sessionHandler";
import { isOwnerOrAdmin } from "@/lib/authMiddleware";
import { redirect } from "next/navigation";
import { Col } from "reactstrap";
import UserService from "@/services/UserService";
import GuideService from "@/services/GuideService";
import GuideShareService from "@/services/GuideShareService";
import ProfileSharedGuides from "./_components/ProfileSharedGuides";
import ProfileUserGuides from "./_components/ProfileUserGuides";
import ProfileInfo from "./_components/ProfileInfo";
import ProfileDeleteCard from "./_components/ProfileDeleteCard";
import PageContent from "@/components/PageContent";

export const metadata = {
    title: "Profile | Local Guides",
};

export default async function Profile({ params }) {
    // Auth: ensure either admin or owner of profile
    const session = await getSession();
    const authorized = await isOwnerOrAdmin(session, params.userId, "profile");
    if (!authorized) {
        redirect("/?alert=not-authorized-profile");
    }
    // End Auth

    const user = await UserService.getUserById(params.userId);
    const userGuides = await GuideService.getGuideByAuthorId(params.userId);
    const sharedGuides = await GuideShareService.getGuidesBySharedUserId(params.userId);

    return (
        <PageContent>
            <Col s="9">
                <h1 className="inter-tight-header">{user.username}</h1>
            </Col>
            <ProfileInfo user={user} />
            <ProfileUserGuides userGuides={userGuides} />
            <ProfileSharedGuides sharedGuides={sharedGuides} />
            <ProfileDeleteCard userId={user.id} />
        </PageContent>
    );
}

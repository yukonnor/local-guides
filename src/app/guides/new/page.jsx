import { getSession } from "@/lib/sessionHandler";
import { getPlaceData } from "@/lib/api/googlePlaces";
import { cookies } from "next/headers";
import PageContent from "@/components/PageContent";
import GuideCreateForm from "@/app/guides/_components/GuideCreateForm";

export const metadata = {
    title: "Create Guide | Local Guides",
};

export default async function NewGuidePage({ locality = null, searchParams }) {
    const session = await getSession();
    const localityCookie = cookies().get("locality")?.value;

    // if no locality found in the session, try to pull it from the gpid searchParam
    if (localityCookie) {
        locality = JSON.parse(localityCookie);
    } else if (searchParams.gpid) {
        const googlePlacesId = searchParams.gpid;
        locality = await getPlaceData(googlePlacesId, "locality");
    }

    return (
        <PageContent>
            <GuideCreateForm userId={session.id} locality={locality} />
        </PageContent>
    );
}

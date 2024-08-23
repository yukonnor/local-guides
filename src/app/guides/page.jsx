import { getPlaceData } from "@/lib/api/googlePlaces";
import { cookies } from "next/headers";
import Link from "next/link";
import GuideSearchResults from "@/app/guides/_components/GuideSearchResults";
import LocalitySearch from "@/components/LocalitySearch";
import { getGuidesByLatLong } from "@/services/GuideService";
import { isPublicOrSharedWith } from "@/lib/authMiddleware";
import { getSession } from "@/lib/sessionHandler";
import PageContent from "@/components/PageContent";
import OuterCard from "@/components/OuterCard";
import AlertBox from "@/components/AlertBox";

export const metadata = {
    title: "Guide Results | Local Guides",
};

export default async function Guides({ locality = null, searchParams }) {
    const session = await getSession();
    let guides = null;
    let localityCookie = cookies().get("locality")?.value;
    let invalidPlaceId = false;
    if (localityCookie) localityCookie = JSON.parse(localityCookie);

    // get the gpid query param if there is one:
    const googlePlaceIdParam = searchParams.gpid;

    // if a locality cookie was found, use that as the locality data unless the URL has a new gpid param
    if (localityCookie && (!googlePlaceIdParam || localityCookie.id === googlePlaceIdParam)) {
        locality = localityCookie;
    } else if (searchParams.gpid) {
        // use the new gpid to set the locality
        locality = await getPlaceData(googlePlaceIdParam, "locality");
        if (!locality) invalidPlaceId = true; // show alert if invalid gpid provided
    }

    // if there is a locality, fetch locality informatin and nearby guides
    if (locality) {
        const lat = locality.location.latitude;
        const long = locality.location.longitude;

        // Fetch user session and guides by locality lat long
        guides = await getGuidesByLatLong(lat, long);

        // Filter guides based on authorization
        const authorizedGuides = await Promise.all(
            guides.map(async (guide) => {
                const authorized = await isPublicOrSharedWith(session, guide.id);
                return authorized ? guide : null;
            })
        );

        // guides is now a filtered set of guides
        guides = authorizedGuides.filter((guide) => guide !== null);
    }

    return (
        <PageContent>
            {locality ? (
                <GuideSearchResults locality={locality} guides={guides} />
            ) : (
                <>
                    {invalidPlaceId && <AlertBox alertType={"invalid-gpid"} path="/guides" />}
                    <div className="no-query">
                        <h1 className="inter-tight-header">Find Guides</h1>
                        <p>
                            Search for a city or town to find guides in that area. Try a search like{" "}
                            <b>San Francisco CA</b> or <b>Berlin Germany</b>.
                        </p>
                        <OuterCard>
                            <LocalitySearch />
                        </OuterCard>
                        <p className="mt-5">
                            See a random guide:{" "}
                            <Link href={"/guides/random"} className="btn btn-primary">
                                Get Random Guide
                            </Link>
                        </p>
                    </div>
                </>
            )}
        </PageContent>
    );
}

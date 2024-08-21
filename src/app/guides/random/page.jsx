import GuideService from "@/services/GuideService";
import { redirect } from "next/navigation";

export default async function RandomGuidePage() {
    let randomGuide;
    let guideFound = false;

    try {
        randomGuide = await GuideService.getRandomGuide();
        guideFound = true;
    } catch (err) {
        console.error(err);
        redirect(`/guides`);
    } finally {
        if (guideFound) redirect(`/guides/${randomGuide.id}`);
    }
}

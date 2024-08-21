import { getSession } from "@/lib/sessionHandler";
import { redirect } from "next/navigation";

export default async function Profile({ params }) {
    const session = await getSession();
    redirect(`/profile/${session.id}`);
}

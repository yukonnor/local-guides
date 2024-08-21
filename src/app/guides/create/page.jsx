import LocalitySearch from "@/components/LocalitySearch";
import AlertBox from "@/components/AlertBox";
import PageContent from "@/components/PageContent";
import OuterCard from "@/components/OuterCard";

export const metadata = {
    title: "Create Guide | Local Guides",
};

export default async function CreateGuidePage({ locality = null, searchParams }) {
    const alertType = searchParams?.alert;

    return (
        <PageContent>
            {alertType && <AlertBox alertType={alertType} path="/guides/create" />}
            <h1 className="inter-tight-header">Create a Guide</h1>
            <OuterCard>
                <LocalitySearch intention="create" />
            </OuterCard>
        </PageContent>
    );
}

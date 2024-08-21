import LocalitySearch from "@/components/LocalitySearch";
import AlertBox from "@/components/AlertBox";
import { Col } from "reactstrap";
import PageContent from "@/components/PageContent";
import OuterCard from "@/components/OuterCard";

export default async function Home({ searchParams }) {
    const alertType = searchParams?.alert;

    return (
        <PageContent>
            {alertType && <AlertBox alertType={alertType} />}

            <div className="text-center mt-4 mx-auto">
                <h1 className="inter-tight-header">local guides</h1>
                <OuterCard>
                    <LocalitySearch />
                </OuterCard>
            </div>
        </PageContent>
    );
}

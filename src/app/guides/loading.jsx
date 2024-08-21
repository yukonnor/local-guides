import OuterCard from "@/components/OuterCard";
import PageContent from "@/components/PageContent";
import { CardBody, CardText } from "reactstrap";

export default function Loading() {
    return (
        <PageContent>
            <OuterCard>
                <CardBody>
                    <CardText className="inter-tight-subheader">Loading...</CardText>
                </CardBody>
            </OuterCard>
        </PageContent>
    );
}

import OuterCard from "@/components/OuterCard";
import Link from "next/link";
import { CardBody, CardTitle, CardText, ListGroup, ListGroupItem } from "reactstrap";

export default function SharedGuides({ sharedGuides }) {
    return (
        <OuterCard>
            <CardBody>
                <CardTitle tag="h5" className="inter-tight-subheader">
                    Guides Shared With You
                </CardTitle>
                {sharedGuides.length ? (
                    <ListGroup>
                        {sharedGuides.map((guide) => (
                            <ListGroupItem key={guide.id}>
                                <Link href={`/guides/${guide.id}`}>{guide.title}</Link>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                ) : (
                    <CardText>
                        No guides shared with you. You can view public guides on the{" "}
                        <Link href={"/guides"}>guides search page</Link>.
                    </CardText>
                )}
            </CardBody>
        </OuterCard>
    );
}

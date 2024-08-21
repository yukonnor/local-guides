import OuterCard from "@/components/OuterCard";
import Link from "next/link";
import { Row, CardBody, CardTitle, CardText, Button } from "reactstrap";

export default function GuideEditCard({ guide }) {
    return (
        <OuterCard className="secondary">
            <CardBody>
                <CardTitle tag="h5" className="inter-tight-subheader">
                    Manage Your Guide
                </CardTitle>
                <Row>
                    <CardText>
                        <Link href={`/guides/${guide.id}/edit`}>
                            <Button color="primary" outline className="me-2">
                                Edit Guide
                            </Button>
                        </Link>
                        <Link href={`/guides/${guide.id}/share`}>
                            <Button color="primary" outline className="me-2">
                                Share Guide
                            </Button>
                        </Link>
                        <Link href={`/guides/${guide.id}/delete`}>
                            <Button color="danger" outline>
                                Delete Guide
                            </Button>
                        </Link>
                    </CardText>
                </Row>
                <Row className="mt-1">
                    {guide.isPrivate ? (
                        <>
                            <CardText>
                                Your guide is <strong>Private</strong>. Only users you share your
                                guide with can see your guide.
                            </CardText>
                        </>
                    ) : (
                        <CardText>
                            Your Guide is <strong>Public</strong>. Your guide shows up in search
                            results and can be seen by anyone.
                        </CardText>
                    )}
                </Row>
            </CardBody>
        </OuterCard>
    );
}

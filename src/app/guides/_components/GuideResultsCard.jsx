"use client";
import Link from "next/link";
import { CardBody, CardTitle, Row, Col, ListGroup } from "reactstrap";
import GuideResult from "./GuideResult";
import OuterCard from "../../../components/OuterCard";

export default function GuideResultsCard({ locality, guides }) {
    return (
        <OuterCard color="light" className="mb-4">
            <CardBody>
                <Row>
                    <Col sm="7">
                        <CardTitle tag="h5" className="inter-tight-subheader">
                            Guides Near {locality.displayName.text}
                        </CardTitle>
                    </Col>
                    <Col sm="5">
                        <span className="float-end">{guides.length} nearby guide(s) found</span>
                    </Col>
                </Row>

                {guides.length > 0 ? (
                    <div className="guide-results">
                        <ListGroup>
                            {guides.map((guide) => (
                                <GuideResult key={guide.id} guide={guide} />
                            ))}
                        </ListGroup>
                    </div>
                ) : (
                    <>
                        <p>
                            No guides gound near {locality.formattedAddress}. Search for a new
                            location or create a new guide for this location!
                        </p>
                        <p>
                            <Link className="nav-link" href={`/guides/new?gpid=${locality.id}`}>
                                Create {locality.displayName.text} Guide?
                            </Link>
                        </p>
                    </>
                )}
            </CardBody>
        </OuterCard>
    );
}

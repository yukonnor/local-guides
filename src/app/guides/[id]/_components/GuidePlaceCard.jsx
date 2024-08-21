"use client";
import InnerCard from "@/components/InnerCard";
import PlaceTag from "../../_components/PlaceTag";
import RecTag from "@/components/RecTag";
import Link from "next/link";
import { Row, Col, CardBody, CardTitle, CardSubtitle, CardText, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faArrowAltCircleRight, faMap } from "@fortawesome/free-regular-svg-icons";
import "../../_styles/Guides.css";

export default function GuidePlaceCard({
    place,
    showEditFeatures,
    handleOpenEditModal,
    handleOpenDeleteModal,
}) {
    return (
        <InnerCard className="GuidePlace mb-3">
            <CardBody>
                <Row>
                    <Col sm="9">
                        <CardTitle tag="h5" className="inter-tight-subheader">
                            {place.displayName.text}
                        </CardTitle>
                    </Col>
                    {showEditFeatures && (
                        <Col sm="3">
                            <Button
                                color="primary"
                                outline
                                className="float-end btn-small"
                                onClick={() => handleOpenEditModal(place)}
                            >
                                Edit
                            </Button>
                            <Button
                                color="danger"
                                outline
                                className="float-end me-2 btn-small"
                                onClick={() => handleOpenDeleteModal(place)}
                            >
                                Delete
                            </Button>
                        </Col>
                    )}
                </Row>

                <CardSubtitle className="mt-0 mb-1">
                    <span className="me-2">
                        <strong className="me-1">My Rec:</strong>
                        <RecTag recType={place.recType} />
                    </span>
                </CardSubtitle>

                <CardSubtitle>
                    <span className="me-2">
                        <strong className="me-1">Tags:</strong>
                        {place.tags.length ? (
                            place.tags.map((tag) => <PlaceTag key={tag.name} label={tag.name} />)
                        ) : showEditFeatures ? (
                            <a
                                href="#"
                                className="nav-link d-inline"
                                onClick={() => handleOpenEditModal(place)}
                            >
                                Add tags
                            </a>
                        ) : (
                            <span>No tags</span>
                        )}
                    </span>
                </CardSubtitle>
                <CardTitle tag={"h6"} className="mt-2">
                    My Description
                </CardTitle>
                <CardText>{place.description}</CardText>

                <Row>
                    <Col sm="9">
                        <CardTitle tag={"h6"}>From Google</CardTitle>
                    </Col>
                    <Col sm="3">
                        <Link
                            href={place.googleMapsUri}
                            target="_blank"
                            className="nav-link float-end google-maps-link"
                        >
                            View On Google <FontAwesomeIcon icon={faArrowAltCircleRight} />
                        </Link>
                    </Col>
                </Row>

                <CardSubtitle>
                    <Row>
                        {place.primaryTypeDisplayName && (
                            <Col xs="auto">
                                {place.primaryTypeDisplayName.text} <FontAwesomeIcon icon={faMap} />{" "}
                            </Col>
                        )}
                        {place.rating && (
                            <Col xs="auto">
                                {place.rating} <FontAwesomeIcon icon={faStar} />
                            </Col>
                        )}
                    </Row>
                </CardSubtitle>
                <CardText>
                    {place.editorialSummary
                        ? place.editorialSummary.text
                        : place.generativeSummary?.overview.text}
                </CardText>
            </CardBody>
        </InnerCard>
    );
}

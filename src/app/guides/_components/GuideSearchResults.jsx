"use client";
import { useState } from "react";
import LocalitySearch from "@/components/LocalitySearch";
import GuideResultsCard from "@/app/guides/_components/GuideResultsCard";
import { Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import Link from "next/link";
import OuterCard from "../../../components/OuterCard";

export default function GuideSearchResults({ locality, guides }) {
    const [showSearchModal, setShowSearchModal] = useState(false);

    const toggleModal = () => setShowSearchModal(!showSearchModal);

    // If no locality returned from Google, render no results message.
    if (locality === undefined) {
        return (
            <div className="no-results">
                <h1>Couldn&apos;t Find City</h1>
                <p>
                    We couldn&apos;t find a city or town for your search. Try a new search like{" "}
                    <b>San Francisco CA</b> or <b>Berlin Germany</b>.
                </p>
                <OuterCard>
                    <LocalitySearch />
                </OuterCard>
                <h2>Random Guides:</h2>
            </div>
        );
    }

    // If locality found, render a locality card
    return (
        <div className="locality-result">
            <Row>
                <Col s="9">
                    <h1 className="inter-tight-header">{locality.displayName.text}</h1>
                    <h5 className="inter-tight-smallheader">{locality.formattedAddress}</h5>
                </Col>

                <Col s="3">
                    <Link
                        href={`/guides/new?gpid=${locality.id}`}
                        className="btn btn-primary float-end"
                    >
                        Create {locality.displayName.text} Guide
                    </Link>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <a className="nav-link" onClick={toggleModal}>
                        Search somewhere else?
                    </a>
                </Col>
            </Row>
            <GuideResultsCard locality={locality} guides={guides} />
            <Modal isOpen={showSearchModal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Update Location Search</ModalHeader>
                <ModalBody>
                    <LocalitySearch closeModal={toggleModal} />
                </ModalBody>
            </Modal>
        </div>
    );
}

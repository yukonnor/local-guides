"use client";
import { useState } from "react";
import { Row, Col, CardBody, CardTitle, Form, Input, Button } from "reactstrap";
import { handleSearchLocality } from "@/app/actions/handleGoogleRequests";
import toast from "react-hot-toast";
import LocalitySearchResultsList from "./LocalitySearchResultsList";

function LocalitySearch({ intention = "find", closeModal }) {
    const INITIAL_STATE = { search: "" };
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [searchLoading, setSearchLoading] = useState(false);
    const [localityResults, setLocalityResults] = useState([]);

    // Search for Localities from the Google Maps API
    const handleSearch = async (evt) => {
        evt.preventDefault();
        setSearchLoading(true);

        const { search } = formData;

        if (!search) {
            toast.error("Please enter a search term.");
            setSearchLoading(false);
            return;
        }

        // Perform locality search on Google Places API
        try {
            const localityResults = await handleSearchLocality(search);
            if (localityResults.length === 0) {
                toast.error("Couldn't find that city. Try new search or try again later.");
                setSearchLoading(false);
            } else {
                setLocalityResults(localityResults);
                setSearchLoading(false);
            }
        } catch (error) {
            setSearchLoading(false);
            console.error("Error searching localities:", error);
            toast.error("Coundn't fetch cities from Google. Please try again later.");
        }
    };

    /* Update local state w/ current state of input element */

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((fData) => ({
            ...fData,
            [name]: value,
        }));
    };

    return (
        <CardBody className="mb-3">
            <CardTitle tag="h5" className="inter-tight-subheader">
                Search For a City to {intention === "find" ? "Find Guides" : "Create a Guide"}
            </CardTitle>
            <Form onSubmit={handleSearch}>
                <Row className="mt-3">
                    <Col xs="8">
                        <Input
                            id="search"
                            name="search"
                            type="text"
                            placeholder="Search for a city..."
                            onChange={handleChange}
                        />
                    </Col>
                    <Col xs="4">
                        <Button
                            disabled={searchLoading}
                            color="primary"
                            className="w-100"
                            type="submit"
                        >
                            {searchLoading ? "Searching..." : "Search"}
                        </Button>
                    </Col>
                </Row>
            </Form>
            {localityResults.length > 0 && (
                <LocalitySearchResultsList
                    localityResults={localityResults}
                    intention={intention}
                    closeModal={closeModal}
                />
            )}
        </CardBody>
    );
}

export default LocalitySearch;

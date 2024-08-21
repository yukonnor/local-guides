"use client";
import { useState } from "react";
import Link from "next/link";
import { handleSearchPlace } from "@/app/actions/handleGoogleRequests";
import toast from "react-hot-toast";
import { Row, Col, CardBody, CardTitle, Form, FormGroup, Input, Button } from "reactstrap";
import OuterCard from "@/components/OuterCard";
import PlaceAddResultsList from "./PlaceAddResultsList";
import PlaceAddCard from "./PlaceAddCard";

export default function PlaceAddForm({ guide }) {
    const [searchLoading, setSearchLoading] = useState(false);
    const [placeResults, setPlaceResults] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [formData, setFormData] = useState({});

    // Handle form field values
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Search for Places from the Google Maps API
    const handleSearch = async (evt) => {
        evt.preventDefault();
        setSearchLoading(true);

        const { placeSearch } = formData;

        if (!placeSearch) {
            toast.error("Please enter a search term.");
            setSearchLoading(false);
            return;
        }

        // Perform place search on Google Places API
        try {
            const placeResults = await handleSearchPlace(
                placeSearch,
                guide.latitude,
                guide.longitude
            );
            if (placeResults.length === 0) {
                toast.error("Couldn't find place. Try new search or try again later.");
            } else {
                setPlaceResults(placeResults);
            }
        } catch (error) {
            console.error("Error searching places:", error);
            throw new Error("Coundn't fetch places from Google. Please try again later.");
        }

        setSearchLoading(false);
    };

    function handlePlaceSelection(place) {
        setSelectedPlace(place);
    }

    return (
        <>
            {!selectedPlace ? (
                <Link href={`/guides/${guide.id}`} className="nav-link mb-2">
                    {"< "}Go Back
                </Link>
            ) : (
                <Button color="link" className="mt-2 mb-2" onClick={() => setSelectedPlace(null)}>
                    {"< "}Go Back
                </Button>
            )}

            <OuterCard>
                <CardBody>
                    <CardTitle tag="h5" className="inter-tight-subheader">
                        Add a place to your guide
                    </CardTitle>
                    {!selectedPlace && (
                        <Form onSubmit={handleSearch}>
                            <Row>
                                <Col xs="9">
                                    <FormGroup>
                                        <Input
                                            id="placeSearch"
                                            name="placeSearch"
                                            placeholder={`Search for a place...`}
                                            type="text"
                                            value={formData.placeSearch || ""}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xs="3">
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
                    )}
                    {!selectedPlace && placeResults.length > 0 && (
                        <PlaceAddResultsList
                            placeResults={placeResults}
                            handlePlaceSelection={handlePlaceSelection}
                        />
                    )}
                    {selectedPlace && (
                        <PlaceAddCard guideId={guide.id} selectedPlace={selectedPlace} />
                    )}
                </CardBody>
            </OuterCard>
        </>
    );
}

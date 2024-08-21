"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CardTitle, CardBody, Button, Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import { handleDeletePlace } from "@/app/actions/guides/places/handleDeletePlace";
import { handleEditPlace, getTagSuggestions } from "@/app/actions/guides/places/handleEditPlace";
import OuterCard from "@/components/OuterCard";
import PlaceEditForm from "@/app/guides/[id]/_components/PlaceEditForm";
import PlaceDeleteForm from "@/app/guides/[id]/_components/PlaceDeleteForm";
import GuidePlaceCard from "./GuidePlaceCard";
import GuidePlaceSortFilter from "./GuidePlaceSortFilter";
import "../_styles/GuidePlaces.css";

const recTypeOrder = {
    dontmiss: 1,
    recommend: 2,
    iftime: 3,
    avoid: 4,
};

function getDistinctTags(places) {
    const allTags = places.flatMap((place) => place.tags.map((tag) => tag.name));
    const distinctTagsSet = new Set(allTags);
    return [...distinctTagsSet].sort();
}

export default function GuidePlaces({ guide, places, showEditFeatures }) {
    const [placesState, setPlacesState] = useState(places);
    const [placeToEdit, setPlaceToEdit] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sort, setSort] = useState("rec");
    const [filter, setFilter] = useState("");
    const [tagSuggestions, setTagSuggestions] = useState([]); // list of all possible tags
    const [distinctGuideTags, setDistinctGuideTags] = useState([]); // list of all distinct tags found on the guide's places
    const [placeTags, setPlaceTags] = useState([]); // list of tags assoicated with the placeToEdit

    // Set / update list of all tags shown on guide to set which tags can be filtered for
    useEffect(() => {
        setDistinctGuideTags(getDistinctTags(placesState));
    }, [placesState]);

    const toggleEditModal = () => setShowEditModal(!showEditModal);
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

    const handleOpenEditModal = async (place) => {
        // map the place's tags into the tag input's expected format
        const tagsForInput = place.tags.map((tag) => ({ value: tag.id, label: tag.name }));
        setPlaceTags(tagsForInput);
        // get tag suggestions from server
        setTagSuggestions(await getTagSuggestions());

        setPlaceToEdit(place);
        toggleEditModal();
    };

    const handleOpenDeleteModal = async (place) => {
        setPlaceToEdit(place);
        toggleDeleteModal();
    };

    const handleEditPlaceSubmit = async (placeId, formData) => {
        // Update db via server action
        try {
            const editedPlace = await handleEditPlace(placeId, formData);

            if (!editedPlace) throw new Error("Error updating place:");

            setPlacesState((placesState) =>
                placesState.map((place) =>
                    place.id === editedPlace.id ? { ...place, ...editedPlace } : place
                )
            );
            toast.success(`Updated place!`);
            toggleEditModal();
        } catch (err) {
            console.error("Error updating place:", err);
            toast.error("Error updating place. Try again later.");
        }
    };

    const handleDeletePlaceSubmit = async (placeId, formData) => {
        // Update db via server action
        try {
            const deletedPlace = await handleDeletePlace(placeId);

            if (!deletedPlace) throw new Error("Error deleting place:");

            setPlacesState((placesState) =>
                placesState.filter((place) => place.id !== deletedPlace.id)
            );
            toast.success(`Deleted place!`);
            toggleDeleteModal();
        } catch (err) {
            console.error("Error deleting place:", err);
            toast.error("Error deleting place. Try again later.");
        }
    };

    // Memoize sorted and filtered places
    // TODO: Research how this works.
    const sortedPlaces = useMemo(() => {
        let sorted = [...placesState];
        if (filter) {
            sorted = sorted.filter((place) => place.tags.some((tag) => tag.name === filter));
        }
        if (sort === "rec") {
            return sorted.sort((a, b) => recTypeOrder[a.recType] - recTypeOrder[b.recType]);
        } else if (sort === "rating") {
            return sorted.sort((a, b) => b.rating - a.rating);
        }
        return sorted;
    }, [placesState, sort, filter]);

    return (
        <>
            <OuterCard>
                <CardBody>
                    <Row>
                        <Col>
                            <CardTitle tag="h5" className="inter-tight-subheader">
                                Places
                            </CardTitle>
                        </Col>
                        {showEditFeatures && (
                            <Col>
                                <Link
                                    href={`/guides/${guide.id}/places/add`}
                                    className="btn btn-primary float-end"
                                >
                                    Add Place
                                </Link>
                            </Col>
                        )}
                    </Row>

                    {placesState.length === 0 ? (
                        <div>
                            {showEditFeatures ? (
                                <>
                                    <p>Let&apos;s add some places to your guide!</p>
                                    <Link href={`/guides/${guide.id}/places/add`}>
                                        <Button color="primary">Add Place</Button>
                                    </Link>
                                </>
                            ) : (
                                <p>This guide doesn&apos;t have any places yet...</p>
                            )}
                        </div>
                    ) : (
                        <GuidePlaceSortFilter
                            sort={sort}
                            setSort={setSort}
                            filter={filter}
                            setFilter={setFilter}
                            distinctGuideTags={distinctGuideTags}
                        />
                    )}

                    <div className="places">
                        {sortedPlaces.map((place) => (
                            <GuidePlaceCard
                                key={place.id}
                                place={place}
                                showEditFeatures={showEditFeatures}
                                handleOpenEditModal={handleOpenEditModal}
                                handleOpenDeleteModal={handleOpenDeleteModal}
                            />
                        ))}
                    </div>
                </CardBody>
            </OuterCard>

            <Modal isOpen={showEditModal} toggle={toggleEditModal}>
                <ModalHeader toggle={toggleEditModal}>{placeToEdit?.displayName.text}</ModalHeader>
                <ModalBody>
                    <PlaceEditForm
                        guideId={guide.id}
                        place={placeToEdit}
                        handleEditPlaceSubmit={handleEditPlaceSubmit}
                        placeTags={placeTags}
                        tagSuggestions={tagSuggestions}
                    />
                </ModalBody>
            </Modal>

            <Modal isOpen={showDeleteModal} toggle={toggleDeleteModal}>
                <ModalHeader toggle={toggleDeleteModal}>
                    {placeToEdit?.displayName.text}
                </ModalHeader>
                <ModalBody>
                    <PlaceDeleteForm
                        guideId={guide.id}
                        place={placeToEdit}
                        handleDeletePlaceSubmit={handleDeletePlaceSubmit}
                    />
                </ModalBody>
            </Modal>
        </>
    );
}

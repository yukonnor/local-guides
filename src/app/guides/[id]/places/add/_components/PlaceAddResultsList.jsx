"use client";
import { ListGroup, ListGroupItem } from "reactstrap";

export default function PlaceAddResultsList({ placeResults, handlePlaceSelection }) {
    return (
        <>
            <h5 className="inter-tight-subheader mt-3">Select a place to add:</h5>
            <ListGroup>
                {placeResults.map((place) => (
                    <ListGroupItem
                        key={place.id}
                        onClick={() => handlePlaceSelection(place)}
                        action
                    >
                        {place.displayName.text}
                    </ListGroupItem>
                ))}
            </ListGroup>
            <p className="mt-2">
                Not seeing the place you&apos;re looking for? Try a more specific search and/or make
                sure it within driving distance of your guide&apos;s location.
            </p>
        </>
    );
}

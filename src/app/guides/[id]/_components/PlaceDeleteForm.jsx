"use client";
import { CardBody, CardTitle, Form, FormGroup, FormText } from "reactstrap";
import SubmitFormButton from "../../../../components/SubmitFormButton";

export default function PlaceDeleteForm({ place, placeName, handleDeletePlaceSubmit }) {
    // Handle form submitssion
    const handleFormSubmit = async (evt) => {
        evt.preventDefault();

        // Send place id and formData to parent for processing
        handleDeletePlaceSubmit(place.id);
    };

    return (
        <CardBody>
            <CardTitle>
                <h5 className="inter-tight-subheader">{placeName}</h5>
            </CardTitle>

            <Form onSubmit={handleFormSubmit}>
                <FormGroup>
                    <FormText>
                        Want to remove this place from your guide? Careful. This can&apos;t be
                        undone.
                    </FormText>
                </FormGroup>
                <SubmitFormButton label="Delete Place" loading="Deleting..." color="danger" />
            </Form>
        </CardBody>
    );
}

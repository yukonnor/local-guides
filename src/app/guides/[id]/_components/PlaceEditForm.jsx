"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import PlaceTagField from "./PlaceTagField";
import SubmitFormButton from "../../../../components/SubmitFormButton";

export default function PlaceEditForm({
    place,
    placeName,
    handleEditPlaceSubmit,
    placeTags,
    tagSuggestions,
}) {
    const [formData, setFormData] = useState({
        description: place.description,
        recType: place.recType,
    });
    const [formTags, setFormTags] = useState(placeTags);

    // Handle form field values
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Handle form submitssion
    const handleFormSubmit = async (evt) => {
        evt.preventDefault();

        // Add tags to formData
        formData["tags"] = formTags;

        // Send place id and formData to parent for processing
        handleEditPlaceSubmit(place.id, formData);
    };

    return (
        <CardBody>
            <CardTitle>
                <h5 className="inter-tight-subheader">{placeName}</h5>
            </CardTitle>

            <Form onSubmit={handleFormSubmit}>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                        id="description"
                        name="description"
                        placeholder="Describe this place. Why is it on your guide?"
                        type="text"
                        value={formData.description || ""}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup tag="fieldset">
                    <Label>How strongly do you recommend?</Label>
                    <FormGroup check>
                        <Input
                            id="dontmiss"
                            name="recType"
                            value="dontmiss"
                            type="radio"
                            checked={formData.recType === "dontmiss"}
                            onChange={handleChange}
                        />{" "}
                        <Label check>Don&apos;t miss it!</Label>
                    </FormGroup>
                    <FormGroup check>
                        <Input
                            id="recommend"
                            name="recType"
                            value="recommend"
                            type="radio"
                            checked={!formData.recType || formData.recType === "recommend"}
                            onChange={handleChange}
                        />{" "}
                        <Label check>Recommend</Label>
                    </FormGroup>
                    <FormGroup check>
                        <Input
                            id="iftime"
                            name="recType"
                            value="iftime"
                            type="radio"
                            checked={formData.recType === "iftime"}
                            onChange={handleChange}
                        />{" "}
                        <Label check>If you have time</Label>
                    </FormGroup>
                    <FormGroup check>
                        <Input
                            id="avoid"
                            name="recType"
                            value="avoid"
                            type="radio"
                            checked={formData.recType === "avoid"}
                            onChange={handleChange}
                        />{" "}
                        <Label check>Avoid it!</Label>
                    </FormGroup>
                </FormGroup>
                <FormGroup>
                    <Label>Tags</Label>
                    <PlaceTagField
                        placeTags={placeTags}
                        setFormTags={setFormTags}
                        tagSuggestions={tagSuggestions}
                    />
                </FormGroup>
                <SubmitFormButton label="Edit Place" loading="Editing..." />
            </Form>
        </CardBody>
    );
}

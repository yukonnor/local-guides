"use client";
import { useState } from "react";
import { CardBody, CardTitle, Form, FormGroup, Label, Input } from "reactstrap";
import { handleAddPlace } from "@/app/actions/guides/places/handleAddPlace";
import SubmitFormButton from "@/components/SubmitFormButton";
import InnerCard from "@/components/InnerCard";

export default function PlaceAddCard({ guideId, selectedPlace }) {
    const handleAddPlaceWithIds = handleAddPlace.bind(null, guideId, selectedPlace.id);
    const [formData, setFormData] = useState({});

    // Handle form field values
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <InnerCard>
            <CardBody>
                <CardTitle>
                    <h5 className="inter-tight-subheader">{selectedPlace.displayName.text}</h5>
                </CardTitle>

                <Form action={handleAddPlaceWithIds}>
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
                    <SubmitFormButton label="Add Place to Guide" loading="Adding..." />
                </Form>
            </CardBody>
        </InnerCard>
    );
}

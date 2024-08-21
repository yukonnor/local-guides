"use client";
import { useState } from "react";
import Link from "next/link";
import { CardBody, CardTitle, Form, FormGroup, FormText, Label, Input, Button } from "reactstrap";
import { handleEditGuide } from "@/app/actions/guides/handleEditGuide";
import SubmitFormButton from "@/components/SubmitFormButton";
import OuterCard from "@/components/OuterCard";

export default function GuideEditForm({ guide }) {
    const handleEditGuideWithId = handleEditGuide.bind(null, guide.id);

    const [formData, setFormData] = useState({
        title: guide.title,
        description: guide.description,
        isPrivate: guide.isPrivate,
    });
    const [privateToggle, setPrivateToggle] = useState(guide.isPrivate);

    // Handle form field values
    const handleChange = (evt) => {
        let { name, value } = evt.target;
        if (name === "isPrivate") {
            value = !privateToggle;
            setPrivateToggle(!privateToggle);
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <>
            <Link href={`/guides/${guide.id}`}>
                <Button color="link" className="mt-2 mb-2">
                    {"< "}Go Back
                </Button>
            </Link>
            <OuterCard>
                <CardBody>
                    <CardTitle tag="h5" className="inter-tight-subheader">
                        Edit Your Guide
                    </CardTitle>
                    <Form action={handleEditGuideWithId}>
                        <FormGroup>
                            <Label for="title">Guide Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter a title for your guide..."
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                placeholder="Enter a description for your guide..."
                                type="textarea"
                                value={formData.description || ""}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup switch>
                            <Input
                                id="isPrivate"
                                name="isPrivate"
                                type="switch"
                                checked={privateToggle}
                                onClick={() => {
                                    setPrivateToggle(!privateToggle);
                                }}
                                onChange={handleChange}
                            />
                            <Label check>Make guide private</Label>
                        </FormGroup>
                        <FormGroup>
                            <FormText>
                                Private guides can be shared with friends but they won&apos;t appear
                                in search results. You can always change this later!
                            </FormText>
                        </FormGroup>
                        <SubmitFormButton label="Edit Guide" loading="Editing..." />
                    </Form>
                </CardBody>
            </OuterCard>
        </>
    );
}

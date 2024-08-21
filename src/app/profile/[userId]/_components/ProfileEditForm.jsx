"use client";
import { useState } from "react";
import Link from "next/link";
import { CardBody, CardTitle, Form, FormGroup, FormText, Label, Input, Button } from "reactstrap";
import { handleUserEdit } from "@/app/actions/profile/handleUserEdit";
import SubmitFormButton from "@/components/SubmitFormButton";
import OuterCard from "@/components/OuterCard";

export default function ProfileEditForm({ user }) {
    const handleUserEditWithId = handleUserEdit.bind(null, user.id);
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
    });

    // Handle form field values
    const handleChange = (evt) => {
        let { name, value } = evt.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <>
            <Link href={`/profile/${user.id}`}>
                <Button color="link" className="mt-2 mb-2">
                    {"< "}Go Back
                </Button>
            </Link>
            <OuterCard
                color="light"
                style={{
                    width: "80%",
                }}
                className="mb-3"
            >
                <CardBody>
                    <CardTitle tag="h5" className="inter-tight-subheader">
                        Edit Profile
                    </CardTitle>
                    <Form action={handleUserEditWithId}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormText>Note: Passwords cannot be editted at this time.</FormText>
                        </FormGroup>
                        <SubmitFormButton label="Edit Profile" loading="Editing..." />
                    </Form>
                </CardBody>
            </OuterCard>
        </>
    );
}

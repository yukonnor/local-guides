"use client";
import { useState } from "react";
import Link from "next/link";
import { CardBody, CardTitle, Form, FormGroup, Label, Input, FormText, Button } from "reactstrap";
import { toast } from "react-hot-toast";
import { handleShareGuide, handleDeleteShare } from "@/app/actions/guides/handleGuideShares";
import SubmitFormButton from "@/components/SubmitFormButton";
import OuterCard from "@/components/OuterCard";
import GuideSharesCard from "./GuideSharesCard";

export default function GuideShareForm({ guide, guideShares }) {
    const [shares, setShares] = useState(guideShares);
    const [formData, setFormData] = useState({ email: "" });

    // Handle form field values
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Using onSubmit as user stays on this page after adding share
    const handleSubmit = async (evt) => {
        evt.preventDefault(); // Prevent the default form submission
        const { email } = formData;

        try {
            const newShare = await handleShareGuide(guide.id, email);
            setShares([...shares, newShare]);
            toast.success("Added email to share list.");
            setFormData({ email: "" });
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Handle delete of guide share
    const handleDelete = async (share) => {
        try {
            const deletedShare = await handleDeleteShare(guide.id, share.id);

            // if share successfully removed, show toast and update state
            toast.success("Removed email from share list.");
            setShares((prevShares) => prevShares.filter((share) => share.id !== deletedShare.id));
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <Link href={`/guides/${guide.id}`}>
                <Button color="link" className="nav-link mt-2 mb-2">
                    {"< "}Go Back
                </Button>
            </Link>
            <OuterCard>
                <CardBody>
                    <CardTitle tag="h5" className="inter-tight-subheader">
                        Share Your Guide?
                    </CardTitle>

                    <Form onSubmit={handleSubmit}>
                        <FormText>
                            Enter the email address of someone you want to share your guide with.
                            They will then need to register an account with that email address to
                            see your guide.
                        </FormText>
                        <FormGroup className="mt-3">
                            <Label for="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="abc@example.com"
                                type="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <SubmitFormButton label="Share Guide" loading="Sharing..." />
                    </Form>
                </CardBody>
            </OuterCard>
            <GuideSharesCard shares={shares} handleDelete={handleDelete} />
        </>
    );
}

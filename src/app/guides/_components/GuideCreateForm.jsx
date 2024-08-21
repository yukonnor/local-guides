"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleGuideCreate } from "@/app/actions/guides/handleGuideCreate";
import { CardBody, CardTitle, Form, FormGroup, FormText, Label, Input, Button } from "reactstrap";
import SubmitFormButton from "@/components/SubmitFormButton";
import OuterCard from "@/components/OuterCard";

export default function GuideCreateForm({ userId, locality }) {
    const router = useRouter();
    const [privateToggle, setPrivateToggle] = useState(true);

    // if no locality provided, redirect to /guides/create page to let user start over
    if (!locality) {
        router.push("/guides/create?alert=no-locality");
        return;
    }

    const handleGuideCreateWithId = handleGuideCreate.bind(null, userId, locality.id);

    return (
        <>
            <Link href={"/guides/create"} className="nav-link">
                <Button color="link" className="nav-link mt-2 mb-2">
                    {"<"} Create a guide somewhere else?
                </Button>
            </Link>
            <OuterCard>
                <CardBody>
                    <CardTitle tag="h5">
                        Let&apos;s create a guide for {locality.displayName.text}
                    </CardTitle>
                    <Form action={handleGuideCreateWithId} aria-label="form">
                        <FormGroup>
                            <Label for="title">Guide Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter a title for your guide..."
                                type="text"
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
                                onChange={() => {
                                    setPrivateToggle(!privateToggle);
                                }}
                            />
                            <Label for="isPrivate" check>
                                Make guide private
                            </Label>
                        </FormGroup>
                        <FormGroup>
                            <FormText>
                                Private guides can be shared with friends but they won&apos;t appear
                                in search results. You can always change this later!
                            </FormText>
                        </FormGroup>
                        <SubmitFormButton label="Create Guide" loading="Creating..." />
                    </Form>
                </CardBody>
            </OuterCard>
        </>
    );
}

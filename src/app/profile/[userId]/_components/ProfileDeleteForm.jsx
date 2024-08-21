"use client";
import Link from "next/link";
import { CardBody, CardTitle, Form, FormText, Button, FormGroup } from "reactstrap";
import { handleUserDelete } from "@/app/actions/profile/handleUserDelete";
import SubmitFormButton from "@/components/SubmitFormButton";
import OuterCard from "@/components/OuterCard";

export default function ProfileDeleteForm({ userId }) {
    const handleUserDeleteWithId = handleUserDelete.bind(null, userId);

    return (
        <>
            <Link href={`/profile/${userId}`}>
                <Button color="link" className="nav-link mt-2 mb-2">
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
                        Delete your profile?
                    </CardTitle>
                    <Form action={handleUserDeleteWithId}>
                        <FormGroup>
                            <FormText>
                                Are you sure your want to delete your profile? This cannot be
                                undone! Your profile and all of your guides will be permanently
                                deleted.
                            </FormText>
                        </FormGroup>

                        <SubmitFormButton
                            label="Delete Profile"
                            loading="Deleting..."
                            color="danger"
                        />
                    </Form>
                </CardBody>
            </OuterCard>
        </>
    );
}

"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CardBody, CardTitle, Form, FormText, Button, FormGroup } from "reactstrap";
import { handleDeleteGuide } from "@/app/actions/guides/handleDeleteGuide";
import SubmitFormButton from "@/components/SubmitFormButton";
import OuterCard from "@/components/OuterCard";

export default function GuideDeleteForm({ guide }) {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
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
                        Delete Your Guide?
                    </CardTitle>
                    <Form action={() => handleDeleteGuide(guide.id)}>
                        <FormGroup>
                            <FormText>
                                Are you sure your want to delete your <strong>{guide.title}</strong>{" "}
                                guide? This can&apos;t be undone.
                            </FormText>
                        </FormGroup>
                        <SubmitFormButton
                            label="Delete Guide"
                            loading="Deleting..."
                            color="danger"
                        />
                    </Form>
                </CardBody>
            </OuterCard>
        </>
    );
}

"use client";
import Link from "next/link";
import OuterCard from "@/components/OuterCard";
import { CardBody, CardTitle, CardText, Button } from "reactstrap";

export default function ProfileDeleteCard({ userId }) {
    return (
        <OuterCard>
            <CardBody>
                <CardTitle tag="h5" className="inter-tight-subheader">
                    Danger Zone
                </CardTitle>

                <CardText>
                    <Link href={`/profile/${userId}/delete`}>
                        <Button color="danger" outline>
                            Delete Account
                        </Button>
                    </Link>
                </CardText>
            </CardBody>
        </OuterCard>
    );
}

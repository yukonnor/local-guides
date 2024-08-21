"use client";
import OuterCard from "@/components/OuterCard";
import Link from "next/link";
import { CardBody, CardTitle, CardText, ListGroup, ListGroupItem } from "reactstrap";

export default function ProfileUserGuides({ userGuides }) {
    return (
        <OuterCard>
            <CardBody>
                <CardTitle tag="h5" className="inter-tight-subheader">
                    Your Guides
                </CardTitle>
                {userGuides.length ? (
                    <ListGroup>
                        {userGuides.map((guide) => (
                            <ListGroupItem key={guide.id}>
                                <Link href={`/guides/${guide.id}`}>{guide.title}</Link>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                ) : (
                    <CardText>
                        You haven&apos;t made any guides. You can create a guide by searching for a
                        city or town on the <Link href={"/guides"}>guides search page</Link>.
                    </CardText>
                )}
            </CardBody>
        </OuterCard>
    );
}

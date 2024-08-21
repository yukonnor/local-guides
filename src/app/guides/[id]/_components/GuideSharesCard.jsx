"use client";
import { CardBody, CardTitle, CardText, Button, ListGroup, ListGroupItem } from "reactstrap";
import OuterCard from "../../../../components/OuterCard";

export default function GuideSharesCard({ shares, handleDelete }) {
    return (
        <OuterCard>
            <CardBody>
                <CardTitle tag="h5" className="inter-tight-subheader">
                    Your Guide is Shared With
                </CardTitle>
                {shares.length ? (
                    <ListGroup>
                        {shares.map((share) => (
                            <ListGroupItem key={share.email}>
                                {share.email}
                                <Button
                                    className="float-end ms-3"
                                    color="danger"
                                    outline
                                    onClick={() => handleDelete(share)}
                                >
                                    Remove Share
                                </Button>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                ) : (
                    <CardText>Add an email address above to share your guide.</CardText>
                )}
            </CardBody>
        </OuterCard>
    );
}

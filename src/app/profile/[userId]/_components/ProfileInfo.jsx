import OuterCard from "@/components/OuterCard";
import Link from "next/link";
import { Row, Col, CardBody, CardTitle, ListGroup, ListGroupItem } from "reactstrap";

export default function ProfileInfo({ user }) {
    return (
        <OuterCard>
            <CardBody>
                <Row className="mb-3">
                    <Col>
                        <CardTitle tag="h5" className="inter-tight-subheader">
                            Your Information
                        </CardTitle>
                    </Col>
                    <Col>
                        <Link
                            href={`/profile/${user.id}/edit`}
                            className="btn btn-primary float-end"
                        >
                            Edit
                        </Link>
                    </Col>
                </Row>
                <ListGroup>
                    <ListGroupItem>
                        Username: <strong>{user.username}</strong>
                    </ListGroupItem>
                    <ListGroupItem>
                        Email: <strong>{user.email}</strong>
                    </ListGroupItem>
                </ListGroup>
            </CardBody>
        </OuterCard>
    );
}

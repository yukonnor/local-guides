"use client";
import OuterCard from "@/components/OuterCard";
import PageContent from "@/components/PageContent";
import { CardBody, CardHeader, CardText } from "reactstrap";

export default function Error({ error }) {
    return (
        <PageContent>
            <OuterCard className="error">
                <CardHeader className="inter-tight-subheader" style={{ color: "#f13c1f" }}>
                    Something Went Wrong :/
                </CardHeader>
                <CardBody>
                    <CardText>{error.message}</CardText>
                    <CardText>Devs: See logs for more details.</CardText>
                </CardBody>
            </OuterCard>
        </PageContent>
    );
}

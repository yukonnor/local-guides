"use client";
import { Col } from "reactstrap";

export default function PageContent({ children }) {
    return (
        <Col xs="11" md="10" lg="8" xl="7" className="PageContent mt-4 mx-auto">
            {children}
        </Col>
    );
}

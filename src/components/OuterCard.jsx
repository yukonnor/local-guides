"use client";
import { Card } from "reactstrap";

export default function OuterCard({ className, children }) {
    return <Card className={`OuterCard mb-3 ${className}`}>{children}</Card>;
}

"use client";
import { Card } from "reactstrap";

export default function InnerCard({ className, children }) {
    return <Card className={`InnerCard ${className}`}>{children}</Card>;
}

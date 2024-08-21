"use client";
import { useFormStatus } from "react-dom";
import { Button } from "reactstrap";

export default function SubmitFormButton({ label, loading, color = "primary" }) {
    const { pending } = useFormStatus();

    return (
        <Button disabled={pending} color={color} type="submit" className="border-2">
            {pending ? loading : label}
        </Button>
    );
}

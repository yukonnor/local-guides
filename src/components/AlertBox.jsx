"use client";
import { useState } from "react";
import { Alert } from "reactstrap";
import { useRouter } from "next/navigation";

export default function AlertBox({ alertType, path = "/" }) {
    const router = useRouter();
    const [visible, setVisible] = useState(true);

    const onDismiss = () => {
        setVisible(false);
        router.replace(path, undefined, { shallow: true });
    };

    let color;
    let message;

    if (!alertType) return;

    switch (alertType) {
        case "not-authorized":
            color = "danger";
            message = "🔒 You need to be logged in to view that page.";
            break;
        case "not-authorized-profile":
            color = "danger";
            message = "🔒 Unable to view that profile.";
            break;
        case "not-authorized-guide":
            color = "danger";
            message = "🔒 Unable to view that guide.";
            break;
        case "already-logged-in":
            color = "info";
            message = "You're already logged in :)";
            break;
        case "no-locality":
            color = "danger";
            message = "A city wasn't selected. To create a guide, first select a city.";
            break;
        case "invalid-gpid":
            color = "danger";
            message = "An invalid Google Place ID was provided. Try a new search below.";
            break;
        // Add more cases as needed
        default:
            break;
    }

    return (
        <Alert color={color} isOpen={visible} toggle={onDismiss} fade>
            {message}
        </Alert>
    );
}

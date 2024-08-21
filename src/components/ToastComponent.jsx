"use client";
import { toast } from "react-hot-toast";
import { removeToastCookie } from "@/app/actions/cookieActions";

export default function ToastComponent({ toastValue }) {
    // Leave if no toast value
    if (!toastValue) return;

    if (toastValue) {
        switch (toastValue.type) {
            case "success":
                toast.success(toastValue.message, { icon: toastValue.icon });
                break;
            case "error":
                toast.error(toastValue.message);
                break;
            case "not-authorized":
                toast.error("You need to be logged in to view that page.", { icon: "🔒" });
                break;
        }

        // Clear the cookie to hide cookie-based toasts
        removeToastCookie();
    }

    return null;
}

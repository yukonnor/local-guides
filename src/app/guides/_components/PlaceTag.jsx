"use client";

export default function PlaceTag({ label, count = null }) {
    return (
        <span className="PlaceTag">
            {label} {count && ` (${count})`}
        </span>
    );
}

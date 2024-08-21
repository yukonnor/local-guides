"use client";

function getRecText(recType) {
    if (recType === "dontmiss") return "Don't Miss It!";
    if (recType === "recommend") return "Recommend";
    if (recType === "iftime") return "If You Have Time";
    if (recType === "avoid") return "Avoid It!";
}

export default function RecTag({ recType }) {
    return <span className={`RecTag ${recType}`}>{getRecText(recType)}</span>;
}

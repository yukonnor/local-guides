"use client";
import Link from "next/link";
import { Badge, ListGroupItem } from "reactstrap";
import PlaceTag from "./PlaceTag";
import "../_styles/Guides.css";

export default function GuideResult({ guide }) {
    return (
        <div className="GuideResult mb-1">
            <Link href={`/guides/${guide.id}`} style={{ textDecoration: "none" }}>
                <ListGroupItem>
                    <h5 className="mb-1 inter-tight-guideresult">
                        {guide.title} {guide.isPrivate ? <PlaceTag label="Private" /> : null}
                    </h5>

                    <div>
                        <span>by {`${guide.author.username} | `}</span>
                        <span># places: {`${guide.places.length}`}</span>

                        {guide.placeTags.length > 0 && (
                            <span>
                                {" | tags: "}
                                {guide.placeTags.map((tag) => (
                                    <PlaceTag
                                        key={tag.tagName}
                                        label={tag.tagName}
                                        count={tag.count}
                                    />
                                ))}
                            </span>
                        )}
                    </div>
                </ListGroupItem>
            </Link>
        </div>
    );
}

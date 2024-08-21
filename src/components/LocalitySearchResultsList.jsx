"use client";
import Link from "next/link";
import { createLocalityCookie } from "@/app/actions/cookieActions";
import { ListGroup, ListGroupItem } from "reactstrap";

export default function LocalitySearchResultsList({ localityResults, intention, closeModal }) {
    async function handleLocalitySelection(locality) {
        // set locality to cookie
        await createLocalityCookie(locality);
        if (closeModal) closeModal();
    }

    return (
        <>
            <h5 className="inter-tight-subheader mt-3">Select a City:</h5>
            <ListGroup>
                {localityResults.map((locality) => (
                    <Link
                        key={locality.id}
                        style={{ textDecoration: "none" }}
                        onClick={async () => await handleLocalitySelection(locality)}
                        href={
                            intention === "create"
                                ? `/guides/new?gpid=${locality.id}`
                                : `/guides?gpid=${locality.id}`
                        }
                    >
                        <ListGroupItem key={locality.id} action>
                            {locality.formattedAddress}
                        </ListGroupItem>
                    </Link>
                ))}
            </ListGroup>
            <p className="mt-2">
                Not seeing the place you&apos;re looking for? Try a more specific search like{" "}
                <strong>San Francisco CA</strong> or <strong>Berlin Germany</strong>.
            </p>
        </>
    );
}

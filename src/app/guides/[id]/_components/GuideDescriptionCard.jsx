import InnerCard from "@/components/InnerCard";
import OuterCard from "@/components/OuterCard";
import Link from "next/link";
import { CardBody, CardTitle } from "reactstrap";

export default function GuideDescriptionCard({ guideId, description, showEditFeatures }) {
    return (
        <OuterCard className="mb-3">
            <CardBody>
                <CardTitle tag="h5" className="inter-tight-subheader">
                    About This Guide
                </CardTitle>

                {description ? (
                    <InnerCard>
                        <CardBody style={{ whiteSpace: "pre-wrap" }}>{description}</CardBody>
                    </InnerCard>
                ) : (
                    <>
                        {showEditFeatures ? (
                            <Link href={`/guides/${guideId}/edit`}>
                                Add a description for your guide
                            </Link>
                        ) : (
                            <p>This guide doesn&apos;t have a description yet...</p>
                        )}
                    </>
                )}
            </CardBody>
        </OuterCard>
    );
}

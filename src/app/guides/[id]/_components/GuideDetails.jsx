"use client";
import GuidePlaces from "./GuidePlaces";
import GuideEditCard from "./GuideEditCard";
import GuideDescriptionCard from "./GuideDescriptionCard";

export default function GuideDetails({ showEditFeatures, guide, places }) {
    return (
        <>
            <h1 className="inter-tight-header">{guide.title}</h1>
            <h5 className="inter-tight-smallheader">by {`${guide.author.username}`}</h5>
            {showEditFeatures && <GuideEditCard guide={guide} />}

            <GuideDescriptionCard
                guideId={guide.id}
                description={guide.description}
                showEditFeatures={showEditFeatures}
            />
            <GuidePlaces guide={guide} showEditFeatures={showEditFeatures} places={places} />
        </>
    );
}

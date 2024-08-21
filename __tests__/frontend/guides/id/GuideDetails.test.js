import { render, screen } from "@testing-library/react";
import GuideDetails from "@/app/guides/[id]/_components/GuideDetails";

// Mock dependencies
jest.mock("@/app/guides/[id]/_components/GuideEditCard.jsx", () => ({ guide }) => (
    <div data-testid="guide-edit-card">{guide.title}</div>
));
jest.mock(
    "@/app/guides/[id]/_components/GuideDescriptionCard",
    () =>
        ({ guideId, description, showEditFeatures }) =>
            (
                <div data-testid="guide-description-card">
                    {description} {showEditFeatures && `Edit features enabled`}
                </div>
            )
);
jest.mock(
    "@/app/guides/[id]/_components/GuidePlaces",
    () =>
        ({ guideId, showEditFeatures, places }) =>
            (
                <div data-testid="guide-places">
                    {places.length} places {showEditFeatures && `Edit features enabled`}
                </div>
            )
);

describe("GuideDetails", () => {
    const guide = {
        id: "1",
        title: "Test Guide",
        author: { username: "testuser" },
        description: "This is a test guide description.",
    };

    const places = [
        { id: "1", name: "Place 1" },
        { id: "2", name: "Place 2" },
    ];

    it("renders guide details without edit features", () => {
        render(<GuideDetails showEditFeatures={false} guide={guide} places={places} />);

        expect(screen.getByText(guide.title)).toBeInTheDocument();
        expect(screen.getByText(`by ${guide.author.username}`)).toBeInTheDocument();
        expect(screen.getByTestId("guide-description-card")).toBeInTheDocument();
        expect(screen.getByTestId("guide-places")).toBeInTheDocument();

        expect(screen.queryByTestId("guide-edit-card")).not.toBeInTheDocument();
    });

    it("renders guide details with edit features", () => {
        render(<GuideDetails showEditFeatures={true} guide={guide} places={places} />);

        expect(screen.getAllByText(guide.title).length).toBeGreaterThan(0);
        expect(screen.getByText(`by ${guide.author.username}`)).toBeInTheDocument();
        expect(screen.getByTestId("guide-edit-card")).toBeInTheDocument();
        expect(screen.getByTestId("guide-description-card")).toBeInTheDocument();
        expect(screen.getByTestId("guide-places")).toBeInTheDocument();
    });

    it("passes the correct props to GuideDescriptionCard", () => {
        render(<GuideDetails showEditFeatures={true} guide={guide} places={places} />);

        const descriptionCard = screen.getByTestId("guide-description-card");
        expect(descriptionCard).toHaveTextContent(guide.description);
        expect(descriptionCard).toHaveTextContent("Edit features enabled");
    });

    it("passes the correct props to GuidePlaces", () => {
        render(<GuideDetails showEditFeatures={true} guide={guide} places={places} />);

        const placesComponent = screen.getByTestId("guide-places");
        expect(placesComponent).toHaveTextContent(`${places.length} places`);
        expect(placesComponent).toHaveTextContent("Edit features enabled");
    });
});

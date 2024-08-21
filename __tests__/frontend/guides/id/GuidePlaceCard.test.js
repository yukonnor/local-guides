import { render, screen, fireEvent } from "@testing-library/react";
import GuidePlaceCard from "@/app/guides/[id]/_components/GuidePlaceCard";

describe("GuidePlaceCard", () => {
    const place = {
        displayName: { text: "Test Place" },
        recType: "dontmiss",
        tags: [{ name: "Nature" }, { name: "Hiking" }],
        description: "This is a test place description.",
        googleMapsUri: "http://maps.google.com/?q=Test+Place",
        primaryTypeDisplayName: { text: "Park" },
        rating: 4.5,
        editorialSummary: { text: "This is an editorial summary." },
        generativeSummary: { overview: { text: "This is a generative summary." } },
    };

    const handleOpenEditModal = jest.fn();
    const handleOpenDeleteModal = jest.fn();

    it("renders GuidePlaceCard with all provided place details", () => {
        render(
            <GuidePlaceCard
                place={place}
                showEditFeatures={false}
                handleOpenEditModal={handleOpenEditModal}
                handleOpenDeleteModal={handleOpenDeleteModal}
            />
        );

        expect(screen.getByText("Test Place")).toBeInTheDocument();
        expect(screen.getByText("My Rec:")).toBeInTheDocument();
        expect(screen.getByText("Don't Miss It!")).toBeInTheDocument();
        expect(screen.getByText("Tags:")).toBeInTheDocument();
        expect(screen.getByText("Nature")).toBeInTheDocument();
        expect(screen.getByText("Hiking")).toBeInTheDocument();
        expect(screen.getByText("My Description")).toBeInTheDocument();
        expect(screen.getByText("This is a test place description.")).toBeInTheDocument();
        expect(screen.getByText("From Google")).toBeInTheDocument();
        expect(screen.getByText("View On Google")).toBeInTheDocument();
        expect(screen.getByText("Park")).toBeInTheDocument();
        expect(screen.getByText("4.5")).toBeInTheDocument();
        expect(screen.getByText("This is an editorial summary.")).toBeInTheDocument();
    });

    it("renders edit and delete buttons when showEditFeatures is true", () => {
        render(
            <GuidePlaceCard
                place={place}
                showEditFeatures={true}
                handleOpenEditModal={handleOpenEditModal}
                handleOpenDeleteModal={handleOpenDeleteModal}
            />
        );

        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    });

    it("calls handleOpenEditModal when edit button is clicked", () => {
        render(
            <GuidePlaceCard
                place={place}
                showEditFeatures={true}
                handleOpenEditModal={handleOpenEditModal}
                handleOpenDeleteModal={handleOpenDeleteModal}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Edit" }));
        expect(handleOpenEditModal).toHaveBeenCalledWith(place);
    });

    it("calls handleOpenDeleteModal when delete button is clicked", () => {
        render(
            <GuidePlaceCard
                place={place}
                showEditFeatures={true}
                handleOpenEditModal={handleOpenEditModal}
                handleOpenDeleteModal={handleOpenDeleteModal}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Delete" }));
        expect(handleOpenDeleteModal).toHaveBeenCalledWith(place);
    });

    it("renders 'Add tags' link when there are no tags and showEditFeatures is true", () => {
        const placeWithoutTags = { ...place, tags: [] };

        render(
            <GuidePlaceCard
                place={placeWithoutTags}
                showEditFeatures={true}
                handleOpenEditModal={handleOpenEditModal}
                handleOpenDeleteModal={handleOpenDeleteModal}
            />
        );

        expect(screen.getByText("Add tags")).toBeInTheDocument();
    });

    it("renders 'No tags' text when there are no tags and showEditFeatures is false", () => {
        const placeWithoutTags = { ...place, tags: [] };

        render(
            <GuidePlaceCard
                place={placeWithoutTags}
                showEditFeatures={false}
                handleOpenEditModal={handleOpenEditModal}
                handleOpenDeleteModal={handleOpenDeleteModal}
            />
        );

        expect(screen.getByText("No tags")).toBeInTheDocument();
    });
});

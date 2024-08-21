import { render, screen } from "@testing-library/react";
import GuideEditCard from "@/app/guides/[id]/_components/GuideEditCard";

describe("GuideEditCard", () => {
    const guide = {
        id: "1",
        isPrivate: true,
    };

    it("renders the GuideEditCard with buttons and correct text when guide is private", () => {
        render(<GuideEditCard guide={guide} />);

        expect(screen.getByText("Manage Your Guide")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Edit Guide" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Share Guide" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete Guide" })).toBeInTheDocument();
        expect(
            screen.getByText("Only users you share your guide with can see your guide.", {
                exact: false,
            })
        ).toBeInTheDocument();
    });

    it("renders the GuideEditCard with correct text when guide is public", () => {
        const publicGuide = { ...guide, isPrivate: false };

        render(<GuideEditCard guide={publicGuide} />);

        expect(screen.getByText("Manage Your Guide")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Edit Guide" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Share Guide" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete Guide" })).toBeInTheDocument();
        expect(
            screen.getByText("Your guide shows up in search results and can be seen by anyone.", {
                exact: false,
            })
        ).toBeInTheDocument();
    });

    it("renders the correct links for the buttons", () => {
        render(<GuideEditCard guide={guide} />);

        expect(screen.getByRole("button", { name: "Edit Guide" }).closest("a")).toHaveAttribute(
            "href",
            `/guides/${guide.id}/edit`
        );
        expect(screen.getByRole("button", { name: "Share Guide" }).closest("a")).toHaveAttribute(
            "href",
            `/guides/${guide.id}/share`
        );
        expect(screen.getByRole("button", { name: "Delete Guide" }).closest("a")).toHaveAttribute(
            "href",
            `/guides/${guide.id}/delete`
        );
    });
});

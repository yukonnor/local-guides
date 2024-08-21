import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import GuideResult from "@/app/guides/_components/GuideResult.jsx";

// Mock the components used in GuideResult
jest.mock("next/link", () => ({
    __esModule: true,
    default: jest.fn(({ href, children, ...props }) => (
        <a href={href} {...props}>
            {children}
        </a>
    )),
}));

jest.mock("@/app/guides/_components/PlaceTag", () =>
    jest.fn(({ label, count }) => <span>{`${label}${count ? ` (${count})` : ""}`}</span>)
);

describe("GuideResult Component", () => {
    const guide = {
        id: "guide1",
        title: "Guide One",
        isPrivate: true,
        author: { username: "author1" },
        places: [{ id: "place1" }, { id: "place2" }],
        placeTags: [
            { tagName: "tag1", count: 2 },
            { tagName: "tag2", count: 1 },
        ],
    };

    it("renders without crashing", () => {
        render(<GuideResult guide={guide} />);
    });

    it("renders the correct guide details", () => {
        render(<GuideResult guide={guide} />);

        // Check that the guide title and author are displayed correctly
        expect(screen.getByText(guide.title)).toBeInTheDocument();
        expect(screen.getByText(`by ${guide.author.username} |`)).toBeInTheDocument();
        expect(screen.getByText(`# places: ${guide.places.length}`)).toBeInTheDocument();
    });

    it("renders the private badge when the guide is private", () => {
        render(<GuideResult guide={guide} />);

        // Check that the private badge is displayed
        expect(screen.getByText("Private")).toBeInTheDocument();
    });

    it("renders the place tags correctly", () => {
        render(<GuideResult guide={guide} />);

        // Check that the place tags are displayed correctly
        guide.placeTags.forEach((tag) => {
            expect(screen.getByText(`${tag.tagName} (${tag.count})`)).toBeInTheDocument();
        });
    });

    it("renders without private badge when the guide is not private", () => {
        const publicGuide = { ...guide, isPrivate: false };
        render(<GuideResult guide={publicGuide} />);

        // Check that the private badge is not displayed
        expect(screen.queryByText("Private")).not.toBeInTheDocument();
    });

    it("renders the link with the correct href", () => {
        render(<GuideResult guide={guide} />);

        // Check that the link has the correct href
        expect(screen.getByRole("link")).toHaveAttribute("href", `/guides/${guide.id}`);
    });
});

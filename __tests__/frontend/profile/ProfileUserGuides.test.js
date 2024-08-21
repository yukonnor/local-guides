import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProfileUserGuides from "@/app/profile/[userId]/_components/ProfileUserGuides.jsx";
import OuterCard from "@/components/OuterCard";

// Mock the components used in ProfileUserGuides
jest.mock("@/components/OuterCard", () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock("next/link", () => ({
    __esModule: true,
    default: jest.fn(({ href, children }) => <a href={href}>{children}</a>),
}));

describe("ProfileUserGuides Component", () => {
    const userGuides = [
        { id: "guide1", title: "Guide One" },
        { id: "guide2", title: "Guide Two" },
    ];

    it("renders without crashing", () => {
        render(<ProfileUserGuides userGuides={userGuides} />);
    });

    it("renders the correct elements when user has guides", () => {
        render(<ProfileUserGuides userGuides={userGuides} />);

        // Check that expected elements are present
        expect(screen.getByRole("heading", { name: /your guides/i })).toBeInTheDocument();
        userGuides.forEach((guide) => {
            expect(screen.getByText(guide.title)).toBeInTheDocument();
            expect(screen.getByRole("link", { name: guide.title })).toHaveAttribute(
                "href",
                `/guides/${guide.id}`
            );
        });
    });

    it("renders the correct elements when user has no guides", () => {
        render(<ProfileUserGuides userGuides={[]} />);

        // Check that the no guides message is displayed
        expect(screen.getByText(/you haven't made any guides/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /guides search page/i })).toHaveAttribute(
            "href",
            "/guides"
        );
    });

    it("renders the OuterCard component", () => {
        render(<ProfileUserGuides userGuides={userGuides} />);

        // Check that the OuterCard component is rendered
        expect(OuterCard).toHaveBeenCalled();
    });
});

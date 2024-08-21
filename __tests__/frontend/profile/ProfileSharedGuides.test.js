import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SharedGuides from "@/app/profile/[userId]/_components/ProfileSharedGuides.jsx";
import OuterCard from "@/components/OuterCard";

// Mock the components used in SharedGuides
jest.mock("@/components/OuterCard", () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock("next/link", () => ({
    __esModule: true,
    default: jest.fn(({ href, children }) => <a href={href}>{children}</a>),
}));

describe("SharedGuides Component", () => {
    const sharedGuides = [
        { id: "guide1", title: "Guide One" },
        { id: "guide2", title: "Guide Two" },
    ];

    it("renders without crashing", () => {
        render(<SharedGuides sharedGuides={sharedGuides} />);
    });

    it("renders the correct elements when guides are shared", () => {
        render(<SharedGuides sharedGuides={sharedGuides} />);

        // Check that expected elements are present
        expect(
            screen.getByRole("heading", { name: /guides shared with you/i })
        ).toBeInTheDocument();
        sharedGuides.forEach((guide) => {
            expect(screen.getByText(guide.title)).toBeInTheDocument();
            expect(screen.getByRole("link", { name: guide.title })).toHaveAttribute(
                "href",
                `/guides/${guide.id}`
            );
        });
    });

    it("renders the correct elements when no guides are shared", () => {
        render(<SharedGuides sharedGuides={[]} />);

        // Check that the no guides message is displayed
        expect(screen.getByText(/no guides shared with you/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /guides search page/i })).toHaveAttribute(
            "href",
            "/guides"
        );
    });

    it("renders the OuterCard component", () => {
        render(<SharedGuides sharedGuides={sharedGuides} />);

        // Check that the OuterCard component is rendered
        expect(OuterCard).toHaveBeenCalled();
    });
});

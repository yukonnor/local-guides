import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProfileDeleteCard from "@/app/profile/[userId]/_components/ProfileDeleteCard.jsx";
import OuterCard from "@/components/OuterCard";

// Mock the components used in ProfileDeleteCard
jest.mock("@/components/OuterCard", () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock("next/link", () => ({
    __esModule: true,
    default: jest.fn(({ href, children }) => <a href={href}>{children}</a>),
}));

describe("ProfileDeleteCard Component", () => {
    const userId = "12345";

    it("renders without crashing", () => {
        render(<ProfileDeleteCard userId={userId} />);
    });

    it("renders the card with correct elements", () => {
        render(<ProfileDeleteCard userId={userId} />);

        // Check that expected elements are present
        expect(screen.getByRole("heading", { name: /danger zone/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /delete account/i })).toBeInTheDocument();
    });

    it("has a link that navigates to the correct URL", () => {
        render(<ProfileDeleteCard userId={userId} />);

        // Check that the link has the correct href attribute
        const link = screen.getByRole("link", { name: /delete account/i });
        expect(link).toHaveAttribute("href", `/profile/${userId}/delete`);
    });

    it("renders the OuterCard component", () => {
        render(<ProfileDeleteCard userId={userId} />);

        // Check that the OuterCard component is rendered
        expect(OuterCard).toHaveBeenCalled();
    });
});

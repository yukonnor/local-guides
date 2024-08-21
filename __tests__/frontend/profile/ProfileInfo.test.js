import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProfileInfo from "@/app/profile/[userId]/_components/ProfileInfo.jsx";
import OuterCard from "@/components/OuterCard";

// Mock the components used in ProfileInfo
jest.mock("@/components/OuterCard", () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock("next/link", () => ({
    __esModule: true,
    default: jest.fn(({ href, children }) => <a href={href}>{children}</a>),
}));

describe("ProfileInfo Component", () => {
    const user = { id: "12345", username: "testuser", email: "test@example.com" };

    it("renders without crashing", () => {
        render(<ProfileInfo user={user} />);
    });

    it("renders the correct elements", () => {
        render(<ProfileInfo user={user} />);

        // Check that expected elements are present
        expect(screen.getByRole("heading", { name: /your information/i })).toBeInTheDocument();
        expect(screen.getByText(/username:/i)).toBeInTheDocument();
        expect(screen.getByText(/email:/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /edit/i })).toBeInTheDocument();
    });

    it("displays user information correctly", () => {
        render(<ProfileInfo user={user} />);

        // Check that user information is displayed correctly
        expect(screen.getByText("Username:")).toBeInTheDocument();
        expect(screen.getByText("Email:")).toBeInTheDocument();
        expect(screen.getByText("testuser")).toBeInTheDocument();
        expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("renders the OuterCard component", () => {
        render(<ProfileInfo user={user} />);

        // Check that the OuterCard component is rendered
        expect(OuterCard).toHaveBeenCalled();
    });

    it("renders a link to edit the profile", () => {
        render(<ProfileInfo user={user} />);

        // Check that the link has the correct href attribute
        const link = screen.getByRole("link", { name: /edit/i });
        expect(link).toHaveAttribute("href", `/profile/${user.id}/edit`);
    });
});

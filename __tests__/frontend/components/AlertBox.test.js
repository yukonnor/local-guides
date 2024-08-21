import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import AlertBox from "@/components/AlertBox";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

beforeEach(() => {
    // Mock the router implementation
    useRouter.mockImplementation(() => ({
        route: "/",
        pathname: "/",
        query: {},
        asPath: "/",
        replace: jest.fn(), // Mock the replace method
    }));
});

describe("AlertBox", () => {
    it("renders without crashing", function () {
        render(<AlertBox alertType="not-authorized" />);
    });

    it("renders the correct alert text and color for error", () => {
        render(<AlertBox alertType="not-authorized" />);

        // Check for the specific alert message
        expect(
            screen.getByText("🔒 You need to be logged in to view that page.")
        ).toBeInTheDocument();

        // Check for class that sets color
        const alert = screen.getByRole("alert");
        expect(alert).toHaveClass("alert-danger");
    });

    it("renders the correct alert text and color for info", () => {
        render(<AlertBox alertType="already-logged-in" />);

        // Check for the specific alert message
        expect(screen.getByText("You're already logged in :)")).toBeInTheDocument();

        // Check for class that sets color
        const alert = screen.getByRole("alert");
        expect(alert).toHaveClass("alert-info");
    });
});

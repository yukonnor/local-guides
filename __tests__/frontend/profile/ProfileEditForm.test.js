import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfileEditForm from "@/app/profile/[userId]/_components/ProfileEditForm.jsx";
import OuterCard from "@/components/OuterCard";

// Mock the components used in ProfileEditForm
jest.mock("@/components/OuterCard", () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock("next/link", () => ({
    __esModule: true,
    default: jest.fn(({ href, children }) => <a href={href}>{children}</a>),
}));
jest.mock("react-dom", () => ({
    ...jest.requireActual("react-dom"),
    useFormStatus: jest.fn(),
}));
jest.mock("@/app/actions/profile/handleUserEdit", () => ({
    handleUserEdit: jest.fn(),
}));

describe("ProfileEditForm Component", () => {
    const user = { id: "12345", username: "testuser", email: "test@example.com" };
    const mockUseFormStatus = require("react-dom").useFormStatus;

    it("renders without crashing", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<ProfileEditForm user={user} />);
    });

    it("renders the form with correct elements and default values", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<ProfileEditForm user={user} />);

        // Check that expected elements are present
        expect(screen.getByRole("heading", { name: /edit profile/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /edit profile/i })).toBeInTheDocument();

        // Check default values
        expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
        expect(screen.getByLabelText(/username/i)).toHaveValue("testuser");
    });

    it("handles form input changes", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<ProfileEditForm user={user} />);

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "new@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "newuser" } });

        // Verify input changes
        expect(screen.getByLabelText(/email/i)).toHaveValue("new@example.com");
        expect(screen.getByLabelText(/username/i)).toHaveValue("newuser");
    });

    it("renders a link to go back to the profile page", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<ProfileEditForm user={user} />);

        // Check that the link has the correct href attribute
        const link = screen.getByRole("link", { name: /go back/i });
        expect(link).toHaveAttribute("href", `/profile/${user.id}`);
    });

    it("renders the OuterCard component", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<ProfileEditForm user={user} />);

        // Check that the OuterCard component is rendered
        expect(OuterCard).toHaveBeenCalled();
    });

    it("shows loading state when form status pending", () => {
        mockUseFormStatus.mockReturnValue({ pending: true });
        render(<ProfileEditForm user={user} />);

        // Verify button shows loading state
        const submitButton = screen.getByRole("button", { name: /editing.../i });
        expect(submitButton).toBeInTheDocument();
    });
});

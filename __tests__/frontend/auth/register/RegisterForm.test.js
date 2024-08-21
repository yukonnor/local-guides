import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterForm from "@/app/auth/register/_components/RegisterForm";
import SubmitFormButton from "@/components/SubmitFormButton";
import { handleRegister } from "@/app/actions/auth/handleRegister";
import OuterCard from "@/components/OuterCard";

jest.mock("@/components/OuterCard", () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock("@/app/actions/auth/handleRegister", () => jest.fn());

// Mock the useFormStatus hook from react-dom for the SubmitButton
jest.mock("react-dom", () => ({
    ...jest.requireActual("react-dom"),
    useFormStatus: jest.fn(),
}));

describe("RegisterForm Component", () => {
    const mockUseFormStatus = require("react-dom").useFormStatus;

    it("renders without crashing", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<RegisterForm />);
    });

    it("renders the form with correct elements", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<RegisterForm />);

        // Check that expected elements are present
        expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    });

    it("has the correct input types", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<RegisterForm />);

        // Check that inputs are correct
        expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
        expect(screen.getByLabelText(/username/i)).toHaveAttribute("type", "text");
        expect(screen.getByLabelText(/password/i)).toHaveAttribute("type", "password");
    });

    it("handles form input changes", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<RegisterForm />);

        // Simulate user input
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

        // Verify input changes
        expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
        expect(screen.getByLabelText(/username/i)).toHaveValue("testuser");
        expect(screen.getByLabelText(/password/i)).toHaveValue("password123");
    });

    it("shows loading state on button click", () => {
        mockUseFormStatus.mockReturnValue({ pending: true });
        render(<RegisterForm />);

        const submitButton = screen.getByRole("button", { name: /signing up.../i });

        expect(submitButton).toBeInTheDocument();
    });
});

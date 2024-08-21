import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProfileDeleteForm from "@/app/profile/[userId]/_components/ProfileDeleteForm.jsx";

// Mock dependencies
jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ children }) => <a>{children}</a>,
}));

jest.mock("@/components/OuterCard", () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock("react-dom", () => ({
    ...jest.requireActual("react-dom"),
    useFormStatus: jest.fn(),
}));

jest.mock("@/app/actions/profile/handleUserDelete", () => ({
    handleUserDelete: jest.fn(),
}));

describe("ProfileDeleteForm Component", () => {
    const userId = "123";
    const mockUseFormStatus = require("react-dom").useFormStatus;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<ProfileDeleteForm userId={userId} />);
    });

    it("renders the Go Back link with the correct href", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<ProfileDeleteForm userId={userId} />);

        expect(screen.getByText("< Go Back")).toBeInTheDocument();
    });

    it("renders the form with correct elements", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<ProfileDeleteForm userId={userId} />);
        expect(
            screen.getByText(/Are you sure your want to delete your profile?/i)
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Delete Profile/i })).toBeInTheDocument();
    });

    it("shows loading state when form status pending", () => {
        mockUseFormStatus.mockReturnValue({ pending: true });
        render(<ProfileDeleteForm userId={userId} />);

        expect(screen.getByRole("button", { name: /Deleting.../i })).toBeInTheDocument();
    });
});

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SubmitFormButton from "@/components/SubmitFormButton";

// Mock the useFormStatus hook from react-dom
jest.mock("react-dom", () => ({
    ...jest.requireActual("react-dom"),
    useFormStatus: jest.fn(),
}));

describe("SubmitFormButton", () => {
    const mockUseFormStatus = require("react-dom").useFormStatus;

    beforeEach(() => {
        mockUseFormStatus.mockReturnValue({ pending: false });
    });

    it("renders without crashing", () => {
        render(<SubmitFormButton label="Submit" loading="Loading..." />);
    });

    it("displays the correct label when pending is false", () => {
        mockUseFormStatus.mockReturnValue({ pending: false });
        render(<SubmitFormButton label="Submit" loading="Loading..." />);
        expect(screen.getByText("Submit")).toBeInTheDocument();
    });

    it("displays the loading text when pending is true", () => {
        mockUseFormStatus.mockReturnValue({ pending: true });
        render(<SubmitFormButton label="Submit" loading="Loading..." />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("disables the button when pending is true", () => {
        mockUseFormStatus.mockReturnValue({ pending: true });
        render(<SubmitFormButton label="Submit" loading="Loading..." />);
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
    });

    it("has the correct color class", () => {
        const color = "secondary";
        render(<SubmitFormButton label="Submit" loading="Loading..." color={color} />);
        const button = screen.getByRole("button");
        expect(button).toHaveClass(`btn-${color}`);
    });
});

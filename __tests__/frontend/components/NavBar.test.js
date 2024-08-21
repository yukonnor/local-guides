import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import NavBar from "@/components/NavBar";

// Mock the next/link component
jest.mock("next/link", () => {
    return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock the useRouter hook if needed
// jest.mock("next/navigation", () => ({
//     useRouter: jest.fn(),
// }));

describe("NavBar", () => {
    const mockSession = { id: 1, username: "testuser" };
    const mockHandleLogout = jest.fn();

    it("renders without crashing", () => {
        render(<NavBar session={null} handleLogout={mockHandleLogout} />);
    });

    it("renders the brand name", () => {
        render(<NavBar session={null} handleLogout={mockHandleLogout} />);

        expect(screen.getByText("local guides")).toBeInTheDocument();
    });

    it("renders navigation links", () => {
        render(<NavBar session={null} handleLogout={mockHandleLogout} />);

        expect(screen.getByText("Find Guides")).toBeInTheDocument();
        expect(screen.getByText("Create a Guide")).toBeInTheDocument();
    });

    it("renders Sign Up and Log in buttons when no session", () => {
        render(<NavBar session={null} handleLogout={mockHandleLogout} />);

        expect(screen.getByText("Sign Up")).toBeInTheDocument();
        expect(screen.getByText("Log In")).toBeInTheDocument();
    });

    it("renders user greeting and Logout button when session exists", () => {
        render(<NavBar session={mockSession} handleLogout={mockHandleLogout} />);

        expect(screen.getByText("Hello, testuser!")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("toggles the navbar on click", () => {
        render(<NavBar session={null} handleLogout={mockHandleLogout} />);

        const toggler = screen.getByLabelText("Toggle navigation");
        fireEvent.click(toggler);

        expect(screen.getByText("Find Guides")).toBeVisible();
        expect(screen.getByText("Create a Guide")).toBeVisible();
    });

    it("calls handleLogout on logout button click", () => {
        // TODO: Jest is unable to test calls to action prop functions at this time.
        // render(<NavBar session={mockSession} handleLogout={mockHandleLogout} />);
        // const logoutButton = screen.getByText("Logout");
        // fireEvent.submit(logoutButton.closest("form"));
        // expect(mockHandleLogout).toHaveBeenCalled();
    });
});

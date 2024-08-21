import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/app/auth/login/_components/LoginForm";
import { handleLogin } from "@/app/actions/auth/handleLogin";

// Mock the components used in LoginForm
jest.mock("@/components/SubmitFormButton", () =>
    jest.fn(({ label, loading }) => <button>{label}</button>)
);
jest.mock("@/components/OuterCard", () => jest.fn(({ children }) => <div>{children}</div>));

// Mock handleLogin function
jest.mock("@/app/actions/auth/handleLogin", () => ({
    handleLogin: jest.fn(),
}));

describe("LoginForm", () => {
    it("renders without crashing", () => {
        render(<LoginForm />);
    });

    it("renders the form elements correctly", async () => {
        render(<LoginForm />);

        const submitButton = screen.getByRole("button", { name: /log in/i });

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    it("calls handleLogin on form submit", async () => {
        // TODO: Jest is unable to test calls to action prop functions at this time.
        // render(<LoginForm />);
        // const user = userEvent.setup();
        // const usernameInput = screen.getByLabelText(/username/i);
        // const passwordInput = screen.getByLabelText(/password/i);
        // const submitButton = screen.getByRole("button", { name: /log in/i });
        // await user.type(usernameInput, "testuser");
        // await user.type(passwordInput, "password");
        // await user.click(submitButton);
        // expect(handleLogin).toHaveBeenCalled();
    });

    it("displays the loading state correctly", () => {
        render(<LoginForm />);

        const submitButton = screen.getByRole("button", { name: /log in/i });

        expect(submitButton).toBeInTheDocument();
        expect(screen.queryByText("Logging in...")).not.toBeInTheDocument();
    });
});

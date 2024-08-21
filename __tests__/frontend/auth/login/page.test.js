import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Login from "@/app/auth/login/page.jsx";
import AlertBox from "@/components/AlertBox";
import LoginForm from "@/app/auth/login/_components/LoginForm";
import PageContent from "@/components/PageContent";

// Mock the components used in Login
jest.mock("@/components/AlertBox", () => jest.fn(() => null));
jest.mock("@/components/PageContent", () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock("@/app/auth/login/_components/LoginForm", () => jest.fn(() => null));

describe("Login Page", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders LoginForm and PageContent", async () => {
        render(await Login({ searchParams: {} }));

        expect(PageContent).toHaveBeenCalled();
        expect(LoginForm).toHaveBeenCalled();
    });

    it("renders AlertBox when alertType is present", async () => {
        const alertType = "not-authorized";
        render(await Login({ searchParams: { alert: alertType } }));

        expect(AlertBox).toHaveBeenCalledWith({ alertType, path: "/auth/login" }, {});
        expect(LoginForm).toHaveBeenCalled();
    });

    it("does not render AlertBox when alertType is not present", async () => {
        render(await Login({ searchParams: {} }));

        expect(AlertBox).not.toHaveBeenCalled();
        expect(LoginForm).toHaveBeenCalled();
    });
});

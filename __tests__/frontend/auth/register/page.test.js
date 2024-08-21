import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Register from "@/app/auth/register/page.jsx";
import RegisterForm from "@/app/auth/register/_components/RegisterForm";
import PageContent from "@/components/PageContent";

// Mock the components used in Register
jest.mock("@/components/PageContent", () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock("@/app/auth/register/_components/RegisterForm", () => jest.fn(() => null));

describe("Register Page", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders RegisterForm and PageContent", async () => {
        render(await Register());

        expect(PageContent).toHaveBeenCalled();
        expect(RegisterForm).toHaveBeenCalled();
    });
});

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PageContent from "@/components/PageContent";

describe("PageContent", () => {
    it("renders without crashing", () => {
        render(<PageContent>Test Content</PageContent>);
    });

    it("applies the correct className", () => {
        render(<PageContent>Test Content</PageContent>);

        const pageElement = screen.getByText("Test Content").closest(".PageContent");
        expect(pageElement).toHaveClass("PageContent col-11");
    });

    it("renders children correctly", () => {
        render(<PageContent>Test Content</PageContent>);

        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
});

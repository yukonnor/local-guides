import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import InnerCard from "@/components/InnerCard";

describe("InnerCard", () => {
    it("renders without crashing", () => {
        render(<InnerCard className="test-class">Test Content</InnerCard>);
    });

    it("applies the correct className", () => {
        render(<InnerCard className="test-class">Test Content</InnerCard>);

        const cardElement = screen.getByText("Test Content").closest(".InnerCard");
        expect(cardElement).toHaveClass("InnerCard test-class");
    });

    it("renders children correctly", () => {
        render(<InnerCard className="test-class">Test Content</InnerCard>);

        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
});

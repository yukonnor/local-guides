import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import OuterCard from "@/components/OuterCard";

describe("OuterCard", () => {
    it("renders without crashing", () => {
        render(<OuterCard className="test-class">Test Content</OuterCard>);
    });

    it("applies the correct className", () => {
        render(<OuterCard className="test-class">Test Content</OuterCard>);

        const cardElement = screen.getByText("Test Content").closest(".OuterCard");
        expect(cardElement).toHaveClass("OuterCard test-class");
    });

    it("renders children correctly", () => {
        render(<OuterCard className="test-class">Test Content</OuterCard>);

        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
});

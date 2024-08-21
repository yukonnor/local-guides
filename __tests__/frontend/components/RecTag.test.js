import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import RecTag from "@/components/RecTag";

// Helper function to get text based on recType
const getRecText = (recType) => {
    if (recType === "dontmiss") return "Don't Miss It!";
    if (recType === "recommend") return "Recommend";
    if (recType === "iftime") return "If You Have Time";
    if (recType === "avoid") return "Avoid It!";
};

describe("RecTag", () => {
    it("renders without crashing", () => {
        render(<RecTag recType="recommend" />);
    });

    it.each([
        ["dontmiss", "Don't Miss It!"],
        ["recommend", "Recommend"],
        ["iftime", "If You Have Time"],
        ["avoid", "Avoid It!"],
    ])("renders the correct text for recType '%s'", (recType, expectedText) => {
        render(<RecTag recType={recType} />);
        expect(screen.getByText(expectedText)).toBeInTheDocument();
    });

    it.each([["dontmiss"], ["recommend"], ["iftime"], ["avoid"]])(
        "applies the correct class for recType '%s'",
        (recType) => {
            render(<RecTag recType={recType} />);
            const recTagElement = screen.getByText(getRecText(recType));
            expect(recTagElement).toHaveClass(`RecTag ${recType}`);
        }
    );
});

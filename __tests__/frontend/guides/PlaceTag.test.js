import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PlaceTag from "@/app/guides/_components/PlaceTag.jsx";

describe("PlaceTag Component", () => {
    it("renders the label correctly", () => {
        render(<PlaceTag label="Test Label" />);
        expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("renders the label and count correctly when count is provided", () => {
        render(<PlaceTag label="Test Label" count={5} />);
        expect(screen.getByText("Test Label (5)")).toBeInTheDocument();
    });

    it("does not render count when count is null", () => {
        render(<PlaceTag label="Test Label" />);
        expect(screen.queryByText("Test Label (0)")).not.toBeInTheDocument();
    });

    it("renders correctly when count is 0", () => {
        render(<PlaceTag label="Test Label" count={0} />);
        expect(screen.getByText("Test Label", { exact: false })).toBeInTheDocument();
        expect(screen.queryByText("Test Label (0)")).not.toBeInTheDocument();
    });
});

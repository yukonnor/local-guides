import { render, screen, fireEvent } from "@testing-library/react";
import GuideSharesCard from "@/app/guides/[id]/_components/GuideSharesCard";

describe("GuideSharesCard", () => {
    const handleDelete = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders with shares", () => {
        const shares = [{ email: "example1@example.com" }, { email: "example2@example.com" }];

        render(<GuideSharesCard shares={shares} handleDelete={handleDelete} />);

        expect(screen.getByText("Your Guide is Shared With")).toBeInTheDocument();
        expect(screen.getByText("example1@example.com")).toBeInTheDocument();
        expect(screen.getByText("example2@example.com")).toBeInTheDocument();

        // Ensure "Remove Share" buttons are present
        const removeButtons = screen.getAllByText("Remove Share");
        expect(removeButtons).toHaveLength(shares.length);
    });

    it("renders without shares", () => {
        render(<GuideSharesCard shares={[]} handleDelete={handleDelete} />);

        expect(screen.getByText("Your Guide is Shared With")).toBeInTheDocument();
        expect(
            screen.getByText("Add an email address above to share your guide.")
        ).toBeInTheDocument();
    });

    it("calls handleDelete with the correct share on button click", () => {
        const shares = [{ email: "example@example.com" }];
        render(<GuideSharesCard shares={shares} handleDelete={handleDelete} />);

        const button = screen.getByText("Remove Share");
        fireEvent.click(button);

        expect(handleDelete).toHaveBeenCalledWith(shares[0]);
        expect(handleDelete).toHaveBeenCalledTimes(1);
    });
});

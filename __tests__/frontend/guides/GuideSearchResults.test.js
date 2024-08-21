import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import GuideSearchResults from "@/app/guides/_components/GuideSearchResults";

// Mock the components used in GuideSearchResults
jest.mock("next/link", () => ({
    __esModule: true,
    default: jest.fn(({ href, children, ...props }) => (
        <a href={href} {...props}>
            {children}
        </a>
    )),
}));

jest.mock("@/components/LocalitySearch", () =>
    jest.fn(() => <div data-testid="locality-search" />)
);
jest.mock("@/app/guides/_components/GuideResultsCard", () =>
    jest.fn(() => <div data-testid="guide-results-card" />)
);
jest.mock("@/components/OuterCard", () =>
    jest.fn(({ children }) => <div data-testid="outer-card">{children}</div>)
);

describe("GuideSearchResults Component", () => {
    const locality = {
        displayName: { text: "Sample Locality" },
        formattedAddress: "Sample Address",
        id: "locality1",
    };

    const guides = [
        { id: "guide1", title: "Guide One" },
        { id: "guide2", title: "Guide Two" },
    ];

    it("renders without crashing", () => {
        render(<GuideSearchResults locality={locality} guides={guides} />);
    });

    it("displays no results message and LocalitySearch component when no locality is found", () => {
        render(<GuideSearchResults locality={undefined} guides={guides} />);

        expect(screen.getByText("Couldn't Find City")).toBeInTheDocument();
        expect(
            screen.getByText("We couldn't find a city or town for your search", { exact: false })
        ).toBeInTheDocument();
        expect(screen.getAllByTestId("locality-search").length).toBe(1);
        expect(screen.getByText("Random Guides:")).toBeInTheDocument();
    });

    it("displays locality information and GuideResultsCard when locality is found", () => {
        render(<GuideSearchResults locality={locality} guides={guides} />);

        expect(screen.getByText(`${locality.displayName.text}`)).toBeInTheDocument();
        expect(screen.getByText(locality.formattedAddress)).toBeInTheDocument();
        expect(screen.getByTestId("guide-results-card")).toBeInTheDocument();
    });

    it("renders create guide link with the correct href", () => {
        render(<GuideSearchResults locality={locality} guides={guides} />);

        const createGuideLink = screen.getByRole("link", {
            name: `Create ${locality.displayName.text} Guide`,
        });
        expect(createGuideLink).toHaveAttribute("href", `/guides/new?gpid=${locality.id}`);
    });

    it("toggles search modal when the link is clicked", () => {
        render(<GuideSearchResults locality={locality} guides={guides} />);

        const searchLink = screen.getByText("Search somewhere else?");
        fireEvent.click(searchLink);

        // Check if the modal is opened
        expect(screen.getByText("Update Location Search")).toBeInTheDocument();

        const closeButton = screen.getByLabelText("Close");
        expect(closeButton).toBeInTheDocument();
    });
});

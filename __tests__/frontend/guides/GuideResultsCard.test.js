import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import GuideResultsCard from "@/app/guides/_components/GuideResultsCard";

// Mock the components used in GuideResultsCard
jest.mock("next/link", () => ({
    __esModule: true,
    default: jest.fn(({ href, children, ...props }) => (
        <a href={href} {...props}>
            {children}
        </a>
    )),
}));

jest.mock("@/app/guides/_components/GuideResult", () =>
    jest.fn(({ guide }) => <div data-testid="guide-result">{guide.title}</div>)
);

jest.mock("@/components/OuterCard", () =>
    jest.fn(({ children }) => <div data-testid="outer-card">{children}</div>)
);

describe("GuideResultsCard Component", () => {
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
        render(<GuideResultsCard locality={locality} guides={guides} />);
    });

    it("displays the correct locality and number of guides", () => {
        render(<GuideResultsCard locality={locality} guides={guides} />);

        // Check that the locality and number of guides are displayed correctly
        expect(screen.getByText(`Guides Near ${locality.displayName.text}`)).toBeInTheDocument();
        expect(screen.getByText(`${guides.length} nearby guide(s) found`)).toBeInTheDocument();
    });

    it("renders guide results when guides are available", () => {
        render(<GuideResultsCard locality={locality} guides={guides} />);

        // Check that guide results are rendered
        guides.forEach((guide) => {
            expect(screen.getByText(guide.title)).toBeInTheDocument();
        });
    });

    it("renders no guides message and create guide link when no guides are available", () => {
        render(<GuideResultsCard locality={locality} guides={[]} />);

        // Check that the no guides message is displayed
        expect(
            screen.getByText(
                `No guides gound near ${locality.formattedAddress}. Search for a new location or create a new guide for this location!`
            )
        ).toBeInTheDocument();

        // Check that the create guide link is displayed
        expect(screen.getByText(`Create ${locality.displayName.text} Guide?`)).toBeInTheDocument();
        expect(screen.getByRole("link")).toHaveAttribute("href", `/guides/new?gpid=${locality.id}`);
    });
});

import { render, screen } from "@testing-library/react";
import GuideDescriptionCard from "@/app/guides/[id]/_components/GuideDescriptionCard.jsx";

// Mock dependencies
jest.mock("@/components/InnerCard", () => ({ children }) => <div>{children}</div>);
jest.mock("@/components/OuterCard", () => ({ children }) => <div>{children}</div>);
jest.mock("next/link", () => ({ children, href }) => <a href={href}>{children}</a>);

describe("GuideDescriptionCard", () => {
    const guideId = "123";
    const description = "This is a test description for the guide.";
    const showEditFeatures = true;

    it("renders the component with description", () => {
        render(
            <GuideDescriptionCard
                guideId={guideId}
                description={description}
                showEditFeatures={showEditFeatures}
            />
        );

        expect(screen.getByText("About This Guide")).toBeInTheDocument();
        expect(screen.getByText(description)).toBeInTheDocument();
    });

    it("renders the component without description and with edit features", () => {
        render(
            <GuideDescriptionCard
                guideId={guideId}
                description={null}
                showEditFeatures={showEditFeatures}
            />
        );

        expect(screen.getByText("About This Guide")).toBeInTheDocument();
        expect(screen.getByText("Add a description for your guide")).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /add a description for your guide/i })
        ).toHaveAttribute("href", `/guides/${guideId}/edit`);
    });

    it("renders the component without description and without edit features", () => {
        render(
            <GuideDescriptionCard guideId={guideId} description={null} showEditFeatures={false} />
        );

        expect(screen.getByText("About This Guide")).toBeInTheDocument();
        expect(
            screen.getByText("This guide doesn't have a description yet...")
        ).toBeInTheDocument();
    });
});

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { createLocalityCookie } from "@/app/actions/cookieActions";
import LocalitySearchResultsList from "@/components/LocalitySearchResultsList";

const exampleLocalityResults = [
    {
        name: "places/ChIJLe6wqnKcskwRKfpyM7W2nX4",
        id: "abc123",
        formattedAddress: "Portland, ME, USA",
        location: {
            latitude: 43.6590993,
            longitude: -70.2568189,
        },
        googleMapsUri: "https://maps.google.com/?cid=9123649309491001897",
        displayName: {
            text: "Portland",
        },
    },
    {
        name: "places/ChIJLe6wqnKcskwRKfpyM7W2nX4",
        id: "xyz123",
        formattedAddress: "Portland, OR, USA",
        location: {
            latitude: 43.6590993,
            longitude: -70.2568189,
        },
        googleMapsUri: "https://maps.google.com/?cid=9123649309491001897",
        displayName: {
            text: "Portland",
        },
    },
];

// Mock the createLocalityCookie action function
jest.mock("@/app/actions/cookieActions", () => ({
    createLocalityCookie: jest.fn(),
}));

const mockCloseModal = jest.fn();

describe("LocalitySearchResultsList", () => {
    it("renders without crashing", function () {
        render(
            <LocalitySearchResultsList
                localityResults={exampleLocalityResults}
                intention="find"
                closeModal={mockCloseModal}
            />
        );
    });

    it("shows the correct text based on the locality results", () => {
        render(
            <LocalitySearchResultsList
                localityResults={exampleLocalityResults}
                intention="find"
                closeModal={mockCloseModal}
            />
        );

        expect(screen.getByText("Select a City:")).toBeInTheDocument();
        expect(screen.getByText("Portland, ME, USA")).toBeInTheDocument();
        expect(screen.getByText("Portland, OR, USA")).toBeInTheDocument();
    });
});

import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { handleSearchLocality } from "@/app/actions/handleGoogleRequests";
import toast from "react-hot-toast";
import LocalitySearch from "@/components/LocalitySearch";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

// Mock the actions modules
jest.mock("@/app/actions/handleGoogleRequests", () => ({
    handleSearchLocality: jest.fn(),
}));

jest.mock("@/app/actions/cookieActions", () => ({
    createLocalityCookie: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
    __esModule: true, // Important for default export
    default: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

beforeEach(() => {
    // Mock the router implementation
    useRouter.mockImplementation(() => ({
        route: "/",
        pathname: "/",
        query: {},
        asPath: "/",
        replace: jest.fn(), // Mock the replace method
    }));

    // Suppress console.error in tests
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    // Restore console.error
    console.error.mockRestore();
});

describe("LocalitySearch", () => {
    it("renders without crashing", function () {
        render(<LocalitySearch />);
    });

    it("shows the correct 'find' text based on default prop", () => {
        render(<LocalitySearch alertType="not-authorized" />);
        // Check for the specific alert message
        expect(screen.getByText("Search For a City to Find Guides")).toBeInTheDocument();
    });

    it("shows the correct 'create' text based on intention prop", () => {
        render(<LocalitySearch intention="create" />);
        // Check for the specific alert message
        expect(screen.getByText("Search For a City to Create a Guide")).toBeInTheDocument();
    });

    it("calls handleSearchLocality and updates results", async () => {
        // Mock the handleSearchLocality function
        handleSearchLocality.mockResolvedValue([
            {
                name: "places/ChIJLe6wqnKcskwRKfpyM7W2nX4",
                id: "ChIJLe6wqnKcskwRKfpyM7W2nX4",
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
        ]);
        // Render the component
        render(<LocalitySearch />);
        // Simulate user input
        fireEvent.change(screen.getByPlaceholderText("Search for a city..."), {
            target: { value: "Portland ME" },
        });
        // Simulate form submission
        fireEvent.click(screen.getByText("Search"));
        // Wait for the search to complete
        await waitFor(() => {
            expect(screen.getByText("Select a City:")).toBeInTheDocument();
            expect(screen.getByText("Portland, ME, USA")).toBeInTheDocument();
        });
    });

    it("handles no results", async () => {
        // Mock handleSearchLocality to return an empty array
        handleSearchLocality.mockResolvedValue([]);
        // Render the component
        render(<LocalitySearch />);
        // Simulate user input
        fireEvent.change(screen.getByPlaceholderText("Search for a city..."), {
            target: { value: "Not A Real City" },
        });
        // Simulate form submission
        fireEvent.click(screen.getByText("Search"));
        // Wait for the error toast
        await waitFor(() => {
            // Check if toast.error is a mock function
            expect(toast.error).toHaveBeenCalledWith(
                "Couldn't find that city. Try new search or try again later."
            );
        });
    });

    it("handles search error", async () => {
        // Mock handleSearchLocality to reject
        handleSearchLocality.mockRejectedValue(new Error("Search failed"));
        // Render the component
        render(<LocalitySearch />);
        // Simulate user input
        fireEvent.change(screen.getByPlaceholderText("Search for a city..."), {
            target: { value: "Something's wrong with the API" },
        });
        // Simulate form submission
        fireEvent.click(screen.getByText("Search"));
        // Wait for the error toast
        await waitFor(() => {
            // Check if toast.error is a mock function
            expect(toast.error).toHaveBeenCalledWith(
                "Coundn't fetch cities from Google. Please try again later."
            );
        });
    });
});

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import GuideCreateForm from "@/app/guides/_components/GuideCreateForm.jsx";
import { handleGuideCreate } from "@/app/actions/guides/handleGuideCreate";

// Mock the router
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

// Mock handleGuideCreate function
jest.mock("@/app/actions/guides/handleGuideCreate", () => ({
    handleGuideCreate: (userId, gpId, formData) =>
        console.log("In handleGuideCreate... formData:", formData),
}));

// Mock SubmitFormButton component
jest.mock("@/components/SubmitFormButton", () => (props) => (
    <button type="submit">{props.label}</button>
));

describe("GuideCreateForm Component", () => {
    const userId = "user123";
    const locality = {
        id: "locality123",
        displayName: { text: "Test City" },
    };

    beforeEach(() => {
        useRouter.mockReturnValue({ push: jest.fn() });
    });

    it("renders correctly", () => {
        render(<GuideCreateForm userId={userId} locality={locality} />);
        expect(screen.getByText("Let's create a guide for Test City")).toBeInTheDocument();
    });

    it("renders form elements correctly", () => {
        render(<GuideCreateForm userId={userId} locality={locality} />);
        expect(screen.getByLabelText("Guide Title")).toBeInTheDocument();
        expect(screen.getByLabelText("Make guide private")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Private guides can be shared with friends but they won't appear in search results. You can always change this later!"
            )
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Create Guide" })).toBeInTheDocument();
    });

    it("toggles the private switch", () => {
        render(<GuideCreateForm userId={userId} locality={locality} />);
        const privateSwitch = screen.getByLabelText("Make guide private");
        expect(privateSwitch).toBeChecked();
        fireEvent.click(privateSwitch);
        expect(privateSwitch).not.toBeChecked();
        fireEvent.click(privateSwitch);
        expect(privateSwitch).toBeChecked();
    });

    it("redirects to create page if no locality is provided", () => {
        const router = useRouter();
        render(<GuideCreateForm userId={userId} locality={undefined} />);
        expect(router.push).toHaveBeenCalledWith("/guides/create?alert=no-locality");
    });
});

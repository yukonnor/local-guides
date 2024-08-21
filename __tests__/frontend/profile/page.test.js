import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Profile from "@/app/profile/[userId]/page.jsx";
import { getSession } from "@/lib/sessionHandler";
import { isOwnerOrAdmin } from "@/lib/authMiddleware";
import UserService from "@/services/UserService";
import GuideService from "@/services/GuideService";
import GuideShareService from "@/services/GuideShareService";
import ProfileSharedGuides from "@/app/profile/[userId]/_components/ProfileSharedGuides";
import ProfileUserGuides from "@/app/profile/[userId]/_components/ProfileUserGuides";
import ProfileInfo from "@/app/profile/[userId]/_components/ProfileInfo";
import ProfileDeleteCard from "@/app/profile/[userId]/_components/ProfileDeleteCard";
import PageContent from "@/components/PageContent";
import { redirect } from "next/navigation";

// Mock external modules and services
jest.mock("@/lib/sessionHandler", () => ({
    getSession: jest.fn(),
}));
jest.mock("@/lib/authMiddleware", () => ({
    isOwnerOrAdmin: jest.fn(),
}));
jest.mock("@/services/UserService", () => ({
    getUserById: jest.fn(),
}));
jest.mock("@/services/GuideService", () => ({
    getGuideByAuthorId: jest.fn(),
}));
jest.mock("@/services/GuideShareService", () => ({
    getGuidesBySharedUserId: jest.fn(),
}));

// Mock components
jest.mock("@/components/PageContent", () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock("@/app/profile/[userId]/_components/ProfileSharedGuides", () =>
    jest.fn(() => <div>ProfileSharedGuides</div>)
);
jest.mock("@/app/profile/[userId]/_components/ProfileUserGuides", () =>
    jest.fn(() => <div>ProfileUserGuides</div>)
);
jest.mock("@/app/profile/[userId]/_components/ProfileInfo", () =>
    jest.fn(() => <div>ProfileInfo</div>)
);
jest.mock("@/app/profile/[userId]/_components/ProfileDeleteCard", () =>
    jest.fn(() => <div>ProfileDeleteCard</div>)
);

describe("Profile Page", () => {
    const userId = "test-user-id";
    const mockSession = { userId: "test-user-id" };
    const user = { id: userId, username: "testuser" };
    const userGuides = [{ id: "guide1", title: "Guide 1" }];
    const sharedGuides = [{ id: "sharedGuide1", title: "Shared Guide 1" }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders profile page with user data", async () => {
        // Mock implementations
        getSession.mockResolvedValue(mockSession);
        isOwnerOrAdmin.mockResolvedValue(true);
        UserService.getUserById.mockResolvedValue(user);
        GuideService.getGuideByAuthorId.mockResolvedValue(userGuides);
        GuideShareService.getGuidesBySharedUserId.mockResolvedValue(sharedGuides);

        const { container } = render(await Profile({ params: { userId } }));

        // Assertions
        expect(PageContent).toHaveBeenCalled();
        expect(ProfileInfo).toHaveBeenCalledWith({ user }, {});
        expect(ProfileUserGuides).toHaveBeenCalledWith({ userGuides }, {});
        expect(ProfileSharedGuides).toHaveBeenCalledWith({ sharedGuides }, {});
        expect(ProfileDeleteCard).toHaveBeenCalledWith({ userId: user.id }, {});

        // Check for presence of user data
        expect(container).toHaveTextContent("testuser");
    });
});

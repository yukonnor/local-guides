import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import ToastComponent from "@/components/ToastComponent";
import { toast } from "react-hot-toast";
import { removeToastCookie } from "@/app/actions/cookieActions";

// Mock the react-hot-toast module
jest.mock("react-hot-toast", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock the removeToastCookie function
jest.mock("@/app/actions/cookieActions", () => ({
    removeToastCookie: jest.fn(),
}));

describe("ToastComponent", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("does not render anything if no toastValue is provided", () => {
        const { container } = render(<ToastComponent toastValue={null} />);
        expect(container.firstChild).toBeNull();
    });

    it("renders a success toast when toastValue.type is success", () => {
        const toastValue = { type: "success", message: "Success message", icon: "✅" };
        render(<ToastComponent toastValue={toastValue} />);

        expect(toast.success).toHaveBeenCalledWith(toastValue.message, { icon: toastValue.icon });
        expect(removeToastCookie).toHaveBeenCalled();
    });

    it("renders an error toast when toastValue.type is error", () => {
        const toastValue = { type: "error", message: "Error message" };
        render(<ToastComponent toastValue={toastValue} />);

        expect(toast.error).toHaveBeenCalledWith(toastValue.message);
        expect(removeToastCookie).toHaveBeenCalled();
    });

    it("renders a not-authorized error toast when toastValue.type is not-authorized", () => {
        const toastValue = { type: "not-authorized" };
        render(<ToastComponent toastValue={toastValue} />);

        expect(toast.error).toHaveBeenCalledWith("You need to be logged in to view that page.", {
            icon: "🔒",
        });
        expect(removeToastCookie).toHaveBeenCalled();
    });
});

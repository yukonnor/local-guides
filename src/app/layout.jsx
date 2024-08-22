import "bootstrap/dist/css/bootstrap.css";
import "@/app/custom-styles.scss";
import "./globals.css";
import { Inter_Tight } from "next/font/google";
import BootstrapClient from "@/components/BootstrapClient";
import { getSession } from "@/lib/sessionHandler";
import { handleLogout } from "./actions/auth/handleLogout";
import { cookies } from "next/headers";
import SessionDisplayHelper from "@/components/SessionDisplayHelper";
import BootstrapBreakpointHelper from "@/components/BootstrapBreakpointHelper";
import NavBar from "@/components/NavBar";

// Display or hide dev helpers
const SHOW_DEV_HELPERS = false;

// Toast setup & toast handling via cookies
import dynamic from "next/dynamic";
const Toaster = dynamic(() => import("react-hot-toast").then((c) => c.Toaster), {
    ssr: false,
});
import ToastComponent from "@/components/ToastComponent";

const inter = Inter_Tight({ subsets: ["latin"] });

export const metadata = {
    title: "Local Guides",
    description: "Find currated places to explore on your next trip!",
};

export default async function RootLayout({ children }) {
    const session = await getSession();
    const toastMessage = cookies().get("toastMessage");

    return (
        <html lang="en">
            <body className={inter.className}>
                <Toaster />
                <NavBar session={session} handleLogout={handleLogout} />
                {children}
                {toastMessage?.value && (
                    <ToastComponent toastValue={JSON.parse(toastMessage.value)} />
                )}
                {/* Display development helpers when developing */}
                {SHOW_DEV_HELPERS ? (
                    <>
                        <SessionDisplayHelper session={session} />
                        <BootstrapBreakpointHelper />
                    </>
                ) : null}
            </body>
            <BootstrapClient />
        </html>
    );
}

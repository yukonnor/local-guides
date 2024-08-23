import LoginForm from "./_components/LoginForm";
import AlertBox from "@/components/AlertBox";
import PageContent from "@/components/PageContent";

export const metadata = {
    title: "Login | Local Guides",
};

export default async function Login({ searchParams = null }) {
    const alertType = searchParams?.alert;

    return (
        <PageContent>
            {alertType && <AlertBox alertType={alertType} path="/auth/login" />}
            <LoginForm />
        </PageContent>
    );
}

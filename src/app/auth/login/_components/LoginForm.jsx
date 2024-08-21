"use client";
import Link from "next/link";
import { handleLogin } from "@/app/actions/auth/handleLogin";
import { CardBody, CardTitle, Form, FormGroup, Label, Input } from "reactstrap";
import SubmitFormButton from "@/components/SubmitFormButton";
import OuterCard from "@/components/OuterCard";

export default function LoginForm() {
    return (
        <>
            <p>
                Don&apos;t have an account?{" "}
                <Link className="nav-link" href={`/auth/register`}>
                    Sign Up
                </Link>
            </p>

            <OuterCard>
                <CardBody>
                    <CardTitle tag="h5" className="inter-tight-subheader">
                        Log In
                    </CardTitle>
                    <Form action={handleLogin} method="POST">
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Enter your username..."
                                type="text"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input id="password" name="password" type="password" />
                        </FormGroup>
                        <SubmitFormButton label="Log In" loading="Logging in..." />
                    </Form>
                </CardBody>
            </OuterCard>
        </>
    );
}

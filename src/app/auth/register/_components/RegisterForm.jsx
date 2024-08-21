"use client";
import Link from "next/link";
import { handleRegister } from "@/app/actions/auth/handleRegister";
import { CardBody, CardTitle, Form, FormGroup, Label, Input } from "reactstrap";
import SubmitFormButton from "@/components/SubmitFormButton";
import OuterCard from "@/components/OuterCard";

export default function RegisterForm() {
    return (
        <>
            <p>
                Already have an account?{" "}
                <Link className="nav-link" href={`/auth/login`}>
                    Log In
                </Link>
            </p>
            <OuterCard>
                <CardBody>
                    <CardTitle tag="h5" className="inter-tight-subheader">
                        Sign Up
                    </CardTitle>
                    <Form action={handleRegister} method="POST">
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input id="email" name="email" type="email" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Enter a unique username"
                                type="text"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input id="password" name="password" type="password" />
                        </FormGroup>
                        <SubmitFormButton label="Sign Up" loading="Signing up..." />
                    </Form>
                </CardBody>
            </OuterCard>
        </>
    );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import {
    Card,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarText,
    Form,
    Button,
} from "reactstrap";

function NavBar({ session, handleLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <Card className="NavBar mt-2 ms-2 me-2">
            <Navbar expand="md" light>
                <NavbarBrand href="/" className="inter-tight-header">
                    local guides
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        <NavItem>
                            <NavLink href="/guides">Find Guides</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/guides/create">Create a Guide</NavLink>
                        </NavItem>
                    </Nav>
                    {session ? (
                        <>
                            <Link href={`/profile/${session.id}`}>
                                <NavbarText className="me-2">Hello, {session.username}!</NavbarText>
                            </Link>
                            <Form action={handleLogout}>
                                <Button className={isOpen && "mt-2"} color="secondary">
                                    Logout
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <div>
                            <Link href="/auth/register">
                                <Button color="primary me-2">Sign Up</Button>
                            </Link>
                            <Link href="/auth/login">
                                <Button color="primary" outline>
                                    Log In
                                </Button>
                            </Link>
                        </div>
                    )}
                </Collapse>
            </Navbar>
        </Card>
    );
}

export default NavBar;

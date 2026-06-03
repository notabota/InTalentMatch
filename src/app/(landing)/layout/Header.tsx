"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";

const Header = () => {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white px-6 py-3 shadow-sm lg:px-20">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/polygon.svg" alt="" width={28} height={28} />
                <span className="text-2xl font-bold text-primary">InTalentMatch</span>
            </Link>

            <nav className="hidden items-center gap-10 md:flex">
                <Link href="/" className="text-lg font-medium text-accent hover:text-accent-hover">
                    Home
                </Link>
                <Link href="#how-it-works" className="text-lg font-medium text-text hover:text-accent">
                    How it works
                </Link>
                <Link href="/Account/Login" className="text-lg font-medium text-text hover:text-accent">
                    Login
                </Link>
                <Link href="/Account/Register" className="text-lg font-medium text-text hover:text-accent">
                    Sign up
                </Link>
            </nav>

            <Link href="/post">
                <Button pill>Post a Job</Button>
            </Link>
        </header>
    );
};

export default Header;

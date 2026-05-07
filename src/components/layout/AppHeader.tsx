"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui";
import { useNotifications } from "@/app/hooks/useNotifications";
import { cn } from "@/lib/cn";

const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/browse-task", label: "Browse Jobs" },
    { href: "/my-tasks", label: "My Jobs" },
    { href: "/my-requests", label: "My Postings" },
];

export function AppHeader() {
    const pathname = usePathname();
    const { unseenCount } = useNotifications();

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-border bg-white px-6 py-3 shadow-sm lg:px-20">
            <Link href="/home" className="flex items-center gap-2">
                <Image src="/polygon.svg" alt="" width={28} height={28} />
                <span className="text-2xl font-bold text-primary">InTalentMatch</span>
            </Link>

            <nav className="hidden items-center gap-10 md:flex">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "text-lg font-medium transition-colors hover:text-accent",
                            pathname === link.href ? "text-accent" : "text-text",
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-6">
                <Link href="/post">
                    <Button pill>Post a Job</Button>
                </Link>

                <Link href="/profile?subpage=notifications" className="relative text-text" aria-label="Notifications">
                    <Bell className="h-7 w-7" />
                    {unseenCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                            {unseenCount}
                        </span>
                    )}
                </Link>

                <Link
                    href="/profile"
                    aria-label="Profile"
                    className={cn(pathname === "/profile" ? "text-accent" : "text-text")}
                >
                    <Image
                        src={pathname === "/profile" ? "/icon-user-blue.svg" : "/icon-user.svg"}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8"
                        unoptimized
                    />
                </Link>
            </div>
        </header>
    );
}

export default AppHeader;

import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const columns = [
    {
        title: "For Candidates",
        links: [
            { label: "Browse Jobs", href: "/browse-task" },
            { label: "How it works", href: "/#how-it-works" },
            { label: "FAQs", href: "#" },
        ],
    },
    {
        title: "For Employers",
        links: [
            { label: "Post a Job", href: "/post" },
            { label: "Premium Subscription", href: "/profile/your-plan" },
            { label: "Success Stories", href: "#" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Contact Us", href: "#" },
            { label: "Help Center", href: "#" },
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="bg-surface-muted text-text">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 md:grid-cols-4">
                <div>
                    <p className="text-xl font-bold text-primary">InTalentMatch</p>
                    <p className="mt-3 max-w-xs text-sm text-text-muted">
                        Connect with top employers and discover opportunities tailored to your skills,
                        experience, and career goals.
                    </p>
                    <div className="mt-4 flex gap-3 text-lg text-text-muted">
                        <FaFacebookF className="cursor-pointer hover:text-primary" />
                        <FaInstagram className="cursor-pointer hover:text-primary" />
                        <FaYoutube className="cursor-pointer hover:text-primary" />
                    </div>
                </div>

                {columns.map((col) => (
                    <div key={col.title}>
                        <h3 className="text-lg font-bold text-primary">{col.title}</h3>
                        <ul className="mt-3 space-y-2 text-sm">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-text-muted hover:text-primary hover:underline">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="border-t border-border py-4 text-center text-sm text-text-muted">
                © 2025 InTalentMatch. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;

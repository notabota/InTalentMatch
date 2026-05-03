import {Inter, Playfair_Display} from "next/font/google";
import "./globals.css";
import {Suspense} from "react";
import { Metadata } from "next";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif-display",
});

export const metadata: Metadata = {
    title: "InTalentMatch",
    description: "InTalentMatch Website",
};

if (process.env.NODE_ENV === "development") {
    metadata.referrer = "no-referrer-when-downgrade";
}

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body>
        <Suspense>
            {children}
        </Suspense>
        </body>
        </html>
    );
}

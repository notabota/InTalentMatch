"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function Hero() {
    return (
        <section className="bg-primary">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-2">
                <div className="space-y-6 text-center md:text-left">
                    <h1 className="font-serif text-5xl font-bold uppercase leading-tight text-white">
                        Find your perfect career match
                    </h1>
                    <p className="text-lg text-primary-soft">
                        Connect with top employers and discover opportunities tailored to your skills,
                        experience, and career goals.
                    </p>
                    <div className="flex justify-center md:justify-start">
                        <Link href="/post">
                            <Button size="lg" className="bg-accent hover:bg-accent-hover">
                                Post a Job
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Image
                        src="/hero-career.png"
                        alt="Professionals collaborating"
                        width={800}
                        height={1199}
                        className="h-auto w-full max-w-md rounded-2xl object-cover shadow-card"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}

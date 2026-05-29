"use client";

import PrimaryButton from "src/app/components/buttons/PrimaryButton";
import {FaArrowRight} from "react-icons/fa";

import Image from 'next/image'

export default function Hero() {
    return (
        <section className="bg-[#EEEEFF]/70 h-[600] py-20 border-b border-black-100">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 mx-6 my-6">
                <div className="text-center md:text-left space-y-6">
                    <h1 className="text-6xl font-bold text-gray-900 leading-20">
                        Get any task done,{" "}
                        <span className="text-primary">effortlessly</span>
                    </h1>
                    <p className="text-gray-600 text-2xl">
                        Connect with skilled providers for all your needs. Post a task, get
                        quotes, and hire trusted professionals.
                    </p>
                    <div className="flex flex-col md:flex-row gap-20 justify-center md:justify-start">
                        <PrimaryButton
                            label={
                                <span className="flex items-center gap-2">
                  Post A Task <FaArrowRight/>
                </span>
                            }
                            width="w-w-4xs"
                            borderRadius="rounded-2xl"
                        />
                    </div>
                </div>
                <div className="ml-15 flex justify-center">
                    <Image
                        width={444}
                        height={444}
                        src="/hero-image.png"
                        alt="Task Assistance"
                        className="max-w-full h-auto"
                    />
                </div>
            </div>
        </section>
    );
}

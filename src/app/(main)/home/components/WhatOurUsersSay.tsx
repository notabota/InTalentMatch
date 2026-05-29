"use client";
import { Star } from "lucide-react";

const CategoriesCard = ({
  name,
  role,
  star,
  description,
}: {
  name: string;
  role: string;
  star: string;
  description: string;
}) => {
  return (
    <div className="w-[320px] h-[320px] max-w-sm p-4 border rounded-lg shadow-md bg-white flex flex-col gap-3">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
      <div className="flex items-center text-yellow-500 mt-1 text-left">
        {[...Array(5)].map((_, index) => (
          <Star key={index} size={20} fill="currentColor" stroke="none" />
        ))}
        <span className="text-[16px] ml-1 font-medium">{star}</span>
      </div>
      <div className="text-gray-700 text-sm">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default function WhatOurUsersSay() {
  const reviews = [
    {
      name: "Emma Wilson",
      role: "Freelance Designer",
      star: "5.0",
      description:
        "InTalentMatch helped me find a reliable handyman for my apartment fix-up. Super smooth process, great communication, and fast results!",
    },
    {
      name: "Liam Tran",
      role: "Startup Founder",
      star: "4.9",
      description:
        "I’ve used InTalentMatch multiple times — from cleaning to tech support. It’s my go-to platform for getting things done efficiently.",
    },
  ];

  return (
    <section className="bg-[#F8F8F9] py-16">
      <div className="text-center md:text-left space-y-6 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-gray-900">What Our Users Say</h1>
        <p className="text-2xl text-gray-600 text-center max-w-5xl">
          Real experiences from people who’ve used InTalentMatch
        </p>
      </div>

      <div className="container mx-auto flex justify-center items-center gap-20 px-6 pt-12">
        {reviews.map((review, idx) => (
          <CategoriesCard
            key={idx}
            name={review.name}
            role={review.role}
            star={review.star}
            description={review.description}
          />
        ))}
      </div>
    </section>
  );
}

"use client";
import React from "react";
import Image from "next/image";

const CategoriesCard = ({
  image,
  category,
  description,
}: {
  image: React.ReactNode;
  category: string;
  description: string;
}) => {
  return (
    <div className="w-2xs h-[15rem] max-w-sm p-6 bg-white rounded-2xl shadow-md text-center border border-gray-200 hover:shadow-lg transition-shadow duration-300 ">
      <div className="flex justify-center items-center mb-4 bg-[#F3F3FF] rounded-full w-[50px] h-[50px] mx-auto">
        {image}
      </div>
      <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
      <p className="text-base text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default function PopularCategories() {
  const categories = [
    {
      image: (
        <Image
          src="/home-cleaning.svg"
          alt="Home Cleaning"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      category: "Home Cleaning",
      description: "House cleaning, carpet cleaning, window washing",
    },
    {
      image: (
        <Image
          src="/handyman.svg"
          alt="Handyman"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      category: "Handyman",
      description: "Repairs, assembly, installations, maintenance",
    },
    {
      image: (
        <Image
          src="/removalist.svg"
          alt="Removalist"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      category: "Removalist",
      description: "Moving, furniture delivery, junk removal",
    },
    {
      image: (
        <Image
          src="/home-renovation.svg"
          alt="Home Renovation"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      category: "Home Renovation",
      description: "Painting, flooring, kitchen, bathroom renovations",
    },
    {
      image: (
        <Image
          src="/business-services.svg"
          alt="Business Services"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      category: "Business Services",
      description: "Accounting, legal, consulting, marketing",
    },
    {
      image: (
        <Image
          src="/tech-help.svg"
          alt="Tech Help"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      category: "Tech Help",
      description: "Computer repair, IT support, website developement",
    },
    {
      image: (
        <Image
          src="/delivery.svg"
          alt="Delivery"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      category: "Delivery",
      description: "Food delivery, package delivery, grocery shopping",
    },
    {
      image: (
        <Image
          src="/other.svg"
          alt="Other"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      category: "Other",
      description: "Anything else you need help with",
    },
  ];

  return (
    <section className="py-16 mb-12">
      <div className="text-center space-y-6 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-gray-900">Popular categories</h1>
        <p className="text-2xl text-gray-600 text-center">
          Browse through our most popular service categories
        </p>
      </div>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 pt-12">
        {categories.map((item, idx) => (
          <CategoriesCard
            key={idx}
            image={item.image}
            category={item.category}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}

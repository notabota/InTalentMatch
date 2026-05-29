"use client";
import { Star } from "lucide-react";
import PrimaryButton from "src/app/components/buttons/PrimaryButton";

const ProvidersCard = ({
  name,
  role,
  star,
  quantity,
  description,
}: {
  name: string;
  role: string;
  star: string;
  quantity: string;
  description: string;
}) => {
  return (
    <div className="w-xs h-[20rem] max-w-xs p-4 border border-[#D9D9D9] rounded-[10px] shadow-lg flex flex-col justify-between">
      <div className="flex flex-col items-center text-center">
        <div className="w-[274px] flex gap-3 mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full mb-3" />
          <div>
            <h2 className="text-[24px] font-semibold text-left">{name}</h2>
            <p className="text-[16px] text-gray-500 text-left">{role}</p>
            <div className="flex items-center text-yellow-500 mt-1 text-left">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-[16px] ml-1 font-medium">{star}</span>
              <span className="text-[16px] ml-2 text-gray-500 text-sm">
                ({quantity})
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 mt-2 text-[16px] px-2 text-left">
          {description}
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <PrimaryButton
          label="View Profile"
          width="w-[133px]"
          borderRadius="rounded-[15px]"
          textSize="text-[16px]"
        />
        <PrimaryButton
          label="Contact"
          width="w-[133px]"
          borderRadius="rounded-[15px]"
          bgColor="bg-white"
          textColor="text-[var(--color-primary)]"
          textSize="text-[16px]"
          borderStyle="border border-gray-300"
        />
      </div>
    </div>
  );
};

export default function TopRatedProvider() {
  const providers = [
    {
      name: "Alex Johnson",
      role: "Home Renovation Expert",
      star: "4.9",
      quantity: "120",
      description:
        "Specialist in flooring, painting, and kitchen remodeling with 10+ years of experience.",
    },
    {
      name: "Sophie Lee",
      role: "Cleaning & Maintenance",
      star: "4.8",
      quantity: "95",
      description:
        "Offers top-rated deep cleaning, window services, and regular home maintenance.",
    },
    {
      name: "Marcus Chan",
      role: "IT & Networking",
      star: "5.0",
      quantity: "150",
      description:
        "IT professional offering computer repair, networking solutions, and tech support for homes and businesses.",
    },
  ];

  return (
    <section className="py-16">
      <div className="text-center md:text-left space-y-6 flex flex-col w-[1280px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center pl-10 gap-4 sm:gap-6 pr-20">
          <h1 className="text-[48px] font-bold text-gray-900 text-center sm:text-left">
            Top-Rated Providers
          </h1>
          <PrimaryButton
            label="View All Providers"
            width="w-[240px]"
            borderRadius="rounded-[15px]"
            bgColor="bg-white"
            textColor="text-[var(--color-primary)]"
          />
        </div>
        <div className="container pl-10">
          <p className="text-[32px] text-gray-600">
            Meet our highest-rated service professionals
          </p>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-8 pt-12 pl-10">
        {providers.map((provider, idx) => (
          <ProvidersCard
            key={idx}
            name={provider.name}
            role={provider.role}
            star={provider.star}
            quantity={provider.quantity}
            description={provider.description}
          />
        ))}
      </div>
    </section>
  );
}

"use client";
import Image from "next/image";

const StepsCard = ({
  image,
  order,
  step,
  description,
}: {
  image: React.ReactNode;
  order: string;
  step: string;
  description: string;
}) => {
  return (
    <div className="w-2xs h-auto max-w-sm p-6 bg-white rounded-2xl shadow-md text-center border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-center w-[4rem] h-[4rem] bg-[#F3F3FF] rounded-full mx-auto mb-6">
        {image}
      </div>
      <div className="w-[2rem] h-[2rem] flex items-center justify-center bg-[#3A37C6] text-white rounded-full text-xl font-bold mx-auto mb-5">
        {order}
      </div>
      <h2 className="text-lg font-semibold mb-5">{step}</h2>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
};

export default function HowInTalentMatchWorks() {
  const steps = [
    {
      image: (
        <Image
          src="/post-a-task.svg"
          alt="Post A Task"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      order: "1",
      step: "Post A Task",
      description:
        "Describe what you need done, when and where you need it, and provide your budget.",
    },
    {
      image: (
        <Image
          src="/get-offers.svg"
          alt="Get Offers"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      order: "2",
      step: "Get Offers",
      description:
        "Qualified service providers will make their offers to complete your task.",
    },
    {
      image: (
        <Image
          src="/chat-agree.svg"
          alt="Chat Agree"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      order: "3",
      step: "Chat & Agree",
      description:
        "Discuss details with providers, agree on terms, and select your preferred provider.",
    },
    {
      image: (
        <Image
          src="/task-completed.svg"
          alt="Task Completed"
          width={0}
          height={0}
          style={{ width: "auto", height: "auto" }}
          unoptimized
        />
      ),
      order: "4",
      step: "Task Completed",
      description:
        "Your provider completes the task, and you can leave a review of their service.",
    },
  ];

  return (
    <section className="bg-[#D3CED6]/15 py-16" id="how-it-works">
      <div className="text-center md:text-left space-y-6 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-gray-900">
          How InTalentMatch works
        </h1>
        <p className="text-2xl text-gray-600 text-center max-w-3xl">
          A simple, reliable way to get your tasks done
        </p>
      </div>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-start gap-8 px-6 pt-12">
        {steps.map((item, idx) => (
          <StepsCard
            key={idx}
            image={item.image}
            order={item.order}
            step={item.step}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}

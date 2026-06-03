'use client'

import DescribeTask from "src/app/(main)/post/components/DescribeTask";
import LocationBudget from "src/app/(main)/post/components/LocationBudget";
import Review from "src/app/(main)/post/components/Review";
import React, { useState } from "react";
import useMutateTasks from "src/app/hooks/useMutateTasks";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { redirect } from "next/navigation";
import { useQueryCards } from "src/app/hooks/useQueryCards";
import { TasksRequestType } from "src/app/constants/type";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Modal, Stepper } from "@/components/ui";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const STEPS = ["Job details", "Location & Budget", "Review & Post"];

export default function PostTask() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);

    const [location, setLocation] = useState<string>("");
    const [budget, setBudget] = useState<number>(50);
    const [remoteEligible, setRemoteEligible] = useState<boolean>(false);
    const [dueDate, setDueDate] = useState<string>("");
    const [taskId, setTaskId] = useState<string>("");

    const [step, setStep] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);

    const tasker = useMutateTasks();
    const { cards } = useQueryCards();

    const handleContinue = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        const taskData: TasksRequestType = {
            title,
            location,
            description,
            budget,
            remoteEligible,
            category: categories,
        };
        if (dueDate) {
            taskData.dueDate = dayjs(dueDate, "DD/MM/YYYY").toISOString();
        }
        const task = await tasker.postTask(taskData);
        setTaskId(task.id);
        setShowModal(true);
    };

    if (cards.length == 0) {
        return (
            <section className="flex flex-col items-center gap-6 py-28 text-center">
                <h1 className="max-w-xl text-xl font-bold text-danger">
                    You have no connected payment methods. Please add one before posting a job.
                </h1>
                <Link href="/add-payment-method?returnUrl=/post">
                    <Button>
                        Add payment method
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-8 text-center text-4xl font-bold text-text">Post a Job</h1>
            <Stepper steps={STEPS} current={step} className="mb-10" />

            {step == 0 && (
                <DescribeTask
                    title={title}
                    onTitleChange={setTitle}
                    description={description}
                    onDescriptionChange={setDescription}
                    categories={categories}
                    onCategoryChange={setCategories}
                    onContinue={handleContinue}
                />
            )}
            {step == 1 && (
                <LocationBudget
                    location={location}
                    onLocationChange={setLocation}
                    budget={budget}
                    onBudgetChange={setBudget}
                    remote={remoteEligible}
                    onRemoteChange={setRemoteEligible}
                    onContinue={handleContinue}
                    onBack={handleBack}
                    date={dueDate}
                    onDateChange={setDueDate}
                />
            )}
            {step == 2 && (
                <Review
                    title={title}
                    categories={categories}
                    location={location}
                    budget={budget}
                    date={dueDate}
                    description={description}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                />
            )}

            <Modal open={showModal} onClose={() => redirect("/my-tasks")}>
                <h2 className="text-xl font-bold text-accent">Job posted successfully!</h2>
                <p className="mt-2 text-text">Your job has been created and is now visible to candidates.</p>
                <div className="mt-6 flex justify-end gap-4">
                    <Button variant="ghost" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Link href={`/my-requests/details?taskId=${taskId}`}>
                        <Button>View job</Button>
                    </Link>
                </div>
            </Modal>
        </section>
    );
}

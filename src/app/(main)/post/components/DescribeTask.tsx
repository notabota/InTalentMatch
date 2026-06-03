import React, { useState } from "react";
import { CATEGORIES } from "src/app/constants/list";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { cn } from "@/lib/cn";

export default function DescribeTask({
    title,
    onTitleChange,
    description,
    onDescriptionChange,
    categories,
    onCategoryChange,
    onContinue,
}: {
    title: string;
    onTitleChange: (value: string) => void;
    description: string;
    onDescriptionChange: (value: string) => void;
    categories: string[];
    onCategoryChange: (value: string[]) => void;
    onContinue: () => void;
}) {
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");

    const handleContinue = () => {
        let hasError = false;
        if (!title.trim()) {
            setTitleError("Job title is required.");
            hasError = true;
        } else setTitleError("");
        if (!description.trim()) {
            setDescriptionError("Description is required.");
            hasError = true;
        } else setDescriptionError("");
        if (!hasError) onContinue();
    };

    const toggleCategory = (name: string) => {
        onCategoryChange(
            categories.includes(name) ? categories.filter((c) => c !== name) : [...categories, name],
        );
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold text-text">Describe your job</h2>
            <p className="mt-1 text-sm text-text-muted">Provide details about what you need done</p>

            <label className="mb-1.5 mt-6 block font-semibold text-text">Job title</label>
            <Input
                type="text"
                value={title}
                onChange={(e) => {
                    onTitleChange(e.target.value);
                    if (e.target.value.trim()) setTitleError("");
                }}
                placeholder="e.g., Frontend Developer, House Cleaning"
                className={cn(titleError && "border-danger")}
            />
            {titleError ? (
                <p className="mt-1 text-xs text-danger">{titleError}</p>
            ) : (
                <p className="mt-1 text-xs text-text-muted">Keep it short and clean.</p>
            )}

            <label className="mb-1.5 mt-5 block font-semibold text-text">Description</label>
            <Textarea
                value={description}
                onChange={(e) => {
                    onDescriptionChange(e.target.value);
                    if (e.target.value.trim()) setDescriptionError("");
                }}
                placeholder="Be specific about what you need. The more details, the better."
                className={cn(descriptionError && "border-danger")}
            />
            {descriptionError && <p className="mt-1 text-xs text-danger">{descriptionError}</p>}

            <label className="mb-2 mt-6 block font-semibold text-text">Categories</label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {CATEGORIES.map((name) => {
                    const selected = categories.includes(name);
                    return (
                        <button
                            key={name}
                            type="button"
                            onClick={() => toggleCategory(name)}
                            className={cn(
                                "flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors",
                                selected
                                    ? "border-primary bg-primary-soft text-primary"
                                    : "border-border text-text hover:border-primary",
                            )}
                        >
                            {name}
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 flex justify-end">
                <Button onClick={handleContinue}>Continue</Button>
            </div>
        </Card>
    );
}

import { Calendar, MapPin } from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Cleave from "cleave.js/react";
import { Button, Card, Checkbox, Input, RangeSlider } from "@/components/ui";
import { cn } from "@/lib/cn";

dayjs().format();
dayjs.extend(customParseFormat);

export default function LocationBudget({
    location,
    onLocationChange,
    budget,
    onBudgetChange,
    remote,
    onRemoteChange,
    date,
    onDateChange,
    onContinue,
    onBack,
}: {
    location: string;
    onLocationChange: (value: string) => void;
    budget: number;
    onBudgetChange: (value: number) => void;
    remote: boolean;
    onRemoteChange: (value: boolean) => void;
    date: string;
    onDateChange: (value: string) => void;
    onContinue: () => void;
    onBack: () => void;
}) {
    const [locationError, setLocationError] = useState("");
    const [dateError, setDateError] = useState("");

    const handleContinue = () => {
        if (!location.trim()) {
            setLocationError("Job location is required.");
            return;
        }
        setLocationError("");
        onContinue();
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold text-text">Location and Budget</h2>
            <p className="mt-1 text-text-muted">Tell us where and how much you&apos;re willing to pay</p>

            <label className="mb-1.5 mt-6 block font-semibold text-text">Job location</label>
            <Input
                type="text"
                value={location}
                onChange={(e) => {
                    onLocationChange(e.target.value);
                    if (e.target.value.trim()) setLocationError("");
                }}
                placeholder="e.g., 123 Keira St, Wollongong, 2500"
                rightIcon={<MapPin className="h-5 w-5" />}
                className={cn(locationError && "border-danger")}
            />
            {locationError ? (
                <p className="mt-1 text-xs text-danger">{locationError}</p>
            ) : (
                <p className="mt-1 text-sm text-text-muted">Where will this job be performed?</p>
            )}

            <div className="mt-4 rounded-[var(--radius-input)] border border-border p-4">
                <Checkbox
                    checked={remote}
                    onChange={() => onRemoteChange(!remote)}
                    label="This job can be done remotely"
                    description="Check if the candidate doesn't need to be physically present."
                />
            </div>

            <label className="mb-1.5 mt-6 block font-semibold text-text">Due date (optional)</label>
            <div className="flex items-center gap-2 rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 focus-within:border-accent">
                <Cleave
                    options={{ date: true, datePattern: ["d", "m", "Y"] }}
                    placeholder="DD/MM/YYYY"
                    value={date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        onDateChange(value);
                        const isValid = dayjs(value, "DD/MM/YYYY", true).isValid();
                        setDateError(!isValid && value.trim() !== "" ? "Invalid date format. Use DD/MM/YYYY" : "");
                    }}
                    className="flex-1 bg-transparent text-text outline-none placeholder:text-text-muted"
                />
                <Calendar className="h-5 w-5 text-text-muted" />
            </div>
            {dateError ? (
                <p className="mt-1 text-xs text-danger">{dateError}</p>
            ) : (
                <p className="mt-1 text-sm text-text-muted">When does this job need to be completed?</p>
            )}

            <label className="mb-2 mt-6 block font-semibold text-text">Budget: ${budget}</label>
            <RangeSlider min={5} max={1000} value={budget} onChange={onBudgetChange} />
            <div className="mt-1 flex justify-between text-sm text-text-muted">
                <span>$5</span>
                <span>$500</span>
                <span>$1000</span>
            </div>
            <p className="mt-1 text-sm text-text-muted">How much are you willing to pay for this job?</p>

            <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={handleContinue}>Continue</Button>
            </div>
        </Card>
    );
}

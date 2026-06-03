"use client";
import React from "react";
import dayjs from "dayjs";
import { TasksResponseType } from "src/app/constants/type";
import JobCard from "@/components/domain/JobCard";

function statusFor(task: TasksResponseType): { label: string; tone: "open" | "assigned" | "overdue" } {
    if (task.selected) return { label: "Assigned", tone: "assigned" };
    if (task.dueDate && dayjs(task.dueDate).isBefore(dayjs())) return { label: "Overdue", tone: "overdue" };
    return { label: "Open", tone: "open" };
}

export default function OpenTasks({ openTasks }: { openTasks: TasksResponseType[] }) {
    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold text-primary">OPEN JOBS</h2>
            {openTasks.length != 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {openTasks.map((task) => (
                        <JobCard
                            key={task.id}
                            title={task.title}
                            budget={task.budget}
                            location={task.location}
                            date={task.dueDate}
                            status={statusFor(task)}
                            action={{ label: "View details", href: `/my-tasks/details?taskId=${task.id}` }}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-lg font-semibold text-text-muted">No open jobs.</p>
            )}
            <hr className="my-12 border-t border-border" />
        </div>
    );
}

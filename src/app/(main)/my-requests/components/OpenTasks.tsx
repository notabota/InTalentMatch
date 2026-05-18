"use client";
import React from "react";
import { TasksResponseType } from "src/app/constants/type";
import JobCard from "@/components/domain/JobCard";

export default function OpenTasks({ openTasks }: { openTasks: TasksResponseType[] }) {
    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold text-primary">OPEN POSTINGS</h2>
            {openTasks.length != 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {openTasks.map((task) => (
                        <JobCard
                            key={task.id}
                            title={task.title}
                            budget={task.budget}
                            location={task.location}
                            date={task.dueDate}
                            status={
                                task.selected
                                    ? { label: "Assigned", tone: "assigned" }
                                    : { label: "Open", tone: "open" }
                            }
                            action={{ label: "View details", href: `/my-requests/details?taskId=${task.id}` }}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-lg font-semibold text-text-muted">No open postings.</p>
            )}
            <hr className="my-12 border-t border-border" />
        </div>
    );
}

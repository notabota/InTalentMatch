"use client";
import React, { useState } from "react";
import { TasksResponseType } from "src/app/constants/type";
import JobCard from "@/components/domain/JobCard";

export default function CompletedTasks({ completedTasks }: { completedTasks: TasksResponseType[] }) {
    const [showAll, setShowAll] = useState(false);
    const visibleTasks = showAll ? completedTasks : completedTasks.slice(0, 4);

    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold text-primary">COMPLETED JOBS</h2>
            {visibleTasks.length != 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {visibleTasks.map((task) => (
                        <JobCard
                            key={task.id}
                            title={task.title}
                            budget={task.budget}
                            location={task.location}
                            date={task.dueDate}
                            status={{ label: "Completed", tone: "completed" }}
                            action={{ label: "View details", href: `/my-tasks/details?taskId=${task.id}` }}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-lg font-semibold text-text-muted">No completed jobs.</p>
            )}

            {completedTasks.length > 4 && (
                <div className="mt-4 text-right">
                    <button className="font-medium text-accent underline" onClick={() => setShowAll(!showAll)}>
                        {showAll ? "View less" : "View more"}
                    </button>
                </div>
            )}
        </div>
    );
}

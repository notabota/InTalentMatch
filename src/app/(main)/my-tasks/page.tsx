'use client'

import OpenTasks from "src/app/(main)/my-tasks/components/OpenTasks";
import useQueryMyTasks from "src/app/hooks/useQueryMyTasks";
import React from "react";
import CompletedTasks from "src/app/(main)/my-tasks/components/CompletedTasks";

export default function MyTasks() {
    const {myTasks} = useQueryMyTasks('provider');

    if (!myTasks) return <h1 className="py-20 text-center text-xl font-semibold">Loading...</h1>

    const openTasks = myTasks.filter((task) => !task.completedDate);
    const completeTasks = myTasks.filter((task) => task.completedDate);

    return (
        <section className="py-12">
            <div className="mx-auto grid max-w-6xl gap-6 px-6">
                <OpenTasks openTasks={openTasks}/>
                <CompletedTasks completedTasks={completeTasks}/>
            </div>
        </section>
    );
}

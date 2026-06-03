'use client'

import TaskDetailCard from "src/app/(main)/my-tasks/details/components/TaskDetailCard";
import {useSearchParams} from 'next/navigation';
import useQueryTask from "src/app/hooks/useQueryTask";

export default function Task() {
    const searchParams = useSearchParams();
    const taskId = searchParams.get('taskId');
    const {task} = useQueryTask({
        requestId: taskId
    });
    return (
        <section className="px-6 py-12">
            <TaskDetailCard task={task}/>
        </section>
    )
}

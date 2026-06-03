import {useEffect, useState} from "react";
import * as taskApi from "src/app/helpers/api/tasks";
import {TaskRequestType, TaskResponseType, TaskState} from "src/app/constants/type";

export default function useQueryTask({requestId}: {
    requestId?: string;
}) {
    const [task, setTask] = useState<TaskResponseType>()
    const [taskState, setTaskState] = useState<TaskState>();

    useEffect(() => {
        loadTask({
            requestId,
        });
    }, [requestId])

    async function loadTask(request: TaskRequestType) {
        if (!request.requestId) return;
        const task: TaskResponseType = await taskApi.getTask(request);
        setTask(task);

        if (!task) setTaskState(null)
        else if (task.completedDate) setTaskState('completed');
        else if (task.selected) setTaskState('assigned')
        else if (task.offers) setTaskState('offered');
        else setTaskState('opened')
    }

    async function getTask(request: TaskRequestType) {
        const task: TaskResponseType = await taskApi.getTask(request);
        return task;
    }

    return {
        task,
        taskState,
        loadTask,
        getTask,
    };
}

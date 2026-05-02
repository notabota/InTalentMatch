'use client'

import {useEffect, useState} from "react";
import {getMyTasks} from "src/app/helpers/api/tasks";
import {TasksResponseType} from "src/app/constants/type";

export default function useQueryMyTasks(type?: string) {
    const [myTasks, setMyTasks] = useState<TasksResponseType[]>()

    useEffect(() => {
        loadMyTasks();
    }, [])

    async function loadMyTasks() {
        const tasks: TasksResponseType[] = await getMyTasks(type);
        setMyTasks(tasks);
    }

    return {
        myTasks,
        loadMyTasks
    };
}

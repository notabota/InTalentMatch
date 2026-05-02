import {useEffect, useState} from "react";
import {getTasks} from "src/app/helpers/api/tasks";
import {TasksResponseType} from "src/app/constants/type";

export default function useQueryTasks({keywords, categoryId, location}: {
    keywords: string,
    categoryId: string,
    location: string,
}) {
    const [tasks, setTasks] = useState<TasksResponseType[]>()
    const [allTasks, setAllTasks] = useState<TasksResponseType[]>([]);

    useEffect(() => {
        loadTasks(keywords, categoryId, location);
    }, [keywords, categoryId, location]);

    useEffect(() => {
        loadAllTasks();
    }, []);

    async function loadTasks(keywords: string, categoryId: string, location: string) {
        const tasks: TasksResponseType[] = await getTasks(keywords, categoryId, location);
        setTasks(tasks);
    }

    async function loadAllTasks() {
        const allTasks: TasksResponseType[] = await getTasks();
        setAllTasks(allTasks);
    }

    return {
        tasks,
        allTasks,
        loadTasks,
        loadAllTasks
    };
}

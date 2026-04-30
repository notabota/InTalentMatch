import {fetchApi} from "src/app/helpers/api/request";
import {TasksRequestType} from "src/app/constants/type";

export async function getTasks(keywords?: string, categoryId?: string, location?: string) {
    const res = await fetchApi({
        path: "/Request/FindRequests",
        data: {
            keywords,
            ...(categoryId != null && {categoryId: [categoryId]}),
            location
        }
    });

    if (res.status == 200) return await res.json();
    return null;
}

export async function getTask({requestId}: { requestId: string }) {
    const res = await fetchApi({
        path: "/Request/?requestId=" + requestId,
    });

    if (res.status == 200) return await res.json();
    return null;
}

export async function getMyTasks(type?: string) {
    const res = await fetchApi({
        path: "/Request",
        data: {
            type,
        }
    });

    if (res.status == 200) return await res.json();
    return null;
}


export async function postTask(data: TasksRequestType) {
    const res = await fetchApi({
        path: "/Request",
        method: "POST",
        data: data
    });
    return await res.json();
}

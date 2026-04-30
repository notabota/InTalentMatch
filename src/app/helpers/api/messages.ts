import {fetchApi} from "src/app/helpers/api/request";
import {MessageRequestType} from "src/app/constants/type";

export async function getMessages(request: MessageRequestType) {
    const res = await fetchApi({
        path: "/Message?peerId=" + request.peerId,
        method: "GET",
    });

    return res.json()
}

export async function postMessage(request: MessageRequestType, message: string) {
    await fetchApi({
        path: "/Message?peerId=" + request.peerId,
        method: "POST",
        data: message,
    });
}


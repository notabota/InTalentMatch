import * as messagesApi from "src/app/helpers/api/messages";
import {MessageRequestType} from "src/app/constants/type";

export default function useMutateMessages() {

    async function postMessage(request: MessageRequestType, data: string) {
        const res = await messagesApi.postMessage(request, data);
    }

    return {
        postMessage
    };
}



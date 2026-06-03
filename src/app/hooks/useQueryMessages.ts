import {useEffect, useState} from "react";
import {getMessages} from "src/app/helpers/api/messages";
import {MessageRequestType, MessagesResponseType} from "src/app/constants/type";

export default function useQueryMessage({peerId}: {
    peerId: string;
}) {
    const [messages, setMessages] = useState<MessagesResponseType>()

    useEffect(() => {
        let isMounted = true;

        const loadMessages = async () => {
            try {
                const fetched: MessagesResponseType = await getMessages({peerId});
                if (isMounted) setMessages(fetched);
            } catch (err) {
                console.error("Failed to load messages:", err);
            }
        };

        loadMessages();

        const interval = setInterval(loadMessages, 1000); // auto-refetch every 5 seconds

        return () => {
            isMounted = false;
            clearInterval(interval);
        };

    }, [peerId])

    async function loadMessages(request: MessageRequestType) {
        const messages: MessagesResponseType = await getMessages(request);
        setMessages(messages);
    }

    return {
        messages,
        loadMessage: loadMessages
    };
}

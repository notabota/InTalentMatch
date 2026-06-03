import {useState, useEffect} from "react";
import {getNotifications} from "../helpers/api/notifications";
import {NotificationResponseType} from "src/app/constants/type";

export default function useQueryNotifications() {

    const [notifications, setNotifications] = useState<NotificationResponseType[]>([]);

    const loadNotifications = async () => {
        try {
            const notifications = await getNotifications();
            setNotifications(notifications);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    return {notifications, loadNotifications};
}

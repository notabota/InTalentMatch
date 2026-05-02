import {useState, useEffect, useMemo, useCallback} from "react";
import useQueryNotifications from "src/app/hooks/useQueryNotifications";

const LAST_SEEN_KEY = "notifications:lastSeen";

export function useNotifications() {
    const {notifications = []} = useQueryNotifications();

    const [lastSeen, setLastSeen] = useState<Date>(() => {
        const saved = localStorage.getItem(LAST_SEEN_KEY);
        return saved ? new Date(saved) : new Date(0); // default to epoch
    });

    const [unseenCount, setUnseenCount] = useState<number>(0);

    useEffect(() => {
        const count = notifications.filter(n => new Date(n.timestamp) > lastSeen).length;
        setUnseenCount(count);
    }, [notifications, lastSeen]);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === LAST_SEEN_KEY) {
                const updated = event.newValue ? new Date(event.newValue) : new Date(0);
                setLastSeen(updated);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const markAllAsSeen = useCallback(() => {
        const now = new Date();
        localStorage.setItem(LAST_SEEN_KEY, now.toISOString());
        setLastSeen(now);
        setUnseenCount(0);
    }, []);

    return {
        unseenCount,
        lastSeen,
        markAllAsSeen,
    };
}

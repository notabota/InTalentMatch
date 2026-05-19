import React from "react";
import { MapPin, Calendar, DollarSign, User } from "lucide-react";
import { TaskResponseType } from "src/app/constants/type";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useMutateOffers from "src/app/hooks/useMutateOffers";
import useAuth from "src/app/hooks/useAuth";
import { Badge, Button } from "@/components/ui";
import JobDetailHeader from "@/components/domain/JobDetailHeader";

dayjs.extend(relativeTime);

export default function TaskDetailCard({ task }: { task: TaskResponseType }) {
    const offerer = useMutateOffers();
    const { userId: currentUserId } = useAuth();

    if (!task) return <h1 className="text-center text-xl font-semibold">Loading...</h1>;

    const handleCompleteRequest = () => {
        offerer.completeRequest({ requestId: task.id });
        window.location.reload();
    };

    const isSelectedProvider = task.selected?.provider.account === currentUserId;
    const hasSelection = Boolean(task.selected?.provider.account);

    return (
        <JobDetailHeader
            title={task.title}
            actions={
                <>
                    <Link href={`/chat?peerId=${task.consumer.account}&taskId=${task.id}&mode=provider`}>
                        <Button size="sm" pill>
                            Contact
                        </Button>
                    </Link>
                    {!task.completedDate ? (
                        <Badge tone={task.selected ? "assigned" : "open"}>
                            {task.selected ? "Assigned" : "Open"}
                        </Badge>
                    ) : (
                        <Badge tone="premium">Done</Badge>
                    )}
                </>
            }
            info={[
                { icon: <MapPin size={16} />, label: "Location", value: task.location },
                {
                    icon: <Calendar size={16} />,
                    label: "To be done on",
                    value: task.dueDate ? dayjs(task.dueDate).format("ddd Do, YYYY") : "Flexible",
                },
                { icon: <DollarSign size={16} />, label: "Budget", value: `$${task.budget}` },
                { icon: <User size={16} />, label: "Posted by", value: task.consumer.name },
            ]}
        >
            {!task.completedDate && (
                <div className="mt-12 flex justify-end">
                    {isSelectedProvider ? (
                        <Button pill onClick={handleCompleteRequest}>
                            Mark as completed
                        </Button>
                    ) : (
                        <Button variant="ghost" pill disabled>
                            {hasSelection ? "Application not selected" : "Application pending"}
                        </Button>
                    )}
                </div>
            )}
        </JobDetailHeader>
    );
}

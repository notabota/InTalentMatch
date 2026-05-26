'use client'

import React, { useState, useRef, useEffect } from 'react'
import useQueryMessage from "src/app/hooks/useQueryMessages";
import { useSearchParams } from "next/navigation";
import useAuth from "src/app/hooks/useAuth";
import useMutateMessages from "src/app/hooks/useMutateMessages";
import useMutateOffers from "src/app/hooks/useMutateOffers";
import useQueryTask from "src/app/hooks/useQueryTask";
import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import useQueryProfile from "src/app/hooks/useQueryProfile";
import { Avatar, Button, Modal } from "@/components/ui";
import { cn } from "@/lib/cn";

export default function MainContent() {
    const searchParams = useSearchParams();
    const peerId = searchParams.get('peerId');
    const taskId = searchParams.get('taskId');
    const offerId = searchParams.get('offerId');
    const mode = searchParams.get('mode');

    const [showAcceptOfferModal, setShowAcceptOfferModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const { userId: currentUserId } = useAuth();
    const { messages } = useQueryMessage({ peerId })
    const messenger = useMutateMessages();
    const [inputMessage, setInputMessage] = useState("");
    const offerer = useMutateOffers();
    const { task, taskState } = useQueryTask({ requestId: taskId });
    const peerProfile = useQueryProfile(peerId);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const reversedMessage = messages ? messages.toReversed() : [];

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        if (isNearBottom) container.scrollTop = container.scrollHeight;
    }, [reversedMessage]);

    if (!messages || !task || !peerProfile.providerProfile || !peerProfile.consumerProfile)
        return <div className="py-20 text-center text-xl font-semibold">Loading...</div>;

    const handleSend = () => {
        if (mode == "provider" && messages.length == 0 && task.selected?.provider.account != currentUserId) {
            setShowErrorModal(true);
            return;
        }
        if (!inputMessage.trim()) return;
        messenger.postMessage({ peerId }, inputMessage);
        setInputMessage("");
    };

    const handleAcceptOffer = () => {
        if (!taskId || !offerId) return;
        setShowAcceptOfferModal(true);
        offerer.selectOffer({ requestId: taskId, offerId });
        window.location.reload();
    };

    const handleCompleteRequest = () => {
        if (!taskId) return;
        offerer.completeRequest({ requestId: taskId });
        window.location.reload();
    };

    const statusPill = (label: string, tone: "navy" | "danger" = "navy") => (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white",
                tone === "danger" ? "bg-danger" : "bg-primary",
            )}
        >
            {label}
        </span>
    );

    const viewCandidateLink = (
        <Link href={`/profile/public?userId=${peerId}`}>
            <Button size="sm" className="bg-star text-primary hover:opacity-90">
                View assigned candidate
                <ArrowRight className="h-4 w-4" />
            </Button>
        </Link>
    );

    const OfferActionButton = () => {
        if (!taskState) return null;

        if (taskState == "completed") return statusPill("This job has been completed");

        if (mode === "consumer") {
            if (taskState == "assigned") {
                return (
                    <div className="flex items-center gap-3">
                        {statusPill(
                            task.selected.provider.account == peerId
                                ? "You assigned this job to this candidate"
                                : "You assigned this job to another candidate",
                        )}
                        {viewCandidateLink}
                    </div>
                );
            }
            return (
                <div className="flex items-center gap-3">
                    <Button size="sm" className="bg-success hover:opacity-90" onClick={handleAcceptOffer}>
                        Accept application
                    </Button>
                    {viewCandidateLink}
                </div>
            );
        }

        if (taskState == "opened" || taskState == "offered") return statusPill("This job is currently open");

        if (mode === "provider") {
            if (task.selected?.provider.account === currentUserId) {
                if (!task.completedDate) {
                    return (
                        <Button size="sm" className="bg-success hover:opacity-90" onClick={handleCompleteRequest}>
                            Mark as completed
                        </Button>
                    );
                }
                return statusPill("This job is already complete");
            }
            return statusPill("This job is assigned to someone else", "danger");
        }
    };

    const peerName =
        mode === "consumer"
            ? `Candidate ${peerProfile.providerProfile.name}`
            : `Employer ${peerProfile.consumerProfile.name}`;

    return (
        <div className="mx-auto flex h-[80vh] w-full max-w-5xl flex-col">
            <div className="flex flex-col justify-between gap-3 rounded-t-[var(--radius-card)] border border-border bg-surface-muted p-4 md:flex-row md:items-center">
                <div>
                    <div className="text-lg font-semibold text-text">Chat with {peerName}</div>
                    <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-text-muted">
                        <span><span className="font-medium text-text">Job:</span> {task.title}</span>
                        <span><span className="font-medium text-text">Budget:</span> ${task.budget}</span>
                        {task.dueDate && (
                            <span><span className="font-medium text-text">Due:</span> {new Date(task.dueDate).toLocaleDateString()}</span>
                        )}
                    </div>
                </div>
                <div><OfferActionButton /></div>
            </div>

            <div ref={scrollContainerRef} className="flex-1 space-y-4 overflow-y-auto border-x border-border p-6">
                {reversedMessage.map((msg) => {
                    const isSender = msg.sender === currentUserId;
                    return (
                        <div key={msg.id} className={cn("flex items-start gap-2", isSender && "justify-end")}>
                            {!isSender && <Avatar src="https://www.gravatar.com/avatar/?d=mp" size="sm" />}
                            <div>
                                <div
                                    className={cn(
                                        "max-w-md rounded-xl p-3",
                                        isSender ? "bg-primary text-white" : "bg-surface-muted text-text",
                                    )}
                                >
                                    {msg.content}
                                </div>
                                <div className={cn("mt-1 text-xs text-text-muted", isSender && "text-right")}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </div>
                            </div>
                            {isSender && <Avatar src="https://www.gravatar.com/avatar/?d=mp" size="sm" />}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-2 rounded-b-[var(--radius-card)] border border-border p-4">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type something"
                    className="flex-1 rounded-[var(--radius-input)] border border-border px-4 py-2 text-text outline-none focus:border-accent"
                />
                <button onClick={handleSend} className="cursor-pointer text-accent" aria-label="Send">
                    <Send className="h-6 w-6" />
                </button>
            </div>

            <Modal open={showAcceptOfferModal} onClose={() => setShowAcceptOfferModal(false)} tone="white" className="max-w-sm text-center">
                <p className="text-text">Application accepted.</p>
            </Modal>
            <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)} tone="white" className="max-w-md text-center">
                <p className="text-text">You cannot contact an employer without prior messages or an accepted application.</p>
            </Modal>
        </div>
    );
}

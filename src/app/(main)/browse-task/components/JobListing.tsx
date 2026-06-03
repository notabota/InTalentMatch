"use client";
import { useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MapPin, Calendar, User } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TasksResponseType } from "src/app/constants/type";
import useMutateOffers from "src/app/hooks/useMutateOffers";
import useQueryProvider from "src/app/hooks/useQueryProvider";
import { useQueryCards } from "src/app/hooks/useQueryCards";
import useAuth from "src/app/hooks/useAuth";
import useQueryTask from "src/app/hooks/useQueryTask";
import { Badge, Button, IconText, Modal, RangeSlider } from "@/components/ui";

dayjs.extend(relativeTime);

const JobListing = ({ task }: { task: TasksResponseType }) => {
    const { userId: currentUserId } = useAuth();
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [offerValue, setOfferValue] = useState(task.budget);
    const { providerProfile } = useQueryProvider();
    const { cards } = useQueryCards();
    const offerer = useMutateOffers();
    const taskQuery = useQueryTask({});

    const handleConfirmOffer = () => {
        setShowOfferModal(false);
        setShowSuccessModal(true);
        if (providerProfile.isPremium) offerer.postOffer({ requestId: task.id, price: offerValue });
        else offerer.postOffer({ requestId: task.id });
    };

    const handleApply = async (budget: number, taskId: string) => {
        const currentTask = await taskQuery.getTask({ requestId: taskId });
        const offers = currentTask.offers;
        const hasMatch = offers.some((offer) => offer.provider.account.includes(currentUserId));
        if (hasMatch) {
            setShowErrorModal(true);
            return;
        }
        setOfferValue(budget);
        setShowOfferModal(true);
    };

    if (!providerProfile) return null;

    const isOwnPosting = task.consumer.account === currentUserId;

    return (
        <div className="relative mx-auto max-w-lg rounded-[var(--radius-card)] bg-surface p-6 shadow-card">
            <div className="flex items-start justify-between">
                <h1 className="font-sans text-2xl font-bold text-text">{task.title}</h1>
                <Badge tone="premium">OPEN</Badge>
            </div>

            <div className="mt-4 flex justify-between gap-4">
                <div className="space-y-3">
                    <IconText icon={<MapPin className="h-4 w-4" />} label="Location" value={task.location} />
                    <IconText icon={<User className="h-4 w-4" />} label="Posted by" value={task.consumer.name} />
                    {task.dueDate && (
                        <IconText
                            icon={<Calendar className="h-4 w-4" />}
                            label="To be done on"
                            value={dayjs(task.dueDate).format("ddd Do, YYYY")}
                        />
                    )}
                </div>

                <div className="mt-8 h-fit w-40 rounded-[var(--radius-card)] bg-surface-muted p-4 text-center shadow-card">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-text-muted">Budget</span>
                    <p className="mt-1 text-2xl font-bold text-text">${task.budget}</p>
                    {isOwnPosting ? (
                        <Button size="sm" pill className="mt-3" disabled>
                            Your posting
                        </Button>
                    ) : (
                        <Button size="sm" pill className="mt-3" onClick={() => handleApply(task.budget, task.id)}>
                            Apply
                        </Button>
                    )}
                </div>
            </div>

            <div className="mt-8">
                {isOwnPosting ? (
                    <Link href={`/my-requests/details?taskId=${task.id}`}>
                        <Button variant="outline" pill>
                            See posting details
                        </Button>
                    </Link>
                ) : (
                    <Link href={`/chat?peerId=${task.consumer.account}&taskId=${task.id}&mode=provider`}>
                        <Button pill>Message the employer</Button>
                    </Link>
                )}
            </div>

            <div className="mt-8">
                <h2 className="mb-2 text-lg font-semibold text-text">About the job</h2>
                <p className="text-sm leading-relaxed text-text-muted">{task.description}</p>
            </div>

            <Modal open={showOfferModal} onClose={() => setShowOfferModal(false)}>
                {cards.length === 0 ? (
                    <>
                        <h2 className="text-center text-xl font-bold text-danger">
                            You have no connected payment methods.
                            <br />
                            Please add one before applying.
                        </h2>
                        <div className="mt-6 flex justify-end">
                            <Button variant="ghost" onClick={() => setShowOfferModal(false)}>
                                Close
                            </Button>
                        </div>
                    </>
                ) : (
                    <div>
                        <h2 className="mb-4 text-xl font-bold text-accent">Submit your application</h2>

                        <div className="mb-2 flex justify-between text-sm text-text">
                            <span>$0</span>
                            <span className="text-text-muted">Offer: ${offerValue}</span>
                            <span>${task.budget}</span>
                        </div>

                        <RangeSlider min={0} max={task.budget} value={offerValue} onChange={setOfferValue} />

                        {providerProfile.isPremium ? (
                            <div className="mt-6 text-sm text-text">
                                <div className="mb-1 flex justify-between text-text-muted">
                                    <span>Transaction fee (Premium Candidate)</span>
                                    <span>-$0.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>You&apos;ll receive</span>
                                    <span>${offerValue}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 text-sm text-text">
                                <div className="mb-1 flex justify-between text-text-muted">
                                    <span>Transaction fee</span>
                                    <span>{`-$${(offerValue * 0.1).toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>You&apos;ll receive</span>
                                    <span>{`$${(offerValue * 0.9).toFixed(2)}`}</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-4">
                            <Button variant="ghost" onClick={() => setShowOfferModal(false)}>
                                Close
                            </Button>
                            <Button onClick={handleConfirmOffer}>Confirm</Button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                <h2 className="mb-2 text-xl font-bold text-accent">Your application has been submitted successfully!</h2>
                <p className="mb-6 text-text">Please wait for acceptance from the poster</p>
                <div className="flex justify-end gap-4">
                    <Button variant="ghost" onClick={() => setShowSuccessModal(false)}>
                        Close
                    </Button>
                    <Button
                        onClick={() =>
                            redirect(`/chat?peerId=${task.consumer.account}&taskId=${task.id}&mode=provider`)
                        }
                    >
                        View job
                    </Button>
                </div>
            </Modal>

            <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)} showClose tone="white" className="max-w-md">
                <p className="text-center text-text">You have already applied to this job.</p>
            </Modal>
        </div>
    );
};

export default JobListing;

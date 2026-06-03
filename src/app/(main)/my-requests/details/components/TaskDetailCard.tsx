import React, { useState } from "react";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import { TaskResponseType } from "src/app/constants/type";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useMutateReviews from "src/app/hooks/useMutateReviews";
import { Badge, Button, Modal, Rating, Textarea } from "@/components/ui";
import JobDetailHeader from "@/components/domain/JobDetailHeader";
import { cn } from "@/lib/cn";

dayjs.extend(relativeTime);

function ApplicantGroup({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mt-6">
            <p className="mb-2 font-semibold text-text">{label}</p>
            <div className="flex items-center gap-2">{children}</div>
        </div>
    );
}

export default function TaskDetailCard({ task }: { task: TaskResponseType }) {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewDescription, setReviewDescription] = useState("");
    const reviewer = useMutateReviews();

    if (!task) return <h1 className="text-center text-xl font-semibold">Loading...</h1>;

    const handleConfirm = () => {
        reviewer.postReview({ requestId: task.id, description: reviewDescription, rating });
        setShowReviewModal(false);
        setShowSuccessModal(true);
    };

    const sortByPrice = (a: (typeof task.offers)[0], b: (typeof task.offers)[0]) => {
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return a.price - b.price;
    };

    const hasApplicants = Array.isArray(task.offers);
    const premiumOffers = hasApplicants
        ? task.offers.filter((offer) => offer.provider.isPremium).sort(sortByPrice)
        : [];
    const regularOffers = hasApplicants
        ? task.offers.filter((offer) => !offer.provider.isPremium).sort(sortByPrice)
        : [];

    const avatar = (premium: boolean) =>
        cn("h-8 w-8 rounded-full", premium ? "bg-star" : "bg-primary");

    return (
        <>
            <JobDetailHeader
                title={task.title}
                actions={
                    !task.completedDate && (
                        <Badge tone={task.selected ? "assigned" : "open"}>
                            {task.selected ? "Assigned" : "Open"}
                        </Badge>
                    )
                }
                info={[
                    { icon: <MapPin size={16} />, label: "Location", value: task.location },
                    {
                        icon: <Calendar size={16} />,
                        label: "To be done",
                        value: task.dueDate ? dayjs(task.dueDate).format("ddd Do, YYYY") : "Flexible",
                    },
                    { icon: <DollarSign size={16} />, label: "Budget", value: `$${task.budget}` },
                ]}
            >
                {premiumOffers.length != 0 && (
                    <ApplicantGroup label="Top Applicants">
                        {premiumOffers.map((offer) => (
                            <Link
                                key={offer.id}
                                href={`/chat?peerId=${offer.provider.account}&offerId=${offer.id}&taskId=${task.id}&mode=consumer`}
                                className={avatar(true)}
                            />
                        ))}
                    </ApplicantGroup>
                )}
                {regularOffers.length != 0 && (
                    <ApplicantGroup label="Applicants">
                        {regularOffers.map((offer) => (
                            <Link
                                key={offer.id}
                                href={`/chat?peerId=${offer.provider.account}&offerId=${offer.id}&taskId=${task.id}&mode=consumer`}
                                className={avatar(false)}
                            />
                        ))}
                    </ApplicantGroup>
                )}
                {task.selected && (
                    <ApplicantGroup label="Selected">
                        <Link
                            href={`/chat?peerId=${task.selected.provider.account}&taskId=${task.id}&mode=consumer`}
                            className={avatar(task.selected.provider.isPremium)}
                        />
                        {task.completedDate && (
                            <Button size="sm" className="bg-star text-primary hover:opacity-90" onClick={() => setShowReviewModal(true)}>
                                Review
                            </Button>
                        )}
                    </ApplicantGroup>
                )}
            </JobDetailHeader>

            <Modal open={showReviewModal} onClose={() => setShowReviewModal(false)} tone="white" className="max-w-xl">
                <h3 className="mb-3 text-lg font-semibold text-text">Rate your experience</h3>
                <Textarea
                    value={reviewDescription}
                    onChange={(e) => setReviewDescription(e.target.value)}
                    placeholder="Share your experience"
                    rows={4}
                    className="border-accent"
                />
                <div className="my-4 flex justify-center">
                    <Rating value={rating} editable onChange={setRating} size={32} />
                </div>
                <div className="flex gap-3">
                    <Button className="flex-1 bg-star text-primary hover:opacity-90" onClick={handleConfirm}>
                        Confirm
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setShowReviewModal(false)}>
                        Close
                    </Button>
                </div>
            </Modal>

            <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} tone="white" className="max-w-sm text-center">
                <h2 className="text-lg font-semibold text-text">Success!</h2>
                <p className="mb-6 mt-2 text-text-muted">Your review has been submitted.</p>
                <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
                    Close
                </Button>
            </Modal>
        </>
    );
}

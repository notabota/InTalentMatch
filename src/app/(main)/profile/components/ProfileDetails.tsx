"use client";
import React, { useState } from "react";
import {
    CommonDetailType,
    PaymentReceiveCardType,
    ProfileType,
    ProviderProfileType,
} from "src/app/constants/type";
import { MapPin, ChevronRight, ArrowDownRight, ArrowUpRight, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMutateProvider } from "src/app/hooks/useMutateProvider";
import { useMutateAccount } from "src/app/hooks/useMutateAccount";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import useQueryProfile from "src/app/hooks/useQueryProfile";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import useQueryNotifications from "src/app/hooks/useQueryNotifications";
import { useQueryCards } from "src/app/hooks/useQueryCards";
import { Avatar, Button, Card, Chip, Input, Table, Textarea } from "@/components/ui";
import type { Column } from "@/components/ui";

const ACCENT = "#0E65FB";

const ProfileDetails = ({
    providerProfile,
    commonDetail,
    profileType,
    isEditing,
    onIsEditingChange,
    subpage,
    onSubpageChange,
}: {
    providerProfile: ProviderProfileType;
    commonDetail: CommonDetailType;
    profileType: ProfileType;
    isEditing: boolean;
    onIsEditingChange: (value: boolean) => void;
    subpage: string;
    onSubpageChange: (value: string) => void;
}) => {
    if (profileType === "provider") {
        return (
            <ProviderProfile
                providerProfile={providerProfile}
                isEditing={isEditing}
                onIsEditingChange={onIsEditingChange}
                subpage={subpage}
            />
        );
    }
    return (
        <ConsumerProfile
            commonDetail={commonDetail}
            isEditing={isEditing}
            onIsEditingChange={onIsEditingChange}
            subpage={subpage}
        />
    );
};

const ProviderProfile = ({
    providerProfile,
    isEditing,
    onIsEditingChange,
    subpage,
}: {
    providerProfile: ProviderProfileType;
    isEditing: boolean;
    onIsEditingChange: (value: boolean) => void;
    subpage: string;
}) => {
    const [showAll, setShowAll] = useState(false);
    const [categories, setCategories] = useState(providerProfile.categories.map((c) => c.name));
    const [newCategory, setNewCategory] = useState("");
    const [description, setDescription] = useState(providerProfile.description || "");
    const updateProviderInfo = useMutateProvider();
    const { cards } = useQueryCards();

    const tasks = providerProfile.completedRequests;
    const visibleTasks = showAll ? tasks : tasks.slice(0, 3);

    const addCategory = () => {
        const trimmed = newCategory.trim();
        if (trimmed && !categories.includes(trimmed)) setCategories((prev) => [...prev, trimmed]);
        setNewCategory("");
    };
    const removeCategory = (category: string) =>
        setCategories((prev) => prev.filter((c) => c !== category));

    function handleCancel() {
        setDescription(providerProfile.description || "");
        setCategories(providerProfile.categories?.map((c) => c.name) || []);
        onIsEditingChange(false);
    }

    if (subpage === "performance") return <DashboardPerformance />;
    if (subpage === "payment-methods") return <PaymentMethods cards={cards} />;

    const columns: Column<(typeof tasks)[number]>[] = [
        { key: "title", header: "Job", render: (t) => t.title },
        { key: "client", header: "Client", render: (t) => t.consumer.name },
        { key: "date", header: "Date", render: (t) => dayjs(t.completedDate).format("DD/MM/YYYY") },
        { key: "location", header: "Location", render: (t) => t.location },
        {
            key: "earnings",
            header: "Earnings",
            align: "right",
            render: (t) => (
                <span className="rounded-full bg-surface-muted px-2 py-1 text-xs">${t.budget}</span>
            ),
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-3 font-semibold text-text">About me</h3>
                <Card tone="white" className="relative">
                    {isEditing ? (
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write something about yourself..."
                            rows={2}
                            className="border-none p-0 focus:border-none"
                        />
                    ) : (
                        <p className="whitespace-pre-wrap text-sm text-text">
                            {providerProfile.description || "No description added yet."}
                        </p>
                    )}
                    {!isEditing && (
                        <div className="mt-3 flex justify-end">
                            <Button variant="link" onClick={() => onIsEditingChange(true)}>
                                Edit
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            <div>
                <h3 className="mb-3 font-semibold text-text">Completed jobs</h3>
                <Table columns={columns} rows={visibleTasks} rowKey={(_, i) => i} />
                {tasks.length > 3 && (
                    <div className="mt-3 text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-sm font-semibold text-text hover:underline"
                        >
                            {showAll ? "Show less" : "Show more"}
                        </button>
                    </div>
                )}
            </div>

            <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-text">
                    <Tag size={18} /> Skills
                </h3>
                {isEditing ? (
                    <Card tone="white" className="space-y-5">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Chip key={category} tone="soft" onRemove={() => removeCategory(category)}>
                                    {category}
                                </Chip>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a skill"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="flex-1 bg-surface-muted"
                            />
                            <Button onClick={addCategory}>Add</Button>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" fullWidth onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                fullWidth
                                onClick={() => updateProviderInfo.updateProviderProfile({ description, categories })}
                            >
                                Update Profile
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <Chip key={category}>{category}</Chip>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ConsumerProfile = ({
    commonDetail,
    isEditing,
    onIsEditingChange,
    subpage,
}: {
    commonDetail: CommonDetailType;
    isEditing: boolean;
    onIsEditingChange: (value: boolean) => void;
    subpage: string;
}) => {
    const [formData, setFormData] = useState({
        fullName: commonDetail.fullName ?? "",
        email: commonDetail.email ?? "",
        phone: commonDetail.phoneNumber ?? "",
        address: commonDetail.address ?? "",
    });

    const { notifications } = useQueryNotifications();
    const updateAccount = useMutateAccount();
    const { cards } = useQueryCards();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateAccount.updateAccountInfo({
            fullName: formData.fullName,
            phoneNumber: formData.phone,
            address: formData.address,
        });
    };

    function handleCancel() {
        setFormData({
            fullName: commonDetail.fullName ?? "",
            email: commonDetail.email ?? "",
            phone: commonDetail.phoneNumber ?? "",
            address: commonDetail.address ?? "",
        });
        onIsEditingChange(false);
    }

    if (subpage === "payment-methods") return <PaymentMethods cards={cards} />;

    if (subpage === "notifications") {
        return (
            <Card tone="white">
                <h2 className="mb-6 text-2xl font-bold text-text">Notifications</h2>
                {notifications.length != 0 ? (
                    <div className="space-y-4">
                        {notifications.map((item) => (
                            <div key={item.id} className="flex items-start gap-4">
                                <Avatar src="https://www.gravatar.com/avatar/?d=mp" size="sm" />
                                <div>
                                    <p className="font-medium text-text">{item.title}</p>
                                    <p className="text-sm text-text-muted">{item.content}</p>
                                    <p className="mt-1 text-xs text-text-muted">
                                        {dayjs(item.timestamp).format("MMM D, YYYY HH:mm")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-muted">No notifications.</p>
                )}
            </Card>
        );
    }

    const field = (label: string, name: keyof typeof formData, editable = true, icon?: React.ReactNode) => (
        <div>
            <label className="block text-sm font-medium text-text">{label}</label>
            {isEditing && editable ? (
                <Input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    leftIcon={icon}
                    className="mt-1 bg-surface-muted"
                />
            ) : (
                <p className="mt-1 flex items-center gap-2 text-text">
                    {icon && <span className="text-text-muted">{icon}</span>}
                    {formData[name] || "-"}
                </p>
            )}
        </div>
    );

    return (
        <Card tone="white" className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-text">Personal Information</h2>
                <p className="text-text-muted">Manage your personal details</p>
            </div>

            <div className="space-y-5">
                {field("Full Name", "fullName")}
                {field("Email Address", "email", false)}
                {field("Phone Number", "phone")}
                {field("Address", "address", true, <MapPin className="h-5 w-5" />)}
            </div>

            {isEditing && (
                <div className="flex justify-end gap-4 pt-2">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Profile</Button>
                </div>
            )}
        </Card>
    );
};

function DashboardPerformance() {
    const { providerProfile, consumerProfile, commonDetail } = useQueryProfile();

    if (!providerProfile || !consumerProfile || !commonDetail) {
        return <div>Loading performance data...</div>;
    }

    const completedRequests = providerProfile.completedRequests;
    const bookingByMonth: Record<string, number> = {};
    const revenueByMonth: Record<string, number> = {};

    completedRequests.forEach((request) => {
        const monthKey = dayjs(request.completedDate).format("MMM YYYY");
        bookingByMonth[monthKey] = (bookingByMonth[monthKey] || 0) + 1;
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + request.budget;
    });

    const sortedMonths = Object.keys(bookingByMonth).sort(
        (a, b) => dayjs(a, "MMM YYYY").unix() - dayjs(b, "MMM YYYY").unix(),
    );
    const bookingData = sortedMonths.map((month) => ({ name: month, value: bookingByMonth[month] }));
    const revenueData = sortedMonths.map((month) => ({ name: month, value: revenueByMonth[month] }));

    const currentMonth = sortedMonths[sortedMonths.length - 1];
    const prevMonth = sortedMonths[sortedMonths.length - 2];
    const currentBookings = bookingByMonth[currentMonth] || 0;
    const prevBookings = bookingByMonth[prevMonth] || 0;
    const currentRevenue = revenueByMonth[currentMonth] || 0;
    const prevRevenue = revenueByMonth[prevMonth] || 0;
    const bookingGrowth = prevBookings > 0 ? ((currentBookings - prevBookings) / prevBookings) * 100 : 0;
    const revenueGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    const totalRevenue = completedRequests.reduce((acc, req) => acc + req.budget, 0);
    const totalBookings = completedRequests.length;
    const completionRate = 100;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card tone="white" className="space-y-2">
                    <p className="text-sm text-text-muted">Statistics</p>
                    <p className="font-medium text-text">Total completed jobs</p>
                    {totalBookings != 0 ? (
                        <>
                            <div className="text-3xl font-bold text-text">{totalBookings}</div>
                            <div className={`flex items-center text-sm ${bookingGrowth >= 0 ? "text-success" : "text-danger"}`}>
                                {bookingGrowth >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                <span>{bookingGrowth.toFixed(1)}%</span>
                            </div>
                            <ResponsiveContainer width="100%" height={60}>
                                <LineChart data={bookingData}>
                                    <Line type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </>
                    ) : (
                        <p className="text-text-muted">No bookings yet.</p>
                    )}
                </Card>

                <Card tone="white" className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-sm text-text-muted">Statistics</p>
                    <p className="font-medium text-text">Completion rate</p>
                    <div className="relative h-32 w-32">
                        <CircularProgressbar
                            value={completionRate}
                            text={`${completionRate}%`}
                            circleRatio={0.75}
                            styles={buildStyles({
                                rotation: 0.625,
                                strokeLinecap: "round",
                                trailColor: "#e5e7eb",
                                pathColor: ACCENT,
                                textColor: "#000022",
                                textSize: "24px",
                            })}
                        />
                    </div>
                </Card>
            </div>

            <Card tone="white" className="space-y-4">
                <p className="text-sm text-text-muted">Statistics</p>
                <p className="font-medium text-text">Total revenue</p>
                {totalRevenue != 0 ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-4xl font-bold text-text">
                            <span>${totalRevenue.toLocaleString()}</span>
                            <span className={`flex items-center text-base ${revenueGrowth >= 0 ? "text-success" : "text-danger"}`}>
                                {revenueGrowth >= 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                                {revenueGrowth.toFixed(1)}%
                            </span>
                        </div>
                        <ResponsiveContainer width="100%" height={150}>
                            <LineChart data={revenueData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                                <Tooltip contentStyle={{ borderRadius: "0.5rem" }} />
                                <Line type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={2} dot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 7 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-text-muted">No revenue yet.</p>
                )}
            </Card>
        </div>
    );
}

function PaymentMethods({ cards }: { cards: PaymentReceiveCardType[] }) {
    const maskCardNumber = (cardNumber: string) => `•••• ${cardNumber.slice(-4)}`;

    return (
        <Card tone="white" className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-text">Payment methods</h2>
                <p className="text-text-muted">How you will pay and receive money.</p>
            </div>

            {cards.map((card, index) => (
                <div
                    key={index}
                    className="flex cursor-pointer items-center justify-between rounded-lg bg-surface-muted p-4 transition hover:bg-border"
                >
                    <div className="flex items-center gap-3">
                        <Image src="/mastercard-logo.svg" alt="Card" width={25} height={25} />
                        <span className="font-medium text-text">
                            {card.name} {maskCardNumber(card.number)}
                        </span>
                    </div>
                    <ChevronRight className="text-text-muted" />
                </div>
            ))}

            <Link href="/add-payment-method">
                <Button variant="outline" fullWidth>
                    + Add payment method
                </Button>
            </Link>
        </Card>
    );
}

export default ProfileDetails;

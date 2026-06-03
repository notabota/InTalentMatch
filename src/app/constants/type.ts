export type ProfileType = 'consumer' | 'provider';

export type RequestOfferType = {
    id: string;
    provider: string;
    request: string;
    price: number;
};

export type CategoryType = {
    id: string;
    name: string;
};

export type SelectedType = {
    id: string;
    provider: string;
    request: string;
    price: number;
};

export type CompletedRequestType = {
    id: string;
    consumer: ConsumerProfileType;
    selected: SelectedType;
    title: string;
    description: string;
    location: string;
    budget: number;
    dueDate: string;
    remoteEligible: boolean;
    completedDate: string;
    offers: RequestOfferType[];
    categories: CategoryType[];
};

export type ProviderProfileType = {
    status?: number;
    id: string;
    account: string;
    name: string;
    description: string;
    averageRating: number;
    address: string;
    totalRating: number;
    reviewCount: number;
    isPremium: boolean;
    isSubscriptionActive: boolean;
    subscriptionDate: string;
    categories: CategoryType[];
    completedRequests: CompletedRequestType[];
};

export type ConsumerProfileType = {
    id: string;
    account: string;
    requestsPosted: number;
    requestsCompleted: number;
    name: string;
};

export type CommonDetailType = {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    address: string;
};
export type PaymentSendCardType = {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
};

export type PaymentReceiveCardType = {
    id: string;
    number: string;
    expiry: string;
    cvv: string;
    name: string;
};

export type CategoryResponseType = {
    id: string;
    name: string;
}

export type TasksResponseType = {
    id: string;
    title: string;
    location: string;
    description: string;
    dueDate: string;
    budget: number;
    remoteEligible: boolean;
    consumer: {
        id: string;
        account: string;
        name: string;
        requestPosted: number;
        requestsCompleted: number;
    }
    selected?: {
        id: string;
        provider: {
            id: string,
            account: string,
            description: string,
            totalRating: number,
            reviewCount: number,
            isPremium: boolean,
            isSubscriptionActive: boolean,
        }
    }[]
    completedDate?: string
}

export type TasksRequestType = {
    title: string;
    location: string;
    description: string;
    dueDate?: string;
    budget: number;
    remoteEligible: boolean;
    category: string[];
}

export type TaskRequestType = {
    requestId: string;
}

export type TaskResponseType = {
    id: string;
    title: string;
    location: string;
    name: string;
    address: string;
    email: string;
    description: string;
    dueDate: string;
    budget: number;
    remoteEligible: boolean;
    offers: {
        id: string,
        provider: {
            id: string,
            account: string,
            description: string,
            totalRating: number,
            reviewCount: number,
            isPremium: boolean,
            isSubscriptionActive: boolean,
        },
        request: string,
        price: number | null
    }[],
    selected: {
        id: string,
        provider: {
            id: string,
            account: string,
            description: string,
            totalRating: number,
            reviewCount: number,
            isPremium: boolean,
            isSubscriptionActive: boolean
        },
        request: string,
        price: number
    }
    completedDate?: string;
    consumer: ConsumerProfileType
}

export type TaskState = 'opened' | 'offered' | 'assigned' | 'completed'

export type OfferRequestType = {
    requestId: string;
    price?: number;
}

export type SelectOfferRequestType = {
    requestId: string;
    offerId: string;
}

export type CompleteRequestRequestType = {
    requestId: string;
}

export type MessageRequestType = {
    peerId: string;
}

export type MessagesResponseType = {
    id: string;
    timestamp: string;
    sender: string;
    receiver: string;
    content: string;
}[]

export type UpdateProfilePayloadType = {
    description: string;
    categories: string[];
};

export type UpdateAccountType = {
    fullName: string;
    phoneNumber: string;
    address: string;
};

export type NotificationResponseType = {
    id: string;
    timestamp: string;
    account: string;
    title: string;
    content: string;
}

export type GetReviewRequestType = {
    requestId: string;
    providerId: string;
}

export type PostReviewRequestType = {
    requestId: string;
    rating: number;
    description: string;
}

import type {
  Account,
  Category,
  Consumer,
  Message,
  Notification,
  Offer,
  PaymentMethod,
  Provider,
  Request,
  Review,
} from "@prisma/client";
import type {
  CategoryModel,
  ConsumerModel,
  MessageModel,
  NotificationModel,
  OfferModel,
  PaymentMethodModel,
  ProviderModel,
  RequestModel,
  ReviewModel,
} from "@/lib/models";

function toTitleCase(value: string): string {
  return value.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function categoryToModel(c: Category): CategoryModel {
  return { id: c.id, name: toTitleCase(c.name) };
}

export function consumerToModel(c: Consumer & { account: Account }): ConsumerModel {
  return {
    id: c.id,
    account: c.account.id,
    name: c.account.fullName,
    requestsPosted: c.requestsPosted,
    requestsCompleted: c.requestsCompleted,
  };
}

export function providerToModel(p: Provider & { account: Account }): ProviderModel {
  return {
    id: p.id,
    account: p.account.id,
    name: p.account.fullName,
    phoneNumber: p.account.phoneNumber,
    address: p.account.address,
    email: p.account.email,
    description: p.description,
    totalRating: p.totalRating,
    reviewCount: p.reviewCount,
    isPremium: p.isPremium,
    isSubscriptionActive: p.isSubscriptionActive,
    subscriptionDate: p.subscriptionDate?.toISOString(),
  };
}

export function offerToModel(
  o: Offer & { provider: Provider & { account: Account } },
): OfferModel {
  return {
    id: o.id,
    provider: providerToModel(o.provider),
    request: o.requestId,
    price: o.price === null ? null : Number(o.price),
  };
}

export type RequestWithRelations = Request & {
  consumer: Consumer & { account: Account };
  selected: (Offer & { provider: Provider & { account: Account } }) | null;
};

export function requestToModel(r: RequestWithRelations): RequestModel {
  return {
    id: r.id,
    consumer: consumerToModel(r.consumer),
    selected: r.selected ? offerToModel(r.selected) : null,
    title: r.title,
    description: r.description,
    location: r.location,
    budget: Number(r.budget),
    dueDate: r.dueDate ? r.dueDate.toISOString() : null,
    remoteEligible: r.remoteEligible,
    completedDate: r.completedDate ? r.completedDate.toISOString() : undefined,
  };
}

export function reviewToModel(r: Review): ReviewModel {
  return {
    id: r.id,
    request: r.requestId,
    rating: r.rating,
    description: r.description,
  };
}

export function messageToModel(m: Message): MessageModel {
  return {
    id: m.id,
    timestamp: m.timestamp.toISOString(),
    sender: m.senderId,
    receiver: m.receiverId,
    content: m.content,
  };
}

export function notificationToModel(n: Notification): NotificationModel {
  return {
    id: n.id,
    timestamp: n.timestamp.toISOString(),
    account: n.accountId,
    title: n.title,
    content: n.content,
  };
}

export function paymentMethodToModel(p: PaymentMethod): PaymentMethodModel {
  if (p.type === "CardPaymentMethod") {
    return { id: p.id, number: p.number ?? undefined };
  }
  return { id: p.id };
}

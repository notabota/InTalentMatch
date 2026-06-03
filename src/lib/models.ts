export interface AccountModel {
  id: string;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  address: string | null;
}

export interface CategoryModel {
  id: string;
  name: string;
}

export interface ConsumerModel {
  id: string;
  account: string;
  name: string | null;
  requestsPosted: number;
  requestsCompleted: number;
}

export interface ProviderModel {
  id: string;
  account: string;
  name: string | null;
  phoneNumber: string | null;
  address: string | null;
  email: string | null;
  description: string | null;
  averageRating?: number;
  totalRating?: number;
  reviewCount: number;
  isPremium: boolean;
  isSubscriptionActive: boolean;
  subscriptionDate?: string;
  categories?: CategoryModel[];
  completedRequests?: RequestModel[];
}

export interface OfferModel {
  id: string;
  provider: ProviderModel;
  request: string;
  price: number | null;
}

export interface RequestModel {
  id: string;
  consumer: ConsumerModel;
  selected: OfferModel | null;
  title: string;
  description: string;
  location: string;
  budget: number;
  dueDate: string | null;
  remoteEligible: boolean;
  completedDate?: string;
  offers?: OfferModel[];
  categories?: CategoryModel[];
}

export interface ReviewModel {
  id: string;
  request: string;
  rating: number;
  description: string | null;
}

export interface MessageModel {
  id: string;
  timestamp: string;
  sender: string;
  receiver: string;
  content: string;
}

export interface NotificationModel {
  id: string;
  timestamp: string;
  account: string;
  title: string;
  content: string;
}

export interface PaymentMethodModel {
  id: string;
  number?: string;
}

export type PaymentCommandKind = "DebitPaymentCommand" | "CreditPaymentCommand" | "TransferPaymentCommand";

export interface PaymentCommand {
  kind: PaymentCommandKind;
  from?: PaymentMethodModel | null;
  to?: PaymentMethodModel | null;
  amount: number;
}

import { useState, useEffect } from "react";
import { PaymentReceiveCardType } from "src/app/constants/type";
import { getPaymentMethod } from "../helpers/api/payment";


export function useQueryCards() {
  const [cards, setCards] = useState<PaymentReceiveCardType[]>([]);

  const loadCards = async () => {
    try {
      const paymentMethods = await getPaymentMethod();
      setCards(paymentMethods);
    } catch (error) {
      console.error("Failed to fetch payment methods", error);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  return { cards, loadCards };
}

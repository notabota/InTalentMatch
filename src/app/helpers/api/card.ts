import { PaymentSendCardType } from "src/app/constants/type";
import { fetchApi } from "./request";

export async function postCard(data: PaymentSendCardType) {
  return await fetchApi({
    path: "/Payment/Card",
    method: "POST",
    data,
  });
}
import { fetchApi } from "./request";

export async function getPaymentMethod() {
  const res = await fetchApi({ path: "/Payment", method: "GET" });
  return res.json();
}


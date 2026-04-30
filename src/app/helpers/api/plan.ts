import { fetchApi } from "./request";

export async function deActivatePremium() {
  const res = await fetchApi({ path: "/Profile/Provider/DeactivatePremium", method: "POST"});
}
export async function activatePremium(paymentMethod : string) {
  const res = await fetchApi({
    path: "/Profile/Provider/ActivatePremium",
    method: "POST",
    data: { paymentMethod }
  });
}

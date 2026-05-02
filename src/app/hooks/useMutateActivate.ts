import * as plan from "src/app/helpers/api/plan";
import useMutateDeActivate from "./useMutateDeActivate";
import useQuerySubscription from "./useQuerySubscription";

export default function useActivatePremium() {
    const { loadSubscription } = useQuerySubscription();
    const handleCardSelect = async (paymentMethod: string) => {
    try {
      await plan.activatePremium(paymentMethod);
      loadSubscription();
      window.location.reload();
    } catch (err) {
      console.error("Failed to activate premium", err);
    } finally {
    }
  };

  return {
    handleCardSelect
  };
}

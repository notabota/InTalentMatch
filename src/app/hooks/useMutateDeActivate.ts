import * as plan from "src/app/helpers/api/plan";
import { useCallback, useState } from "react";
import useQuerySubscription from "./useQuerySubscription";
import { useQueryCards } from "./useQueryCards";

export default function useMutateDeActivate() {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const { loadSubscription } = useQuerySubscription();
  const { loadCards } = useQueryCards();

  const handlePlanChange = useCallback(async (newStatus: boolean) => {
    if (newStatus) {
      await loadCards();
      setShouldShowModal(true);
    } else {
      await plan.deActivatePremium();
      await loadSubscription();
      setShouldShowModal(false);
      window.location.reload();
    }
  }, [setShouldShowModal]);

  const cancelPlanChange = useCallback(() => {
    setShouldShowModal(false);
  }, [setShouldShowModal]);

  return {
    handlePlanChange,
    cancelPlanChange,
    shouldShowModal,
  };
}

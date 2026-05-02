// hooks/useMutateCard.ts
import {PaymentSendCardType} from "src/app/constants/type";
import {postCard} from "../helpers/api/card";

export default function useMutateCard() {
    const handleAddPayment = async (formData: PaymentSendCardType) => {
        const isFormValid =
            formData.number.trim() !== "" &&
            formData.expiry.trim() !== "" &&
            formData.cvv.trim() !== "" &&
            formData.name.trim() !== "";

        if (!isFormValid) {
            return {
                success: false,
                message: "Please fill in all fields.",
            };
        }

        try {
            const response = await postCard(formData);

            if (response.ok) {
                return {
                    success: true,
                    message: "Payment method added successfully.",
                };
            } else {
                return {
                    success: false,
                    message: await response.json(),
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    };

    return {handleAddPayment};
}

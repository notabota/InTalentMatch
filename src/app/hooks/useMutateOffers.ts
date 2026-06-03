import * as offerApi from "src/app/helpers/api/offers";
import {CompleteRequestRequestType, OfferRequestType, SelectOfferRequestType} from "src/app/constants/type";

export default function useMutateOffers() {

    async function postOffer(data: OfferRequestType) {
        const res = await offerApi.postOffer(data);
        return res;
    }

    async function selectOffer(data: SelectOfferRequestType) {
        const res = await offerApi.selectOffer(data);
        return res;
    }

    async function completeRequest(data: CompleteRequestRequestType) {
        const res = await offerApi.completeRequest(data);
        return res;
    }

    return {
        postOffer,
        selectOffer,
        completeRequest
    };
}



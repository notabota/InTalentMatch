import {fetchApi} from "src/app/helpers/api/request";
import {
    CompletedRequestType,
    CompleteRequestRequestType,
    OfferRequestType,
    SelectOfferRequestType
} from "src/app/constants/type";

export async function postOffer(data: OfferRequestType) {
    await fetchApi({
        path: "/Request/Offer",
        method: "POST",
        data: data
    });
}

export async function selectOffer(data: SelectOfferRequestType) {
    await fetchApi({
        path: "/Request/Offer/SelectOffer",
        method: "POST",
        data: data
    });
}

export async function completeRequest(data: CompleteRequestRequestType) {
    await fetchApi({
        path: "/Request/CompleteRequest",
        method: "POST",
        data: data
    });
}

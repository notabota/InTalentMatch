import {fetchApi} from "src/app/helpers/api/request";
import {GetReviewRequestType, PostReviewRequestType} from "src/app/constants/type";

export async function getReview(data: GetReviewRequestType) {
    const res = await fetchApi({
        path: "/Review",
        data: data
    });

    if (res.status == 200) return await res.json();
    return null;
}

export async function postReview(data: PostReviewRequestType) {
    await fetchApi({
        path: "/Review",
        method: "POST",
        data: data
    });
}

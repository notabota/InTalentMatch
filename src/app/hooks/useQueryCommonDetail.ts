import {useEffect, useState, useCallback} from "react";
import {getCommonDetail} from "src/app/helpers/api/profile";
import {CommonDetailType} from "src/app/constants/type";

export default function useQueryCommonDetail() {
    const [commonDetail, setCommonDetail] = useState<CommonDetailType>();
    const [success, setSuccess] = useState<boolean | null>(null); // null = not yet fetched

    const loadCommonDetail = useCallback(async () => {
        try {
            const detail: CommonDetailType = await getCommonDetail();
            setCommonDetail(detail);
            setSuccess(true);
        } catch (error: any) {
            if (error?.response?.status === 400) {
                console.error("Bad Request (400):", error.response.data);
            } else {
                console.error("Failed to load common detail:", error);
            }
            setSuccess(false);
        }
    }, []);

    useEffect(() => {
        loadCommonDetail();
    }, [loadCommonDetail]);

    return {
        commonDetail,
        success,
        loadCommonDetail,
    };
}

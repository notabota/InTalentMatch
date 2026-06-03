'use client'

import {useEffect, useState} from "react";
import {TasksResponseType} from "src/app/constants/type";
import {getReview} from "src/app/helpers/api/reviews";

export default function useQueryReviews(requestId: string, providerId: string) {
    const [reviews, setReviews] = useState<TasksResponseType[]>()

    useEffect(() => {
        loadReviews();
    }, [])

    async function loadReviews() {
        const tasks: TasksResponseType[] = await getReview({
            requestId,
            providerId
        });
        setReviews(tasks);
    }

    return {
        reviews,
        loadReviews
    };
}

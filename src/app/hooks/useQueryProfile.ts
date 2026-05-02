import {useEffect, useState} from "react";
import {getProviderProfile, getConsumerProfile, getCommonDetail} from "src/app/helpers/api/profile";
import {ProviderProfileType, ConsumerProfileType, CommonDetailType} from "src/app/constants/type";
import useQueryProvider from "./useQueryProvider";
import useQueryConsumer from "./useQueryConsumer";
import useQueryCommonDetail from "./useQueryCommonDetail";

export default function useQueryProfile(userId?: string) {
    const {providerProfile, success: providerProfileSuccess} = useQueryProvider(userId);
    const {consumerProfile, success: consumerProfileSuccess} = useQueryConsumer(userId);
    const {commonDetail, success: commonDetailSuccess} = useQueryCommonDetail();

    return {
        providerProfile,
        consumerProfile,
        commonDetail,
        providerProfileSuccess,
        consumerProfileSuccess,
        commonDetailSuccess
    }
}

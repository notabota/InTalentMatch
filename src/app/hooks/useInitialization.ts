'use client'

import * as initializationApi from "src/app/helpers/api/initialization";
import {useEffect} from "react";

export default function useInitialization() {

    async function initiate() {
        const res = await initializationApi.initiateProfile();
    }

    useEffect(() => {
        initiate();
    }, [])

    return {
        initiate
    };
}



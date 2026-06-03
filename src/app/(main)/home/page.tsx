'use client'

import Hero from 'src/app/(landing)/components/Hero'
import PopularCategories from "src/app/(landing)/components/PopularCategories";
import HowInTalentMatchWorks from "src/app/(landing)/components/HowInTalentMatchWorks";
import TopRatedProvider from "src/app/(landing)/components/TopRatedProvider";
import WhatOurUsersSay from "src/app/(landing)/components/WhatOurUsersSay";
import GetStarted from "src/app/(landing)/components/GetStarted";
import useInitialization from "src/app/hooks/useInitialization";

export default function Landing() {
    const initializer = useInitialization();

    return (
        <>
            <Hero/>
            <PopularCategories/>
            <HowInTalentMatchWorks/>
            <TopRatedProvider/>
            <WhatOurUsersSay/>
            <GetStarted/>
        </>
    );
}

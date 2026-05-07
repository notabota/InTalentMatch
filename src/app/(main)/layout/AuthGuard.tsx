'use client'

import useAuth from "src/app/hooks/useAuth";
import {redirect} from "next/navigation";

export default function AuthGuard({children}: {children: React.ReactNode}) {
    const {isLoggedIn} = useAuth();

    if (isLoggedIn == null) return <h1>Waiting...</h1>;

    if (isLoggedIn === false) {
        redirect('/Account/Login');
    }

    return <>{children}</>;
}


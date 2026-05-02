import { useEffect, useState } from "react";
import { getAccount } from "src/app/helpers/api/auth";

interface AuthState {
  isLoggedIn: boolean | null;
  userId: string | null;
}

export default function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ isLoggedIn: null, userId: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getAccount();
      if (cancelled) return;
      if (res.status === 200) {
        const data = await res.json();
        setState({ isLoggedIn: true, userId: data.id });
      } else {
        setState({ isLoggedIn: false, userId: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

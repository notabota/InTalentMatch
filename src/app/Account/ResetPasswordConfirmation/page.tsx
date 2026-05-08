"use client";

import PrimaryButton from "src/app/components/buttons/PrimaryButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordConfirmation() {
  const [returnUrl, setReturnUrl] = useState("/Account/Login");
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("returnUrl")) {
      setReturnUrl(searchParams.get("returnUrl"));
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-(--color-tertiary) p-8 rounded-[15px] shadow-lg w-2/5">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <p className="text-center text-gray-700 text-[20px] mb-6">
          Your password has been reset. Please sign in again.
        </p>

        <div className="mt-10 flex justify-center">
          <Link href={returnUrl}>
            <PrimaryButton
              label="Back to Login"
              width="w-[250px]"
              borderRadius="rounded-[10px]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

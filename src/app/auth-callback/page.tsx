"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { api } from "~/trpc/react";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const authCallbackQuery = api.auth.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  });

  // Handle Success
  useEffect(() => {
    if (authCallbackQuery.data?.success) {
      router.push(origin ? `/${origin}` : "/dashboard");
    }
  }, [authCallbackQuery.data, origin, router]);

  // Handle Error
  useEffect(() => {
    if (authCallbackQuery.error?.data?.code) {
      router.push("/api/auth/login");
    }
  }, [authCallbackQuery.error?.data?.code, origin, router]);

  return (
    <div className="mt-24 flex w-full justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <h3 className="text-xl font-semibold">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
}

"use client";
import { useEffect } from "react";

import { useRouter } from "@/i18n/routing";
import { axiosInstance } from "@/utils/axiosInstance";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const verifySession = async () => {
    const session = await axiosInstance.get("/auth/check-session");

    if (!session?.data?.isAuthenticated) {
      router.replace("/");
    }
    console.log("Session", session);
  };

  useEffect(() => {
    verifySession();
  }, []);

  return (
    <section className="flex flex-col h-full items-center justify-center gap-4">
      <div className="inline-block w-full h-full text-center justify-center py-6">
        {children}
      </div>
    </section>
  );
}

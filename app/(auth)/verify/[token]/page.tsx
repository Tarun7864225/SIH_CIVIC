"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const router = useRouter();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (data.success) {
          setStatus("✅ Account verified! Redirecting to login...");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setStatus("❌ " + data.message);
          setTimeout(() => router.push("/signup"), 2000);
        }
      } catch (err) {
        setStatus("Something went wrong. Try again.");
      }
    };

    verifyUser();
  }, [token, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-xl font-bold">{status}</h1>
    </div>
  );
}

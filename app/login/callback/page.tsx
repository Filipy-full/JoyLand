"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Get current user session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("ERROR:", error);
        return;
      }

      console.log("SESSION:", data.session);

      router.replace("/dashboard");
    };

    handleAuth();
  }, [router]);

  return <p>Logging in...</p>;
}

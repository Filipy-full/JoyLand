"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthListener({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Redireciona imediatamente se já estiver autenticado
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push("/admin");
      }
    });
    // Continua ouvindo eventos de login
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        router.push("/admin");
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  return <>{children}</>;
}

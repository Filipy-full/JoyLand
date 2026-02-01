"use client"
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthListener({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const adminEmails = ['filipyhenrique54@gmail.com', 'joylandspain@gmail.com'];

  useEffect(() => {
    // Só redirecionar ao fazer login a partir de /login
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        const email = session?.user?.email || '';
        if (pathname === '/login') {
          if (adminEmails.includes(email)) {
            router.push('/admin/messages');
          } else {
            router.push('/dashboard');
          }
        }
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router, pathname]);

  return <>{children}</>;
}

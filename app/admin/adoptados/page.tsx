"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Adoption {
  id: number;
  userId: string;
  treeId: string;
  treeName: string;
  userName: string | null;
  userEmail: string | null;
  shippingName: string | null;
  shippingAddress: string | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminAdoptadosPage() {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdoptions = async () => {
      const { data, error } = await supabase
        .from("adoptions")
        .select("id, userId, treeId, treeName, userName, userEmail, shippingName, shippingAddress, status, paymentStatus, createdAt")
        .order("createdAt", { ascending: false });
      setAdoptions(data || []);
      setLoading(false);
    };
    fetchAdoptions();
  }, []);

  return (
    <main className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Adoptions - Admin</h1>
      {loading ? (
        <p className="text-sage-700">Loading...</p>
      ) : adoptions.length === 0 ? (
        <p className="text-sage-700">No adoptions registered.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-sage-200">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-sage-100">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left whitespace-nowrap">ID</th>
                <th className="px-2 sm:px-4 py-2 text-left whitespace-nowrap">Buyer</th>
                <th className="px-2 sm:px-4 py-2 text-left whitespace-nowrap">Email</th>
                <th className="px-2 sm:px-4 py-2 text-left whitespace-nowrap">Address</th>
                <th className="px-2 sm:px-4 py-2 text-left whitespace-nowrap">Tree</th>
                <th className="px-2 sm:px-4 py-2 text-left whitespace-nowrap">Tree ID</th>
                <th className="px-2 sm:px-4 py-2 text-left whitespace-nowrap">Status</th>
                <th className="px-2 sm:px-4 py-2 text-left whitespace-nowrap">Payment</th>
                <th className="px-2 sm:px-4 py-2 text-left whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody>
              {adoptions.map((a) => (
                <tr key={a.id} className="border-b border-sage-100 hover:bg-sage-50">
                  <td className="px-2 sm:px-4 py-2 text-xs whitespace-nowrap">{a.id}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{a.userName || a.shippingName || a.userId}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{a.userEmail}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{a.shippingAddress}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{a.treeName}</td>
                  <td className="px-2 sm:px-4 py-2 font-mono whitespace-nowrap">{a.treeId}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{a.status}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{a.paymentStatus}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs whitespace-nowrap">{a.createdAt?.slice(0, 19).replace('T', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

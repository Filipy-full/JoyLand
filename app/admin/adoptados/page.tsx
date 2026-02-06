"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminAdoptadosPage() {
  const [adoptions, setAdoptions] = useState<any[]>([]);
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
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Adopciones - Admin</h1>
      {loading ? (
        <p className="text-sage-700">Cargando...</p>
      ) : adoptions.length === 0 ? (
        <p className="text-sage-700">No hay adopciones registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-sage-200 rounded-lg">
            <thead className="bg-sage-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Comprador</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Dirección</th>
                <th className="px-4 py-2 text-left">Árbol</th>
                <th className="px-4 py-2 text-left">Árbol ID</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Pago</th>
                <th className="px-4 py-2 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {adoptions.map((a) => (
                <tr key={a.id} className="border-b border-sage-100">
                  <td className="px-4 py-2 text-xs">{a.id}</td>
                  <td className="px-4 py-2">{a.userName || a.shippingName || a.userId}</td>
                  <td className="px-4 py-2">{a.userEmail}</td>
                  <td className="px-4 py-2">{a.shippingAddress}</td>
                  <td className="px-4 py-2">{a.treeName}</td>
                  <td className="px-4 py-2 font-mono">{a.treeId}</td>
                  <td className="px-4 py-2">{a.status}</td>
                  <td className="px-4 py-2">{a.paymentStatus}</td>
                  <td className="px-4 py-2 text-xs">{a.createdAt?.slice(0, 19).replace('T', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

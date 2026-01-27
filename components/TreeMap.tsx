'use client'

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const LeafletMap = dynamic(() => import('./TreeMapLeaflet'), { ssr: false });

export default function TreeMap() {
  const [trees, setTrees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trees')
      .then(res => res.json())
      .then(data => {
        setTrees(data.trees || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Cargando árboles...</div>;

  return <LeafletMap trees={trees} />;
}

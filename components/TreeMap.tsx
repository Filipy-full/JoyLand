'use client'

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const LeafletMap = dynamic(() => import('./TreeMapLeaflet'), { ssr: false });

type TreeMapProps = {
  trees?: any[];
  onTreeSelect?: (tree: any) => void;
};

export default function TreeMap({ trees, onTreeSelect }: TreeMapProps) {
  const [internalTrees, setInternalTrees] = useState<any[]>(trees || []);
  const [loading, setLoading] = useState(!trees);

  useEffect(() => {
    if (!trees) {
      fetch('/api/trees')
        .then(res => res.json())
        .then(data => {
          setInternalTrees(data.trees || []);
          setLoading(false);
        });
    }
  }, [trees]);

  if (loading) return <div className="text-center py-10">Cargando árboles...</div>;

  return <LeafletMap trees={internalTrees} onTreeSelect={onTreeSelect} />;
}

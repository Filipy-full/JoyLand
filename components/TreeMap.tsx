"use client";
import type { Tree } from "./TreeMapLeafletClient";
import TreeMapClient from "./TreeMapClient";

export default function TreeMap({ trees, onTreeSelect }: { trees?: Tree[]; onTreeSelect?: (tree: Tree) => void }) {
  if (!Array.isArray(trees)) return <div className="text-center py-10">Cargando árboles...</div>;
  return <TreeMapClient trees={trees} onTreeSelect={onTreeSelect} />;
}

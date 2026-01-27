import dynamic from "next/dynamic";
import type { Tree } from "./TreeMapLeafletClient";

const TreeMapLeafletClient = dynamic(() => import("./TreeMapLeafletClient"), {
  ssr: false,
});

export default function TreeMap({ trees, onTreeSelect }: { trees: Tree[]; onTreeSelect?: (tree: Tree) => void }) {
  return <TreeMapLeafletClient trees={trees} onTreeSelect={onTreeSelect} />;
}

import type { Tree } from "./TreeMapLeafletClient";
export default function TreeMap({ trees, onTreeSelect }: { trees: Tree[]; onTreeSelect?: (tree: Tree) => void }) {
  return <TreeMapClient trees={trees} onTreeSelect={onTreeSelect} />;
}
import TreeMapClient from "./TreeMapClient";

export function flatten(into, node) {
  if (node == null) return into;
  if (Array.isArray(node)) return node.reduce(flatten, into);
  into.push(node);
  return flatten(into, node.children);
}

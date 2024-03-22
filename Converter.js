// Conversion rates are represented as graph and allowed for converions
const graph = {
  m: [["ft", 3.28]],
  ft: [["in", 12]],
  hr: [["min", 60]],
  min: [["secs", 60]],
};

// Add reverse paths to the graph
const reverseGraph = {};
for (const [fromUnit, conversions] of Object.entries(graph)) {
  for (const [toUnit, rate] of conversions) {
    if (!reverseGraph[toUnit]) {
      reverseGraph[toUnit] = [];
    }
    reverseGraph[toUnit].push([fromUnit, 1 / rate]);
  }
}
console.log(reverseGraph);
function hasPath(graph, from, to, visited) {
  if (from === to) {
    return true;
  }
  visited.add(from);
  const conversions = graph[from];
  if (!conversions) return false;
  for (const [nextUnit] of conversions) {
    if (!visited.has(nextUnit) && hasPath(graph, nextUnit, to, visited)) {
      return true;
    }
  }
  return false;
}

function convert(from, to, value) {
  let useReverse = false;

  // Check if there's a direct path from 'from' to 'to' in the regular graph
  if (!hasPath(graph, from, to, new Set())) {
    // Check if there's a direct path from 'to' to 'from' in the reverse graph
    if (hasPath(reverseGraph, from, to, new Set())) {
      useReverse = true;
    } else {
      return "Cannot be converted";
    }
  }
  console.log(useReverse);

  const queue = [[from, value]];
  const visited = new Set();
  const useGraph = useReverse ? reverseGraph : graph;

  while (queue.length > 0) {
    const [fromVal, currentVal] = queue.shift();
    if (fromVal === to) {
      return currentVal;
    }
    visited.add(fromVal);
    const conversions = useGraph[fromVal];
    if (!conversions) return "Cannot be converted";
    for (const [toConvert, rate] of conversions) {
      if (!visited.has(toConvert)) {
        queue.push([toConvert, rate * currentVal]);
        console.log(queue);
      }
    }
  }
  return 0;
}

console.log(convert("m", "in", 2.35));
console.log(convert("hr", "secs", 1));
console.log(convert("secs", "hr", 7200));
console.log(convert("min", "hr", 60));

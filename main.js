let Graph = require("./classes/Graph");
let Node = require("./classes/Node");
let Link = require("./classes/Link");

let graph = new Graph();
graph.generateRandomLayout(10);

for (let link of graph.links)
{
    console.log(link.firstNode.name, link.secondNode.name, link.weight);
}
console.log(graph.findShortestPath("A", "F"));

// Example case with calculation of the shortest travel time by plane in hours between Lyon and Tombouctou
// (The values are arbitrary and doesn't reflect the reality)
let nodes = [
    new Node("Tombouctou"),
    new Node("Paris"),
    new Node("Lyon"),
    new Node("Amsterdam"),
    new Node("Berlin")
];
let links = [
    new Link(nodes[3], nodes[0], 5),
    new Link(nodes[4], nodes[0], 6),
    new Link(nodes[1], nodes[2], 3),
    new Link(nodes[1], nodes[3], 3),
    new Link(nodes[1], nodes[4], 4),
];

let graph2 = new Graph(nodes, links);
for (let link of graph2.links)
{
    console.log(link.firstNode.name, link.secondNode.name, link.weight);
}

console.log(graph2.findShortestPath("Lyon", "Tombouctou"));
let Node = require("./Node");
let Link = require("./Link");

module.exports = class Graph
{
    /**
     * @param {Node[]} nodes
     * @param {Link[]} links
     */
    constructor(nodes = null, links = null) {
        this.nodes = nodes === null ? [] : nodes;
        this.links = links === null ? [] : links;
    }

    /**
     * Generates a random layout of nodes linked between each other
     * All nodes have at least 1 link to another one
     * All link weight are set to a random value between 1 and 15 included
     * @param {int} nbrOfNodes Must be no more than 26
     */
    generateRandomLayout(nbrOfNodes)
    {
        if (nbrOfNodes > 26)
            throw new Error("The number of nodes must be less than 26");

        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (let i = 0; i < nbrOfNodes; i++)
        {
            this.nodes.push(new Node(letters.substring(0, 1)));
            letters = letters.substring(1, letters.length - 1);
        }

        let allNodesLinked = false;
        while (!allNodesLinked)
        {
            let firstNode = this.nodes[Math.round(Math.random() * (this.nodes.length - 1))];
            let secondNode = this.nodes[Math.round(Math.random() * (this.nodes.length - 1))];
            if (firstNode !== secondNode)
            {
                let alreadyExistsLink = false;
                for (let link of this.links)
                {
                    if (link.firstNode === firstNode && link.secondNode === secondNode || link.firstNode === secondNode && link.secondNode === firstNode)
                    {
                        alreadyExistsLink = true;
                    }
                }

                if (!alreadyExistsLink)
                {
                    this.links.push(new Link(firstNode, secondNode, Math.round(Math.random() * 14 + 1)));

                    allNodesLinked = true;
                    for (let node of this.nodes)
                    {
                        let found = false;
                        for (let link of this.links)
                        {
                            if (node === link.firstNode || node === link.secondNode)
                            {
                                found = true;
                            }
                        }

                        if (found === false)
                        {
                            allNodesLinked = false;
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * Uses dijkstra algorithm to find the shortest path between two nodes of the graph
     * @param {String} startingNodeName
     * @param {String} targetNodeName
     * @returns {Node[]}
     */
    findShortestPath(startingNodeName, targetNodeName)
    {
        // We're starting by setting the beginning and the objective, and we initiate the shortest path with the first node
        let startingNode = null;
        let targetNode = null;
        let shortestPath = [];

        for (let node of this.nodes)
        {
            if (startingNodeName === node.name)
            {
                startingNode = node;
            }
            else if (targetNodeName === node.name)
            {
                targetNode = node;
            }
        }

        shortestPath.push(startingNode);

        // We will now build the shortest path by comparing each iteration all the available paths and by taking each time the shortest until we reach the objective
        let currentNode = startingNode;
        let currentShortestPath = [];
        let targetReached = false;
        let availablePaths = [];
        let shortest;
        let tempAvailablePaths = [];
        let outNodes = [];
        while (!targetReached)
        {
            for (let link of this.links)
            {
                if (link.firstNode === currentNode && outNodes.indexOf(link.secondNode) === -1 || link.secondNode === currentNode && outNodes.indexOf(link.firstNode) === -1)
                {
                    availablePaths.push(currentShortestPath.concat([link]));
                }
            }

            // If we explored all possible paths and no one reach the objective, then we stop
            if (availablePaths.length === 0)
                throw new Error("There is no path between the two nodes");

            shortest = availablePaths[0];
            for (let path of availablePaths)
            {
                if (this.totalValue(path) < this.totalValue(shortest))
                {
                    shortest = path;
                }
            }

            outNodes.push(currentNode);
            let lastLink = shortest[shortest.length - 1];
            currentNode = (lastLink.firstNode !== currentNode ? lastLink.firstNode : lastLink.secondNode);
            currentShortestPath = shortest;
            tempAvailablePaths = availablePaths;
            for (let path of tempAvailablePaths)
            {
                lastLink = path[path.length - 1];
                if (outNodes.indexOf(lastLink.firstNode) !== -1 && lastLink.secondNode === currentNode || lastLink.firstNode === currentNode && outNodes.indexOf(lastLink.secondNode) !== -1)
                {
                    availablePaths.splice(availablePaths.indexOf(path), 1);
                }
            }
            if (currentNode === targetNode)
                targetReached = true;
        }

        for (let link of currentShortestPath)
        {
            shortestPath.push((link.firstNode === shortestPath[shortestPath.length - 1] ? link.secondNode : link.firstNode));
        }

        return shortestPath;
    }

    /**
     * Returns the sum of the weights in a path
     * @param {Link[]} path
     * @returns {int}
     */
    totalValue(path)
    {
        let totalValue = 0;
        for (let link of path)
        {
            totalValue += link.weight;
        }

        return totalValue;
    }
}
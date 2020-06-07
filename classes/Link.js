let Node = require("./Node");

module.exports = class Link
{
    /**
     * @param {Node} firstNode
     * @param {Node} secondNode
     * @param {int} weight
     */
    constructor(firstNode, secondNode, weight) {
        this.firstNode = firstNode;
        this.secondNode = secondNode;
        this.weight = weight;
    }
}
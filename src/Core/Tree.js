/** 
 * A class representing a tree. 
 * 
 * @property {Array} tree An array of arrays where the index is the node id and the inner arrays contain the neighbours.
 */
Lore.Tree = class Tree {
  /**
   * The constructor of the class Tree.
   * 
   * @param {Array[]} tree An array of arrays where the index is the node id and the inner arrays contain the neighbours.
   * @param {Array[]} weights An array of arrays where the index is the node id and the inner arrays contain the weights in the same order as tree contains neighbours.
   */
  constructor(tree, weights) {
    this.tree = tree;
    this.weights = weights;
  }

  /**
   * Layout the tree
   */
  layout() {
    let root = 0;
    let visited = new Uint8Array(this.tree.length);
    let pX = new Float32Array(this.tree.length);
    let pY = new Float32Array(this.tree.length);
    let queue = [root];
    visited[root] = 1;
    let current = null;
    
    // Position initial node
    pX[root] = 20.0;
    pY[root] = 10.0;

    while (queue.length > 0) {
      current = queue.shift();

      let offset = 0;
      for (var i = 0; i < this.tree[current].length; i++) {
        let child = this.tree[current][i];

        if (visited[child] === 0) {
          // Do some positioning

          pX[child] = pX[current] + this.weights[current][i] * 5.0;
          pY[child] = pY[current] + offset++ * 10.0 * this.weights[current][i];

          let fX = 0.0;
          let fY = 0.0;

          for (var j = 0; j < length; j++) {
            if (visited[j] === 0) {
              continue;
            }

            let distSquared = Math.pow(pX[j] - pX[child], 2.0) + Math.pow(pY[j] - pY[child], 2.0);
            let dist = Math.sqrt(distSquared);
            
            let fAttractive = 1000 / distSquared;
          }

          // Done with positioning

          visited[child] = 1;
          queue.push(child);
        }
      }
    }

    let positions = Array(this.tree.length);

    for (var i = 0; i < this.tree.length; i++) {
      positions[i] = [ pX[i], pY[i] ];
    }

    return positions;
  }

  /**
   * Create a tree from an edge list. 
   */
  static fromEdgeList(edgeList) {
    let length = 0;

    for (var i = 0; i < edgeList.length; i++) {
      if (edgeList[i][0] > length) {
        length = edgeList[i][0];
      }

      if (edgeList[i][1] > length) {
        length = edgeList[i][1];
      }
    }

    length++;

    let neighbours = Array(length);
    let weights = Array(length);

    for (var i = 0; i < length; i++) {
      neighbours[i] = Array();
      weights[i] = Array();
    }

    for (var i = 0; i < edgeList.length; i++) {
      neighbours[edgeList[i][0]].push(edgeList[i][1]);
      neighbours[edgeList[i][1]].push(edgeList[i][0]);

      weights[edgeList[i][0]].push(edgeList[i][2]);
      weights[edgeList[i][1]].push(edgeList[i][2]);
    }

    return new Lore.Tree(neighbours, weights);
  }
}
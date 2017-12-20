/** 
 * A class representing the molecular graph. 
 * 
 * @property {Array[]} distanceMatrix The distance matrix of this graph.
 */
Lore.Graph = class Graph {
  /**
   * The constructor of the class Graph.
   * 
   * @param {Array[]} adjacencyMatrix The weighted adjacency matrix of a graph.
   * @param {Array[]} distanceMatrix The distance matrix of a graph.
   * @param {Number} diameter The diameter of the graph.
   */
  constructor(adjacencyMatrix) {
    this.adjacencyMatrix = adjacencyMatrix;

    // Replace zeros with infinity
    for (var i = 0; i < this.adjacencyMatrix.length; i++) {
      for (var j = 0; j < this.adjacencyMatrix.length; j++) {
        if (this.adjacencyMatrix[i][j] === 0) {
          this.adjacencyMatrix[i][j] = Infinity;
        }
      }
    }

    this.distanceMatrix = this.getDistanceMatrix();
    this.diameter = this.getDiameter();
  }

  /**
   * Returns the unweighted adjacency matrix of this graph.
   * 
   * @returns {Array} The unweighted adjacency matrix of this graph.
   */
  getUnweightedAdjacencyMatrix() {
    let length = this.adjacencyMatrix.length;
    let unweightedAdjacencyMatrix = Array(length);

    for (var i = 0; i < length; i++) {
      unweightedAdjacencyMatrix[i] = Array(length);

      for (var j = 0; j < length; j++) {
        unweightedAdjacencyMatrix[i][j] = this.adjacencyMatrix[i][j] > 0 ? 1 : 0;
      }
    }

    return unweightedAdjacencyMatrix;
  }

  /**
   * Returns an edge list of this graph.
   * 
   * @returns {Array} An array of edges in the form of [vertexId, vertexId, edgeWeight].
   */
  getEdgeList() {
    let length = this.adjacencyMatrix.length;
    let edgeList = Array();

    for (var i = 0; i < length - 1; i++) {
      for (var j = i; j < length; j++) {
        if (this.adjacencyMatrix[i][j] !== Infinity) {
          edgeList.push([i, j, this.adjacencyMatrix[i][j]]);
        }
      }
    }

    return edgeList;
  }

  /**
   * Positiones the (sub)graph using Kamada and Kawais algorithm for drawing general undirected graphs. https://pdfs.semanticscholar.org/b8d3/bca50ccc573c5cb99f7d201e8acce6618f04.pdf
   * 
   * @param {Number} radius The radius within which to initialize the vertices.
   * @param {Boolean} logWeights Apply log() to the weights before layouting.
   * @param {Boolean} squareWeights Apply pow(x,2) to the weights before layouting.
   * @param {Boolean} norm Normalize the edge weights before layouting and after log() or exp().
   * @return {Array} An array of vertex positions of the form [ x, y ].
   */
  kkLayout(radius = 500, logWeights = false, squareWeights = false, normalizeWeights = false) {
    let edgeStrength = 50.0;

    let matDist = this.distanceMatrix;
    let length = this.distanceMatrix.length;

    // Transform data
    if (logWeights) {
      for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
          if (matDist[i][j] !== Infinity) {
            matDist[i][j] = Math.log(matDist[i][j]);
          }
        }
      }
    }

    if (normalizeWeights) {
      for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
          if (matDist[i][j] !== Infinity && matDist[i][j] !== 0) {
            matDist[i][j] = Math.pow(matDist[i][j], 2.0);
          }
        }
      }
    }

    console.log(matDist);

    // Normalize the edge weights
    if (normalizeWeights) {
      let maxWeight = 0;
      
      for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
          if (matDist[i][j] > maxWeight && matDist[i][j] !== Infinity) {
            maxWeight = matDist[i][j];
          }
        }
      }

      for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
          if (matDist[i][j] !== Infinity) {
            matDist[i][j] = matDist[i][j] / maxWeight;
          }
        }
      }
    }

    // Initialize the positions. Place all vertices on a ring around the center
    let halfR
    let angle = 2 * Math.PI / length;
    let a = 0.0;
    let arrPositionX = new Float32Array(length);
    let arrPositionY = new Float32Array(length);
    let arrPositioned = Array(length);
    let l = radius / (2 * this.diameter);
    console.log('l: ' + l);
    console.log('diameter: ' + this.diameter);

    radius /= 2.0;

    var i = length;
    while (i--) {
      arrPositionX[i] = radius + Math.cos(a) * radius;
      arrPositionY[i] = radius + Math.sin(a) * radius;

      arrPositioned[i] = false;
      a += angle;
    }

    // Create the matrix containing the lengths
    let matLength = Array(length);
    i = length;
    while (i--) {
      matLength[i] = new Array(length);
      var j = length;
      while (j--) {
        matLength[i][j] = l * matDist[i][j];
      }
    }

    // Create the matrix containing the spring strenghts
    let matStrength = Array(length);
    i = length;
    while (i--) {
      matStrength[i] = Array(length);
      var j = length;
      while (j--) {
        matStrength[i][j] = edgeStrength * Math.pow(matDist[i][j], -2.0);
      }
    }

    // Create the matrix containing the energies
    let matEnergy = Array(length);
    let arrEnergySumX = new Float32Array(length);
    let arrEnergySumY = new Float32Array(length);
    i = length;
    while (i--) {
      matEnergy[i] = Array(length);
    }

    i = length;
    let ux, uy, dEx, dEy, vx, vy, denom;

    while (i--) {
      ux = arrPositionX[i];
      uy = arrPositionY[i];
      dEx = 0.0;
      dEy = 0.0;
      let j = length;
      while (j--) {
        if (i === j) {
          continue;
        }
        vx = arrPositionX[j];
        vy = arrPositionY[j];
        denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
        matEnergy[i][j] = [
          matStrength[i][j] * ((ux - vx) - matLength[i][j] * (ux - vx) * denom) || 0.0,
          matStrength[i][j] * ((uy - vy) - matLength[i][j] * (uy - vy) * denom) || 0.0
        ]
        matEnergy[j][i] = matEnergy[i][j];
        dEx += matEnergy[i][j][0];
        dEy += matEnergy[i][j][1];
      }
      arrEnergySumX[i] = dEx;
      arrEnergySumY[i] = dEy;
    }

    // Utility functions, maybe inline them later
    let energy = function (index) {
      return [arrEnergySumX[index] * arrEnergySumX[index] + arrEnergySumY[index] * arrEnergySumY[index], arrEnergySumX[index], arrEnergySumY[index]];
    }

    let highestEnergy = function () {
      let maxEnergy = 0.0;
      let maxEnergyId = 0;
      let maxDEX = 0.0;
      let maxDEY = 0.0

      i = length;
      while (i--) {
        let [delta, dEX, dEY] = energy(i);

        if (delta > maxEnergy) {
          maxEnergy = delta;
          maxEnergyId = i;
          maxDEX = dEX;
          maxDEY = dEY;
        }
      }

      return [maxEnergyId, maxEnergy, maxDEX, maxDEY];
    }

    let update = function (index, dEX, dEY) {
      let dxx = 0.0;
      let dyy = 0.0;
      let dxy = 0.0;
      let ux = arrPositionX[index];
      let uy = arrPositionY[index];
      let arrL = matLength[index];
      let arrK = matStrength[index];

      i = length;
      while (i--) {
        if (i === index) {
          continue;
        }

        let vx = arrPositionX[i];
        let vy = arrPositionY[i];
        let l = arrL[i];
        let k = arrK[i];
        let m = (ux - vx) * (ux - vx);
        let denom = 1.0 / Math.pow(m + (uy - vy) * (uy - vy), 1.5);

        dxx += k * (1 - l * (uy - vy) * (uy - vy) * denom) || 0.0;
        dyy += k * (1 - l * m * denom) || 0.0;
        dxy += k * (l * (ux - vx) * (uy - vy) * denom) || 0.0;
      }

      // Prevent division by zero
      if (dxx === 0) {
        dxx = 0.1;
      }

      if (dyy === 0) {
        dyy = 0.1;
      }

      if (dxy === 0) {
        dxy = 0.1;
      }

      let dy = (dEX / dxx + dEY / dxy);
      dy /= (dxy / dxx - dyy / dxy); // had to split this onto two lines because the syntax highlighter went crazy.
      let dx = -(dxy * dy + dEX) / dxx;

      arrPositionX[index] += dx;
      arrPositionY[index] += dy;

      // Update the energies
      let arrE = matEnergy[index];
      dEX = 0.0;
      dEY = 0.0;

      ux = arrPositionX[index];
      uy = arrPositionY[index];

      let vx, vy, prevEx, prevEy, denom;

      i = length;
      while (i--) {
        if (index === i) {
          continue;
        }
        vx = arrPositionX[i];
        vy = arrPositionY[i];
        // Store old energies
        prevEx = arrE[i][0];
        prevEy = arrE[i][1];
        denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
        dx = arrK[i] * ((ux - vx) - arrL[i] * (ux - vx) * denom) || 0.0;
        dy = arrK[i] * ((uy - vy) - arrL[i] * (uy - vy) * denom) || 0.0;

        arrE[i] = [dx, dy];
        dEX += dx;
        dEY += dy;
        arrEnergySumX[i] += dx - prevEx;
        arrEnergySumY[i] += dy - prevEy;
      }
      arrEnergySumX[index] = dEX;
      arrEnergySumY[index] = dEY;
    }

    // Setting parameters
    let threshold = 0.1;
    let innerThreshold = 0.1;
    let maxIteration = 6000;
    let maxInnerIteration = 10;
    let maxEnergy = 1e9;

    // Setting up variables for the while loops
    let maxEnergyId = 0;
    let dEX = 0.0;
    let dEY = 0.0;
    let delta = 0.0;
    let iteration = 0;
    let innerIteration = 0;

    while (maxEnergy > threshold && maxIteration > iteration) {
      iteration++;
      [maxEnergyId, maxEnergy, dEX, dEY] = highestEnergy();

      delta = maxEnergy;
      innerIteration = 0;
      while (delta > innerThreshold && maxInnerIteration > innerIteration) {
        innerIteration++;
        update(maxEnergyId, dEX, dEY);
        [delta, dEX, dEY] = energy(maxEnergyId);
      }
    } 

    let positions = Array(length);

    i = length;
    while (i--) {
      positions[i] = [arrPositionX[i], arrPositionY[i]];
    }

    let edgeList = this.getEdgeList();

    return [ positions, edgeList ];
  }

  getDiameter() {
    let diameter = 0;

    for (var i = 0; i < this.distanceMatrix.length - 1; i++) {
      for (var j = i; j < this.distanceMatrix.length; j++) {
        if (this.distanceMatrix[i][j] > diameter && this.distanceMatrix[i][j] < Infinity) {
          diameter = this.distanceMatrix[i][j];
        }
      }
    }

    return diameter;
  }

  /**
   * Get the distance matrix of the graph.
   * 
   * @returns {Array[]} The distance matrix of the graph.
   */
  getDistanceMatrix() {
    let length = this.adjacencyMatrix.length;
    let dist = Array(length);

    for (var i = 0; i < length; i++) {
      dist[i] = Array(length);
      dist[i].fill(Infinity);
    }

    for (var i = 0; i < length; i++) {
      for (var j = 0; j < length; j++) {
        if (this.adjacencyMatrix[i][j] < Infinity) {
          dist[i][j] = this.adjacencyMatrix[i][j];
        }
      }
    }

    for (var k = 0; k < length; k++) {
      for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
          if (dist[i][j] > dist[i][k] + dist[k][j]) {
            dist[i][j] = dist[i][k] + dist[k][j]
          }
        }
      }
    }

    return dist;
  }

  /**
   * Returns a new graph object. Vertex ids have to be 0 to n.
   * 
   * @param {Array[]} edgeList An edge list in the form [ [ vertexId, vertexId, weight ], ... ].
   * @param {Boolean} invertWeights Whether or not to invert the weights.
   * @returns {Graph} A graph object.
   */
  static fromEdgeList(edgeList, invertWeights = false) {
    // Get the max vertex id.
    let max = 0;
    for (var i = 0; i < edgeList.length; i++) {
      if (edgeList[i][0] > max) {
        max = edgeList[i][0];
      }

      if (edgeList[i][1] > max) {
        max = edgeList[i][1];
      }
    }

    max++;

    if (invertWeights) {
      let maxWeight = 0;

      for (var i = 0; i < edgeList.length; i++) {
        if (edgeList[i][2] > maxWeight) {
          maxWeight = edgeList[i][2];
        }
      }

      maxWeight++;

      for (var i = 0; i < edgeList.length; i++) {
        edgeList[i][2] = maxWeight - edgeList[i][2];
      }
    }

    let adjacencyMatrix = Array(max);

    for (var i = 0; i < max; i++) {
      adjacencyMatrix[i] = Array(max);
      adjacencyMatrix[i].fill(0);
    }

    for (var i = 0; i < edgeList.length; i++) {
      let edge = edgeList[i];
      adjacencyMatrix[edge[0]][edge[1]] = edge[2];
      adjacencyMatrix[edge[1]][edge[0]] = edge[2];
    }

    return new Lore.Graph(adjacencyMatrix);
  }
}
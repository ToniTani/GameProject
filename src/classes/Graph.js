import Phaser    from 'phaser';
import GraphNode from './GraphNode.js';
import GraphEdge from './GraphEdge.js';


export default class Graph {
  /**
   * @param {Phaser.Scene} scene
   * @param {Array<Object>} data
   * @param {Object} opts
   *   An array of node definitions, e.g.
   *   [
   *     { randomize:  },
   *     …
   *   ]
   */
  constructor(scene, data, opts = {}) {
  this.scene       = scene;
  this.data        = data;
  this.randomize   = !!opts.randomize;
  this.layout      = opts.layout || 'circle';
  this.nodes       = new Map();
  this.currentEdges= [];
  this.graphics    = scene.add.graphics().lineStyle(2,0x00ff00);
  this._createNodes();
  }

_createNodes() {
    const { width, height } = this.scene.cameras.main;
    const cx = width/2, cy = height/2 - 50;
    const R  = Math.min(width, height) * 0.35;
    const N  = this.data.length;

    // helper to actually place node i at (x,y)
    const place = (i, x, y) => {
      const def  = this.data[i];
      const node = new GraphNode(def.id, def.label, x, y, this.scene);
      this.nodes.set(def.id, node);

      // optional bobbing tween
      this.scene.tweens.add({
        targets: node.circle,
        props: { y: { value: y-8, duration:2000, ease:'Sine.easeInOut', yoyo:true, repeat:-1 }},
        delay: i * 100
      });
    };

    switch (this.layout) {
      case 'star':
        {
          // build a 5-point star (10-vertex polyline)
          const outer = R, inner = R*0.5, pts = [];
          for (let k=0; k<10; k++) {
            const ang = (Math.PI/5)*k - Math.PI/2;
            const r   = (k%2===0 ? outer : inner);
            pts.push({ x: cx + r*Math.cos(ang), y: cy + r*Math.sin(ang) });
          }
          // compute edges and perimeter
          const edges = [], total = pts.reduce((sum,p,i) => {
            const nxt = pts[(i+1)%10];
            const len = Phaser.Math.Distance.Between(p.x,p.y,nxt.x,nxt.y);
            edges.push({ x:p.x, y:p.y, dx:nxt.x-p.x, dy:nxt.y-p.y, len });
            return sum + len;
          },0);
          // place N nodes evenly around that star
          for (let i=0; i<N; i++) {
            let d = (i/N)*total;
            for (let e of edges) {
              if (d <= e.len) {
                const t = d/e.len;
                place(i, e.x + e.dx*t, e.y + e.dy*t);
                break;
              }
              d -= e.len;
            }
          }
        }
        break;

      case 'square':
      case 'diamond':
        {
          // corners of a square
          const pts = [
            { x:cx-R, y:cy-R },
            { x:cx+R, y:cy-R },
            { x:cx+R, y:cy+R },
            { x:cx-R, y:cy+R }
          ];
          if (this.layout === 'diamond') {
            // rotate each corner 45°
            for (let p of pts) {
              const dx = p.x-cx, dy = p.y-cy;
              p.x = cx + (dx-dy)/Math.SQRT2;
              p.y = cy + (dx+dy)/Math.SQRT2;
            }
          }
          // perimeter edges
          const edges = [], total = pts.reduce((sum,p,i) => {
            const nxt = pts[(i+1)%4];
            const len = Phaser.Math.Distance.Between(p.x,p.y,nxt.x,nxt.y);
            edges.push({ x:p.x, y:p.y, dx:nxt.x-p.x, dy:nxt.y-p.y, len });
            return sum+len;
          },0);
          // place N
          for (let i=0; i<N; i++) {
            let d = (i/N)*total;
            for (let e of edges) {
              if (d <= e.len) {
                const t = d/e.len;
                place(i, e.x + e.dx*t, e.y + e.dy*t);
                break;
              }
              d -= e.len;
            }
          }
        }
        break;

      case 'circle':
      default:
        {
          // classic circle
          const step = (2*Math.PI)/N;
          for (let i=0; i<N; i++) {
            const ang = step*i;
            place(i, cx + R*Math.cos(ang), cy + R*Math.sin(ang));
          }
        }
    }
  }

  /**
   * Connect a single dropped node to its nearest neighbor
   * within [minDist..maxDist]. Returns the new edge or null.
   */
  connectNode(sourceId, minDist = 20, maxDist = 100) {
    // Guard against bad ID
    const graphNode = this.nodes.get(sourceId);
    if (!graphNode) {
      console.warn(
        `Graph.connectNode: unknown sourceId “${sourceId}”`,
        Array.from(this.nodes.keys())
      );
      return null;
    }

    const sourceCircle = graphNode.circle;
    let bestDist = Infinity, bestId = null;

    // find nearest neighbor in range
    this.nodes.forEach((node, id) => {
      if (id === sourceId) return;
      const d = Phaser.Math.Distance.Between(
        sourceCircle.x, sourceCircle.y,
        node.circle.x,  node.circle.y
      );
      if (d >= minDist && d <= maxDist && d < bestDist) {
        bestDist = d;
        bestId   = id;
      }
    });

    // create the edge if valid & not duplicate
    if (bestId) {
      const key = `${sourceId}-${bestId}`;
      if (!this.currentEdges.some(e => e.key === key)) {
        const edge = { from: sourceId, to: bestId, key };
        this.currentEdges.push(edge);
        return edge;
      }
    }

    return null;
  }

  /** Draw all stored edges. */
  renderEdges() {
    this.graphics.clear().lineStyle(2, 0x00ff00);
    this.currentEdges.forEach(e => {
      const a = this.nodes.get(e.from).circle;
      const b = this.nodes.get(e.to).circle;
      this.graphics.moveTo(a.x, a.y).lineTo(b.x, b.y);
    });
    this.graphics.strokePath();
  }

  /** Returns 1 if the dropped edge was correct, else 0. */
  scoreEdge(edge) {
    const def = this.data.find(n => n.id === edge.from);
    return def.correctNeighbors.includes(edge.to) ? 1 : 0;
  }
}
declare module "voronoi" {
  namespace Voronoi {
    export interface BBox {
      xl: number;
      xr: number;
      yt: number;
      yb: number;
    }

    export interface Site {
      x: number;
      y: number;
    }

    export interface Vertex {
      x: number;
      y: number;
    }

    export interface Edge {
      lSite: Site | null;
      rSite: Site | null;
      va: Vertex;
      vb: Vertex;
    }

    export interface Halfedge {
      site: Site;
      edge: Edge;
      getStartpoint(): Vertex;
      getEndpoint(): Vertex;
    }

    export interface Cell {
      site: Site;
      halfedges: Halfedge[];
    }

    export interface Diagram {
      vertices: Vertex[];
      edges: Edge[];
      cells: Cell[];
      execTime: number;
    }
  }

  class Voronoi {
    public compute(sites: Voronoi.Site[], bbox: Voronoi.BBox): Voronoi.Diagram;
    public recycle(diagram: Voronoi.Diagram): void;
  }

  export default Voronoi;
}

declare module "*.txt" {
  const contents: string;
  export default contents;
}

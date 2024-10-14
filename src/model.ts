import Voronoi from "voronoi";
import last from "lodash/last";

const voronoi = new Voronoi();

export interface Polygon {
  perimeter: number;
  vertices: [number, number][];
}

export interface Result {
  sites: [number, number][];
  polygons: Polygon[];
  total: number;
}

function d(x0: number, y0: number, x1: number, y1: number) {
  const dx = x0 - x1;
  const dy = y0 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function formatPolygon(cell: Voronoi.Cell): Polygon {
  if (cell.halfedges.length === 0) {
    return {
      vertices: [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
      ],
      perimeter: 4,
    };
  }

  let vertices: [number, number][] = [];
  for (const he of cell.halfedges) {
    const { x, y } = he.getStartpoint();
    vertices.push([x, y]);
  }
  let perimeter = 0;
  for (let i = 1; i < vertices.length; ++i) {
    perimeter += d(
      vertices[i][0],
      vertices[i][1],
      vertices[i - 1][0],
      vertices[i - 1][1],
    );
  }
  perimeter += d(
    vertices[0][0],
    vertices[0][1],
    last(vertices)![0],
    last(vertices)![1],
  );
  return { vertices, perimeter };
}

export function generate(sites: number) {
  const result: Result = {
    sites: [],
    polygons: [],
    total: 0,
  };

  const bbox: Voronoi.BBox = { xl: 0, xr: 1, yt: 0, yb: 1 };
  let diagramSites: Voronoi.Site[] = [];
  for (let i = 0; i < sites; ++i) {
    const site: [number, number] = [Math.random(), Math.random()];
    result.sites.push(site);

    const diagramSite = { x: site[0], y: site[1] };
    diagramSites.push(diagramSite);
    const diagram = voronoi.compute(diagramSites, bbox);
    // voronoi lib guarantees that cell.site is a reference to site passed to voronoi.compute
    const neededCell = diagram.cells.find((cell) => cell.site === diagramSite);
    if (!neededCell) {
      throw new Error(
        "Unexpected: site added but corresponding cell not found in diagram",
      );
    }
    const polygon = formatPolygon(neededCell);
    result.polygons.push(polygon);
    result.total += polygon.perimeter;
  }

  return result;
}

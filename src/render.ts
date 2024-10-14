import type { Polygon, Result } from "./model";
import randomcolor from "randomcolor";

class SVG {
  private polygons: Polygon[] = [];
  private sites: [number, number][] = [];
  private colors: string[] = [];

  public add(polygon: Polygon, site: [number, number], color: string) {
    this.polygons.push(polygon);
    this.sites.push(site);
    this.colors.push(color);
  }

  public render() {
    const result = [];
    result.push(
      `<svg width="600" height="600" viewBox="-2 -2 604 604" xmlns="http://www.w3.org/2000/svg">`,
    );

    for (let i = 0; i < this.polygons.length; ++i) {
      const poly = this.polygons[i];
      const color = this.colors[i];
      result.push(
        `<polygon points="${poly.vertices
          .map((v) => `${(v[0] * 600).toFixed(3)},${(v[1] * 600).toFixed(3)}`)
          .join(" ")}" fill="${color}" ${
          i === this.polygons.length - 1 ? 'stroke="#000" stroke-width="3"' : ""
        }/>`,
      );
    }

    for (const site of this.sites) {
      result.push(
        `<circle cx="${(site[0] * 600).toFixed(3)}" cy="${(
          site[1] * 600
        ).toFixed(3)}" r="5" fill="white" stroke="black" />`,
      );
    }

    result.push(`</svg>`);
    return result.join("");
  }
}

export function render(data: Result, index: number): string {
  const svg = new SVG();
  const result: string[] = [];
  result.push(
    `<!DOCTYPE html><html><head><title>Diagram #${index}</title></head><body>`,
  );

  for (let i = 0; i < data.polygons.length; ++i) {
    const site = data.sites[i];
    const poly = data.polygons[i];
    svg.add(poly, site, randomcolor());
    const url = `data:image/svg+xml,${encodeURIComponent(svg.render())}`;
    result.push(
      `<div><div><img style="width: 600px; height: 600px" src="${url}"></div>`,
    );
    result.push(
      `<p>Polygon #${i}. Perimeter = ${
        poly.perimeter
      }. Vertices: ${poly.vertices
        .map((v) => `(${v[0]}, ${v[1]})`)
        .join(", ")}</p></div>`,
    );
  }

  result.push(`</body></html>`);
  return result.join("");
}

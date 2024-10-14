## Random Voronoi Simulation

The puzzle: https://youtu.be/57N5h3E3Raw

### How to install

Just download binary for your system from [latest release](https://github.com/lerarosalene/random-voronoi/releases/latest). If there is none (or existing ones don't work) install NodeJS 20.12+ for your system and download `random-voronoi.js` bundle. Run it as `node random-voronoi.js [options]`.

### How to use

```
random-voronoi [options]

Options:
  --sites, -n: Number of sites per sample. Defaults to 5
  --samples, -N: Number of samples. Defaults to 1000
  --file, -f: File with generated samples. Defaults to "result.ndjson"
  --visualize, -v: Generate HTML files for each sample with SVG renders of each step
  --visualize-dir, -d: Directory to put HTML files into. Defaults to "diagrams"
  --range, -r: Range mode. Iterate from --min to --max sites, --samples samples each. Both --min and --max must be defined
  --min, -m: Min sites in range mode.
  --max, -M: Max sites in range mode.
  --summary-file, -s: File with generated output for range mode. Defaults to summary.ndjson
  --help, -h: Print this help

Range mode:
  In this mode, program iterates from --min to --max sites, collects info about average total perimeter for each number of sites and writes summary into --summary-file file.
  Note: detailed information in range mode is still written to --file file, back to back.
  --visualize and --visualize-dir don't have effect in range mode.
```

import sea from "node:sea";
import p from "node:path";
import fs from "node:fs";
import arg from "arg";
import isNil from "lodash/isNil";
import assert from "node:assert";
import helpText from "./help.txt";
import { generate } from "./model";
import { render } from "./render";

const fsp = fs.promises;

function getArgv0() {
  if (sea.isSea()) {
    return p.basename(process.argv0);
  }
  return p.basename(process.argv0) + " " + p.basename(process.argv[1]);
}

function waitDrain(stream: fs.WriteStream) {
  return new Promise<void>((resolve, reject) => {
    let disposers: Function[] = [];
    const dispose = () => {
      disposers.forEach(f => f());
      disposers = [];
    };
    const handleDrain = () => {
      resolve();
      dispose();
    };
    const handleError = (err: Error) => {
      reject(err);
      dispose();
    };
    stream.on("error", handleError);
    stream.on("drain", handleDrain);
    disposers.push(() => stream.off("error", handleError));
    disposers.push(() => stream.off("drain", handleDrain));
  });
}

async function run(
  sites: number,
  samples: number,
  visualize: boolean,
  visualizeDir: string,
  result: fs.WriteStream
) {
  let total = 0;
  for (let i = 0; i < samples; ++i) {
    const model = generate(sites);
    assert.equal(
      model.polygons.length,
      sites,
      `model.polygons.length(${model.polygons.length})==sites(${sites})`
    );
    let shouldWaitDrain = !result.write(JSON.stringify(model) + "\n");
    if (shouldWaitDrain) {
      await waitDrain(result);
    }
    if (visualize) {
      const html = render(model, i);
      const path = p.join(
        visualizeDir,
        `sample-${String(i).padStart(5, "0")}.html`
      );
      await fsp.writeFile(path, html);
    }
    total += model.total;
  }
  return total / samples;
}

async function main() {
  const args = arg({
    "--sites": Number,
    "--samples": Number,
    "--visualize": Boolean,
    "--visualize-dir": String,
    "--file": String,
    "--help": Boolean,
    "--range": Boolean,
    "--min": Number,
    "--max": Number,
    "--summary-file": String,
    "-n": "--sites",
    "-N": "--samples",
    "-V": "--visualize",
    "-f": "--file",
    "-d": "--visualize-dir",
    "-h": "--help",
    "-r": "--range",
    "-m": "--min",
    "-M": "--max",
    "-s": "--summary-file",
  });

  const samples = args["--samples"] ?? 1000;
  const sites = args["--sites"] ?? 5;
  const visualize = args["--range"] ? false : (args["--visualize"] ?? false);
  const visualizeDir = args["--visualize-dir"] ?? "diagrams";
  const outfile = args["--file"] ?? "result.ndjson";
  const help = args["--help"] ?? false;
  const range = args["--range"] ?? false;
  const min = args["--min"];
  const max = args["--max"];
  const summary = args["--summary-file"] ?? "summary.ndjson";

  if (range && (isNil(min) || isNil(max))) {
    throw new Error(
      "If --range is specified, --min and --max options should be specified too"
    );
  }

  if (help) {
    console.log(helpText.replaceAll("{{argv0}}", getArgv0()));
    return 0;
  }

  const result = fs.createWriteStream(outfile);
  if (visualize) {
    await fsp.mkdir(visualizeDir, { recursive: true });
  }

  if (range) {
    const summarySteam = fs.createWriteStream(summary);
    const promises: Array<Promise<number>> = [];
    const counts: number[] = [];
    for (let i = min!; i <= max!; ++i) {
      const p = run(i, samples, false, visualizeDir, result);
      promises.push(p);
      counts.push(i);
    }
    const averages = await Promise.all(promises);
    for (let i = 0; i < averages.length; ++i) {
      summarySteam.write(
        JSON.stringify({ sites: counts[i], average: averages[i] }) + "\n"
      );
    }
    summarySteam.close();
    return;
  }

  await run(sites, samples, visualize, visualizeDir, result);

  result.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

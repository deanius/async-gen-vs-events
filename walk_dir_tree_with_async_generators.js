const { join } = require("path");
const ls = require("util").promisify(require("fs").readdir);
const stat = require("util").promisify(require("fs").stat);

async function* walkTree(dir, ignore) {
  for (const name of await ls(dir)) {
    const path = join(dir, name);
    if (ignore.includes(path)) continue;
    const stats = await stat(path);
    if (stats.isFile() || stats.isDirectory()) yield { path, dir, name, stats };
    if (stats.isDirectory()) yield* walkTree(join(dir, name), ignore);
  }
}

void (async function() {
  console.log(".");
  const walk = walkTree(".", [
    ".git",
    "node_modules",
    "test/working",
    "async-gen.out",
    "async-events.out"
  ]);
  for await (const entry of walk) console.log(entry.path);
})();

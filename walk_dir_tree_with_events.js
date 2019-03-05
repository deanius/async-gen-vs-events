const { agent } = require("rx-helper");
const { Observable } = require("rxjs");

// a sync function
const { join } = require("path");
// promisified versions
const fsListDir = require("util").promisify(require("fs").readdir);
const fsStat = require("util").promisify(require("fs").stat);

setUp(agent);

const ignore = [
  ".git",
  "node_modules",
  "test/working",
  "async-gen.out",
  "async-events.out"
];

agent.process({ type: "dir", payload: "." });

// Provide a means to process new events from within
function triggerEvent(type, payload) {
  agent.process({ type, payload });
}

// WHAT
// ---
// HOW
function setUp(agent) {
  agent.filter(/file|dir/, ({ action }) => console.log(action.payload));

  agent.on("dir", ({ action }) => {
    const dir = action.payload;
    fsListDir(dir).then(async listings => {
      for (const name of listings) {
        debugger;
        const path = join(dir, name);
        if (ignore.includes(path)) continue;

        const stats = await fsStat(path);
        const eventType = stats.isDirectory() ? "dir" : "file";

        triggerEvent(eventType, path);
      }
    });
  });
}

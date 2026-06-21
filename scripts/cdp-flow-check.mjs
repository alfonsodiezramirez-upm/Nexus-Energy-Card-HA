const endpoint = process.argv[2] ?? "http://127.0.0.1:9224";
const targetUrl = process.argv[3] ?? "http://127.0.0.1:5173/";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    const version = await fetch(`${endpoint}/json/version`);
    if (version.ok) {
      break;
    }
  } catch {
    await sleep(250);
  }
}

const targetResponse = await fetch(`${endpoint}/json/new?${encodeURIComponent(targetUrl)}`, { method: "PUT" });
const target = targetResponse.ok ? await targetResponse.json() : (await (await fetch(`${endpoint}/json/list`)).json())[0];
if (!target?.webSocketDebuggerUrl) {
  throw new Error("No debuggable browser target found.");
}

const ws = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const exceptions = [];
let id = 0;

ws.addEventListener("message", (event) => {
  const payload = JSON.parse(event.data);
  if (payload.id && pending.has(payload.id)) {
    pending.get(payload.id)(payload);
    pending.delete(payload.id);
    return;
  }

  if (payload.method === "Runtime.exceptionThrown") {
    exceptions.push(payload.params.exceptionDetails.text);
  }
});

await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));

const send = (method, params = {}) =>
  new Promise((resolve) => {
    id += 1;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

await send("Runtime.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1024,
  deviceScaleFactor: 1,
  mobile: false
});
await send("Page.navigate", { url: targetUrl });
await sleep(1800);

const result = await send("Runtime.evaluate", {
  awaitPromise: true,
  returnByValue: true,
  expression: `
    (async () => {
      const app = document.querySelector('nexus-demo-app');
      const card = app?.shadowRoot?.querySelector('nexus-energy-card');
      const root = card?.shadowRoot;
      if (!root || !card) return { ok: false, reason: 'card not rendered' };

      await card.updateComplete;
      const flowPaths = [...root.querySelectorAll('path.flow-path.power')];
      const widths = flowPaths.map((path) => Number(path.getAttribute('stroke-width')));
      const sourceIds = ['solar', 'battery', 'grid', 'generator'];
      const sourceInputYs = sourceIds.map((id) => {
        const path = root.querySelector('#nexus-path-' + id + '-home');
        const numbers = [...(path?.getAttribute('d') ?? '').matchAll(/-?\\d+(?:\\.\\d+)?/g)].map((match) => Number(match[0]));
        return numbers[7];
      });
      const increasingInputs = sourceInputYs.every((value, index) => index === 0 || value > sourceInputYs[index - 1]);
      const minWidth = Math.min(...widths);
      const maxWidth = Math.max(...widths);
      const uniqueWidths = new Set(widths.map((width) => width.toFixed(2))).size;

      return {
        ok: widths.length > 0 && uniqueWidths > 1 && minWidth === 1.5 && maxWidth >= 7 && increasingInputs,
        pathCount: widths.length,
        minWidth,
        maxWidth,
        uniqueWidths,
        sourceInputYs,
        increasingInputs
      };
    })()
  `
});

console.log(JSON.stringify({ exceptions, result: result.result?.result?.value }, null, 2));
ws.close();

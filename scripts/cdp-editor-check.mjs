const endpoint = process.argv[2] ?? "http://127.0.0.1:9225";
const targetUrl = process.argv[3] ?? "http://127.0.0.1:5173/?editor=1";

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
  width: 1120,
  height: 1400,
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
      const editor = app?.shadowRoot?.querySelector('nexus-energy-card-editor');
      const root = editor?.shadowRoot;
      if (!root || !editor) return { ok: false, reason: 'editor not rendered' };

      const changes = [];
      editor.addEventListener('config-changed', (event) => changes.push(event.detail.config));

      const rows = [...root.querySelectorAll('.node-row')];
      const groundFloor = rows.find((row) => row.querySelector('.row-title strong')?.textContent.trim() === 'Planta Baja');
      const groundParentValue = groundFloor?.querySelector('select')?.value;

      [...root.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Nodo')?.click();
      await editor.updateComplete;
      const addedNode = root.textContent.includes('Nuevo nodo');

      [...root.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Anadir umbral')?.click();
      await editor.updateComplete;
      const addedThreshold = Boolean(root.querySelector('.threshold-row'));

      const latest = changes.at(-1);
      return {
        ok: groundParentValue === 'home' && addedNode && addedThreshold && changes.length >= 2 && latest?.color_thresholds?.length >= 1,
        groundParentValue,
        addedNode,
        addedThreshold,
        changeCount: changes.length,
        hasThresholdConfig: latest?.color_thresholds?.length >= 1
      };
    })()
  `
});

console.log(JSON.stringify({ exceptions, result: result.result?.result?.value }, null, 2));
ws.close();

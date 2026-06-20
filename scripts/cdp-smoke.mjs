const endpoint = process.argv[2] ?? "http://127.0.0.1:9224";
const targetUrl = process.argv[3] ?? "http://127.0.0.1:5173/";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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

      const modeControlsRemoved =
        !root.querySelector('.segmented') &&
        !root.querySelector('.range-select') &&
        !root.querySelector('.now-pill') &&
        !root.textContent.includes('Energía');

      const cocina = [...root.querySelectorAll('.flow-node')].find((node) => node.textContent.includes('Cocina'));
      cocina?.querySelector('.collapse-button')?.click();
      await card.updateComplete;
      const kitchenExpanded = root.textContent.includes('Horno') && root.textContent.includes('Microondas');

      const source = [...root.querySelectorAll('.flow-node')].find((node) => node.textContent.includes('Solar'));
      source?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, composed: true }));
      await new Promise((resolve) => setTimeout(resolve, 320));
      await card.updateComplete;
      const tooltipVisible = Boolean(root.querySelector('.tooltip'));

      return { ok: modeControlsRemoved && kitchenExpanded && tooltipVisible, modeControlsRemoved, kitchenExpanded, tooltipVisible };
    })()
  `
});

console.log(JSON.stringify({ exceptions, result: result.result?.result?.value }, null, 2));
ws.close();

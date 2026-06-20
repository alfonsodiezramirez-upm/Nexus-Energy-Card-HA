const endpoint = process.argv[2] ?? "http://127.0.0.1:9225";
const targetUrl = process.argv[3] ?? "http://127.0.0.1:5174/";

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
  width: 390,
  height: 1600,
  deviceScaleFactor: 1,
  mobile: true
});
await send("Page.navigate", { url: targetUrl });
await sleep(2200);

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
      await new Promise((resolve) => setTimeout(resolve, 180));
      await card.updateComplete;

      const frame = root.querySelector('.nexus-card-frame');
      const stage = root.querySelector('.graph-stage');
      const home = root.querySelector('[data-node-id="home"]');
      const solar = root.querySelector('[data-node-id="solar"]');
      const ground = root.querySelector('[data-node-id="ground-floor"]');
      const top = root.querySelector('[data-node-id="top-floor"]');
      const nodeTitle = root.querySelector('.node-copy strong');
      const flowPath = root.querySelector('#nexus-path-home-ground-floor');
      const outgoing = [...root.querySelectorAll('path.flow-path.power')]
        .filter((path) => path.id.startsWith('nexus-path-home-'));

      const stageRect = stage?.getBoundingClientRect();
      const nodesInside = stageRect
        ? [...root.querySelectorAll('.flow-node')].every((node) => {
            const rect = node.getBoundingClientRect();
            return rect.left >= stageRect.left - 1 && rect.right <= stageRect.right + 1 && rect.top >= stageRect.top - 1;
          })
        : false;

      const rectOf = (node) => node?.getBoundingClientRect();
      const homeRect = rectOf(home);
      const solarRect = rectOf(solar);
      const groundRect = rectOf(ground);
      const topRect = rectOf(top);

      const numbers = [...(flowPath?.getAttribute('d') ?? '').matchAll(/-?\\d+(?:\\.\\d+)?/g)].map((match) => Number(match[0]));
      const [x1, y1, c1x, , c2x, , x2, y2] = numbers;
      const verticalTangents = Number.isFinite(x1) && c1x === x1 && c2x === x2 && y2 > y1;
      const startXs = outgoing.map((path) => {
        const nums = [...(path.getAttribute('d') ?? '').matchAll(/-?\\d+(?:\\.\\d+)?/g)].map((match) => Number(match[0]));
        return nums[0];
      });
      const spreadBottomAnchors = startXs.length > 1 && startXs.every((value, index) => index === 0 || value >= startXs[index - 1]);
      const titleStyle = nodeTitle ? getComputedStyle(nodeTitle) : undefined;

      return {
        ok:
          frame?.classList.contains('compact') &&
          stage?.classList.contains('vertical') &&
          nodesInside &&
          solarRect.bottom < homeRect.top &&
          homeRect.bottom < groundRect.top &&
          Math.abs(groundRect.top - topRect.top) <= 1 &&
          groundRect.left < topRect.left &&
          verticalTangents &&
          spreadBottomAnchors &&
          titleStyle?.textOverflow === 'ellipsis' &&
          titleStyle?.whiteSpace === 'nowrap',
        compact: frame?.classList.contains('compact') ?? false,
        vertical: stage?.classList.contains('vertical') ?? false,
        nodesInside,
        stacked: Boolean(solarRect && homeRect && groundRect && solarRect.bottom < homeRect.top && homeRect.bottom < groundRect.top),
        twoColumnChildren: Boolean(groundRect && topRect && Math.abs(groundRect.top - topRect.top) <= 1 && groundRect.left < topRect.left),
        verticalTangents,
        spreadBottomAnchors,
        textOverflow: titleStyle?.textOverflow,
        whiteSpace: titleStyle?.whiteSpace,
        stageWidth: Math.round(stageRect?.width ?? 0)
      };
    })()
  `
});

console.log(JSON.stringify({ exceptions, result: result.result?.result?.value }, null, 2));
ws.close();

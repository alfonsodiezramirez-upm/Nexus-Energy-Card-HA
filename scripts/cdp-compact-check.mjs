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
  width: 460,
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
      const homeChildRects = [...root.querySelectorAll('.flow-node')]
        .filter((node) => !['home', 'solar', 'battery', 'grid', 'generator'].includes(node.dataset.nodeId ?? ''))
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            id: node.dataset.nodeId,
            left: Math.round(rect.left),
            top: Math.round(rect.top),
            width: Math.round(rect.width)
          };
        });
      const twoColumnPair = homeChildRects.some((rect, index) =>
        homeChildRects.some((other, otherIndex) => otherIndex > index && Math.abs(other.top - rect.top) <= 1 && other.left > rect.left)
      );
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

      const numbers = [...(flowPath?.getAttribute('d') ?? '').matchAll(/-?\\d+(?:\\.\\d+)?/g)].map((match) => Number(match[0]));
      const [x1, y1, c1x, c1y, c2x, c2y, x2, y2] = numbers;
      const verticalTangents = Number.isFinite(x1) && c1x === x1 && c2x === x2 && y2 > y1;
      const dynamicOffset = Number.isFinite(y1) && Math.abs(c1y - (y1 + Math.abs(y2 - y1) * 0.45)) < 0.01 && Math.abs(c2y - (y2 - Math.abs(y2 - y1) * 0.45)) < 0.01;
      const outgoingMetrics = outgoing.map((path) => {
        const nums = [...(path.getAttribute('d') ?? '').matchAll(/-?\\d+(?:\\.\\d+)?/g)].map((match) => Number(match[0]));
        return { startX: nums[0], targetX: nums[6], id: path.id };
      }).sort((a, b) => a.startX - b.startX);
      const startXs = outgoingMetrics.map((path) => path.startX);
      const targetXs = outgoingMetrics.map((path) => path.targetX);
      const spreadBottomAnchors = startXs.length > 1 && startXs.every((value, index) => index === 0 || value >= startXs[index - 1]);
      const crossingFreeMapping = targetXs.length > 1 && targetXs.every((value, index) => index === 0 || value >= targetXs[index - 1]);
      const breathingRoom = Boolean(homeRect && groundRect && groundRect.top - homeRect.bottom >= 39);
      const titleStyle = nodeTitle ? getComputedStyle(nodeTitle) : undefined;

      return {
        ok:
          frame?.classList.contains('compact') &&
          stage?.classList.contains('vertical') &&
          nodesInside &&
          solarRect.bottom < homeRect.top &&
          homeRect.bottom < groundRect.top &&
          twoColumnPair &&
          verticalTangents &&
          dynamicOffset &&
          spreadBottomAnchors &&
          crossingFreeMapping &&
          breathingRoom &&
          titleStyle?.textOverflow === 'ellipsis' &&
          titleStyle?.whiteSpace === 'nowrap',
        compact: frame?.classList.contains('compact') ?? false,
        vertical: stage?.classList.contains('vertical') ?? false,
        nodesInside,
        stacked: Boolean(solarRect && homeRect && groundRect && solarRect.bottom < homeRect.top && homeRect.bottom < groundRect.top),
        twoColumnChildren: twoColumnPair,
        childRects: homeChildRects.slice(0, 6),
        verticalTangents,
        dynamicOffset,
        spreadBottomAnchors,
        crossingFreeMapping,
        breathingRoom,
        outgoingMetrics,
        textOverflow: titleStyle?.textOverflow,
        whiteSpace: titleStyle?.whiteSpace,
        stageWidth: Math.round(stageRect?.width ?? 0)
      };
    })()
  `
});

console.log(JSON.stringify({ exceptions, result: result.result?.result?.value }, null, 2));
ws.close();

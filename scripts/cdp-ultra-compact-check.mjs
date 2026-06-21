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
  width: 360,
  height: 1800,
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
      const stageRect = stage?.getBoundingClientRect();
      const home = root.querySelector('[data-node-id="home"]');
      const firstSource = root.querySelector('[data-node-id="solar"]') ?? root.querySelector('.flow-node.role-source');
      const firstChild = root.querySelector('[data-node-id="ground-floor"]');
      const rootStats = root.querySelector('.root-stats');
      const sourceToHome = root.querySelector('path[id^="nexus-path-solar-home"], path[id$="-home"]');
      const homeToChild = root.querySelector('#nexus-path-home-ground-floor');

      const rectOf = (node) => node?.getBoundingClientRect();
      const homeRect = rectOf(home);
      const sourceRect = rectOf(firstSource);
      const childRect = rectOf(firstChild);
      const rootStatsHidden = rootStats ? getComputedStyle(rootStats).display === 'none' : false;
      const nodeRects = [...root.querySelectorAll('.flow-node')].map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          id: node.dataset.nodeId,
          left: Math.round(rect.left),
          top: Math.round(rect.top),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      });
      const contentNodes = nodeRects.filter((node) => !['home', 'solar', 'battery', 'grid', 'generator'].includes(node.id ?? ''));
      const singleColumnChildren = contentNodes.length > 1 && contentNodes.every((node) => Math.abs(node.left - contentNodes[0].left) <= 1);
      const fullWidthChildren = Boolean(stageRect && contentNodes.every((node) => stageRect.width - node.width <= 52));
      const orderedTower = Boolean(sourceRect && homeRect && childRect && sourceRect.bottom < homeRect.top && homeRect.bottom < childRect.top);
      const nodesInside = stageRect
        ? nodeRects.every((node) => node.left >= stageRect.left - 1 && node.right <= stageRect.right + 1 && node.top >= stageRect.top - 1)
        : false;
      const noVerticalOverlap = nodeRects
        .slice()
        .sort((a, b) => a.top - b.top)
        .every((node, index, sorted) => index === 0 || sorted[index - 1].bottom <= node.top + 1);

      const parseNumbers = (path) => [...(path?.getAttribute('d') ?? '').matchAll(/-?\\d+(?:\\.\\d+)?/g)].map((match) => Number(match[0]));
      const sourceNumbers = parseNumbers(sourceToHome);
      const childNumbers = parseNumbers(homeToChild);
      const sourceVertical = sourceNumbers.length >= 8 && sourceNumbers[0] === sourceNumbers[2] && sourceNumbers[4] === sourceNumbers[6] && sourceNumbers[7] > sourceNumbers[1];
      const childOrthogonal = Boolean(homeToChild?.getAttribute('d')?.includes('Q'));
      const childXs = childNumbers.filter((_, index) => index % 2 === 0);
      const childUsesLeftGutter = childXs.length > 0 && Math.min(...childXs) < childNumbers.at(-2);

      return {
        ok:
          frame?.classList.contains('ultra-compact') &&
          stage?.classList.contains('stacked') &&
          rootStatsHidden &&
          orderedTower &&
          nodesInside &&
          noVerticalOverlap &&
          singleColumnChildren &&
          fullWidthChildren &&
          sourceVertical &&
          childOrthogonal &&
          childUsesLeftGutter &&
          (homeRect?.height ?? 999) <= 230,
        breakpoint: frame?.dataset.breakpoint,
        stacked: stage?.classList.contains('stacked') ?? false,
        rootStatsHidden,
        orderedTower,
        nodesInside,
        noVerticalOverlap,
        singleColumnChildren,
        fullWidthChildren,
        sourceVertical,
        childOrthogonal,
        childUsesLeftGutter,
        homeHeight: Math.round(homeRect?.height ?? 0),
        stageWidth: Math.round(stageRect?.width ?? 0),
        contentNodes: contentNodes.slice(0, 6)
      };
    })()
  `
});

console.log(JSON.stringify({ exceptions, result: result.result?.result?.value }, null, 2));
ws.close();

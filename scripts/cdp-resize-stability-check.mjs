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
  width: 900,
  height: 1200,
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

      const sampleAtWidth = async (width) => {
        card.style.display = 'block';
        card.style.width = width + 'px';
        await card.updateComplete;
        await new Promise((resolve) => setTimeout(resolve, 180));
        const samples = [];
        for (let index = 0; index < 12; index += 1) {
          await new Promise((resolve) => setTimeout(resolve, 120));
          await card.updateComplete;
          const frame = root.querySelector('.nexus-card-frame');
          const stage = root.querySelector('.graph-stage');
          samples.push({
            breakpoint: frame?.dataset.breakpoint,
            orientation: stage?.classList.contains('stacked') ? 'stacked' : stage?.classList.contains('vertical') ? 'vertical' : 'horizontal',
            hostWidth: Math.round(card.getBoundingClientRect().width),
            stageWidth: Math.round(stage?.getBoundingClientRect().width ?? 0)
          });
        }
        return samples;
      };

      const wideSamples = await sampleAtWidth(615);
      const compactSamples = await sampleAtWidth(590);
      const deadbandSamples = await sampleAtWidth(605);
      const recoveredWideSamples = await sampleAtWidth(625);
      const ultraSamples = await sampleAtWidth(360);
      const ultraDeadbandSamples = await sampleAtWidth(395);
      const recoveredCompactSamples = await sampleAtWidth(405);
      const unique = (samples, key) => [...new Set(samples.map((sample) => sample[key]))];
      return {
        ok:
          unique(wideSamples, 'breakpoint').length === 1 &&
          unique(compactSamples, 'breakpoint').length === 1 &&
          unique(deadbandSamples, 'breakpoint').length === 1 &&
          unique(recoveredWideSamples, 'breakpoint').length === 1 &&
          unique(ultraSamples, 'breakpoint').length === 1 &&
          unique(ultraDeadbandSamples, 'breakpoint').length === 1 &&
          unique(recoveredCompactSamples, 'breakpoint').length === 1 &&
          wideSamples.every((sample) => sample.breakpoint === 'wide' && sample.orientation === 'horizontal') &&
          compactSamples.every((sample) => sample.breakpoint === 'compact' && sample.orientation === 'vertical') &&
          deadbandSamples.every((sample) => sample.breakpoint === 'compact' && sample.orientation === 'vertical') &&
          recoveredWideSamples.every((sample) => sample.breakpoint === 'wide' && sample.orientation === 'horizontal') &&
          ultraSamples.every((sample) => sample.breakpoint === 'ultra-compact' && sample.orientation === 'stacked') &&
          ultraDeadbandSamples.every((sample) => sample.breakpoint === 'ultra-compact' && sample.orientation === 'stacked') &&
          recoveredCompactSamples.every((sample) => sample.breakpoint === 'compact' && sample.orientation === 'vertical'),
        wideBreakpoints: unique(wideSamples, 'breakpoint'),
        compactBreakpoints: unique(compactSamples, 'breakpoint'),
        deadbandBreakpoints: unique(deadbandSamples, 'breakpoint'),
        recoveredWideBreakpoints: unique(recoveredWideSamples, 'breakpoint'),
        ultraBreakpoints: unique(ultraSamples, 'breakpoint'),
        ultraDeadbandBreakpoints: unique(ultraDeadbandSamples, 'breakpoint'),
        recoveredCompactBreakpoints: unique(recoveredCompactSamples, 'breakpoint'),
        wideSamples,
        compactSamples,
        deadbandSamples,
        recoveredWideSamples,
        ultraSamples,
        ultraDeadbandSamples,
        recoveredCompactSamples
      };
    })()
  `
});

console.log(JSON.stringify({ exceptions, result: result.result?.result?.value }, null, 2));
ws.close();

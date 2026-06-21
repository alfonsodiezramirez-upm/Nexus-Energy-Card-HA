import { writeFile } from "node:fs/promises";

const endpoint = process.argv[2] ?? "http://127.0.0.1:9225";
const baseUrl = process.argv[3] ?? "http://127.0.0.1:5174/";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function createTarget(url) {
  const response = await fetch(`${endpoint}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
  if (response.ok) {
    return response.json();
  }

  const targets = await (await fetch(`${endpoint}/json/list`)).json();
  const existing = targets.find((target) => target.url === url) ?? targets[0];
  if (!existing) {
    throw new Error("No debuggable browser target found.");
  }
  return existing;
}

async function withTarget(url, viewport, callback) {
  const target = await createTarget(url);
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
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send("Page.navigate", { url });
  await sleep(2200);

  if (exceptions.length > 0) {
    throw new Error(`Browser exceptions while loading ${url}: ${exceptions.join("; ")}`);
  }

  try {
    return await callback(send);
  } finally {
    ws.close();
  }
}

async function waitForRect(send, expression, label) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const result = await send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression
    });
    const rect = result.result?.result?.value;
    if (rect?.width > 0 && rect?.height > 0) {
      return rect;
    }
    await sleep(200);
  }

  throw new Error(`Could not resolve ${label} bounds.`);
}

async function captureClip(send, rect, path) {
  const response = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
    clip: {
      x: Math.max(0, Math.floor(rect.x)),
      y: Math.max(0, Math.floor(rect.y)),
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height),
      scale: 1
    }
  });

  await writeFile(path, Buffer.from(response.result.data, "base64"));
}

const previewUrl = new URL(baseUrl);
await withTarget(previewUrl.toString(), { width: 1440, height: 1020 }, async (send) => {
  const rect = await waitForRect(
    send,
    `(() => {
      const app = document.querySelector('nexus-demo-app');
      const card = app?.shadowRoot?.querySelector('nexus-energy-card');
      const root = card?.shadowRoot;
      const frame = root?.querySelector('.nexus-card-frame');
      const hasLoaded = root?.querySelectorAll('.flow-node').length > 6;
      if (!frame || !hasLoaded) return null;

      const rect = frame.getBoundingClientRect();
      return {
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
        width: rect.width,
        height: rect.height
      };
    })()`,
    "card"
  );
  await captureClip(send, rect, "images/nexus-energy-card-preview.png");
});

const editorUrl = new URL(baseUrl);
editorUrl.searchParams.set("editor", "1");
await withTarget(editorUrl.toString(), { width: 1120, height: 1500 }, async (send) => {
  const rect = await waitForRect(
    send,
    `(() => {
      const app = document.querySelector('nexus-demo-app');
      const editor = app?.shadowRoot?.querySelector('nexus-energy-card-editor');
      const root = editor?.shadowRoot;
      const shell = root?.querySelector('.editor');
      if (!shell || !root?.textContent.includes('Anadir Primer Nodo')) return null;

      const rect = shell.getBoundingClientRect();
      return {
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
        width: rect.width,
        height: Math.min(rect.height, 1480)
      };
    })()`,
    "editor"
  );
  await captureClip(send, rect, "images/nexus-energy-card-editor.png");
});

console.log(
  JSON.stringify(
    {
      ok: true,
      files: ["images/nexus-energy-card-preview.png", "images/nexus-energy-card-editor.png"]
    },
    null,
    2
  )
);

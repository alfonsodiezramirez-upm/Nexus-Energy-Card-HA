const endpoint = process.argv[2] ?? "http://127.0.0.1:9223";
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

let targetResponse = await fetch(`${endpoint}/json/new?${encodeURIComponent(targetUrl)}`, { method: "PUT" });
if (!targetResponse.ok) {
  targetResponse = await fetch(`${endpoint}/json/list`);
  const targets = await targetResponse.json();
  const existing = targets.find((target) => target.url === targetUrl) ?? targets[0];
  if (!existing) {
    throw new Error("No debuggable browser target found.");
  }
  await inspectTarget(existing.webSocketDebuggerUrl);
} else {
  const target = await targetResponse.json();
  await inspectTarget(target.webSocketDebuggerUrl);
}

async function inspectTarget(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const pending = new Map();
  const messages = [];
  let id = 0;

  ws.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);
    if (payload.id && pending.has(payload.id)) {
      pending.get(payload.id)(payload);
      pending.delete(payload.id);
      return;
    }

    if (payload.method === "Runtime.exceptionThrown") {
      messages.push({ type: "exception", detail: payload.params.exceptionDetails.text, payload });
    }
    if (payload.method === "Runtime.consoleAPICalled") {
      messages.push({
        type: payload.params.type,
        detail: payload.params.args.map((arg) => arg.value ?? arg.description ?? "").join(" ")
      });
    }
    if (payload.method === "Log.entryAdded") {
      messages.push({ type: payload.params.entry.level, detail: payload.params.entry.text });
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
  await send("Log.enable");
  await send("Page.enable");
  await send("Page.navigate", { url: targetUrl });
  await sleep(3000);

  const evaluated = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `({
      demoDefined: Boolean(customElements.get('nexus-demo-app')),
      cardDefined: Boolean(customElements.get('nexus-energy-card')),
      bodyText: document.body.innerText,
      mainHtml: document.querySelector('main')?.innerHTML ?? '',
      demoShadow: document.querySelector('nexus-demo-app')?.shadowRoot?.innerHTML ?? ''
    })`
  });

  console.log(JSON.stringify({ messages, evaluated: evaluated.result?.result?.value }, null, 2));
  ws.close();
}

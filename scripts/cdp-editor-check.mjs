const endpoint = process.argv[2] ?? "http://127.0.0.1:9225";
const targetUrl = process.argv[3] ?? "http://127.0.0.1:5174/?editor=1";

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
      editor.addEventListener('config-changed', (event) => {
        changes.push(event.detail.config);
        editor.setConfig(event.detail.config);
      });

      const initialRows = root.querySelectorAll('.node-row').length;
      const initialNodes = editor._config?.nodes?.length ?? -1;
      const initialSources = editor._config?.sources?.length ?? -1;
      const zeroButton = [...root.querySelectorAll('button')].find((button) => button.textContent.trim().includes('Anadir Primer Nodo'));

      zeroButton?.click();
      await editor.updateComplete;
      const rowsAfterFirstAdd = root.querySelectorAll('.node-row').length;
      const expandedAfterFirstAdd = root.querySelectorAll('.node-form').length;
      const nodeGrid = root.querySelector('.node-grid');
      const nodeGridColumns = nodeGrid ? getComputedStyle(nodeGrid).gridTemplateColumns.split(' ').filter(Boolean).length : 0;
      const editorShell = root.querySelector('.editor');
      const noHorizontalOverflowAfterFirstAdd = editorShell.scrollWidth <= editorShell.clientWidth + 1;
      const nameInput = [...root.querySelectorAll('.node-form label')]
        .find((label) => label.textContent.includes('Nombre a mostrar'))
        ?.querySelector('input');
      if (nameInput) {
        nameInput.value = 'Luces';
        nameInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await editor.updateComplete;
      }
      const expandedAfterTyping = root.querySelectorAll('.node-form').length;
      const typedNameVisible = root.querySelector('.row-summary strong')?.textContent.trim() === 'Luces';

      [...root.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Fuente')?.click();
      await editor.updateComplete;
      const rowsAfterSourceAdd = root.querySelectorAll('.node-row').length;
      const expandedAfterSourceAdd = root.querySelectorAll('.node-form').length;

      [...root.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Anadir umbral')?.click();
      await editor.updateComplete;
      const addedThreshold = Boolean(root.querySelector('.threshold-row'));
      const thresholdColumns = getComputedStyle(root.querySelector('.threshold-row')).gridTemplateColumns.split(' ').filter(Boolean).length;

      const latest = changes.at(-1);
      return {
        ok:
          initialRows === 0 &&
          initialNodes === 0 &&
          initialSources === 0 &&
          Boolean(zeroButton) &&
          rowsAfterFirstAdd === 1 &&
          expandedAfterFirstAdd === 1 &&
          nodeGridColumns === 1 &&
          noHorizontalOverflowAfterFirstAdd &&
          expandedAfterTyping === 1 &&
          typedNameVisible &&
          rowsAfterSourceAdd === 2 &&
          expandedAfterSourceAdd === 1 &&
          addedThreshold &&
          thresholdColumns === 1 &&
          changes.length >= 3 &&
          latest?.color_thresholds?.length >= 1,
        initialRows,
        initialNodes,
        initialSources,
        hasZeroButton: Boolean(zeroButton),
        rowsAfterFirstAdd,
        expandedAfterFirstAdd,
        nodeGridColumns,
        noHorizontalOverflowAfterFirstAdd,
        expandedAfterTyping,
        typedNameVisible,
        rowsAfterSourceAdd,
        expandedAfterSourceAdd,
        addedThreshold,
        thresholdColumns,
        changeCount: changes.length,
        hasThresholdConfig: latest?.color_thresholds?.length >= 1
      };
    })()
  `
});

console.log(JSON.stringify({ exceptions, result: result.result?.result?.value }, null, 2));
ws.close();

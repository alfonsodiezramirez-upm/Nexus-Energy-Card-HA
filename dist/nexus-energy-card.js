/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = globalThis, ke = le.ShadowRoot && (le.ShadyCSS === void 0 || le.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Te = Symbol(), We = /* @__PURE__ */ new WeakMap();
let dt = class {
  constructor(t, i, o) {
    if (this._$cssResult$ = !0, o !== Te) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (ke && t === void 0) {
      const o = i !== void 0 && i.length === 1;
      o && (t = We.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && We.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Et = (e) => new dt(typeof e == "string" ? e : e + "", void 0, Te), ht = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((o, r, n) => o + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new dt(i, e, Te);
}, Mt = (e, t) => {
  if (ke) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const o = document.createElement("style"), r = le.litNonce;
    r !== void 0 && o.setAttribute("nonce", r), o.textContent = i.cssText, e.appendChild(o);
  }
}, je = ke ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const o of t.cssRules) i += o.cssText;
  return Et(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: kt, defineProperty: Tt, getOwnPropertyDescriptor: It, getOwnPropertyNames: Ot, getOwnPropertySymbols: Pt, getPrototypeOf: Ht } = Object, k = globalThis, Fe = k.trustedTypes, Rt = Fe ? Fe.emptyScript : "", be = k.reactiveElementPolyfillSupport, J = (e, t) => e, he = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Rt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, Ie = (e, t) => !kt(e, t), Be = { attribute: !0, type: String, converter: he, reflect: !1, useDefault: !1, hasChanged: Ie };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), k.litPropertyMetadata ?? (k.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let L = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Be) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const o = Symbol(), r = this.getPropertyDescriptor(t, o, i);
      r !== void 0 && Tt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, o) {
    const { get: r, set: n } = It(this.prototype, t) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: r, set(s) {
      const a = r == null ? void 0 : r.call(this);
      n == null || n.call(this, s), this.requestUpdate(t, a, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Be;
  }
  static _$Ei() {
    if (this.hasOwnProperty(J("elementProperties"))) return;
    const t = Ht(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(J("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(J("properties"))) {
      const i = this.properties, o = [...Ot(i), ...Pt(i)];
      for (const r of o) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [o, r] of i) this.elementProperties.set(o, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, o] of this.elementProperties) {
      const r = this._$Eu(i, o);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const r of o) i.unshift(je(r));
    } else t !== void 0 && i.push(je(t));
    return i;
  }
  static _$Eu(t, i) {
    const o = i.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((i) => i(this));
  }
  addController(t) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((i = t.hostConnected) == null || i.call(t));
  }
  removeController(t) {
    var i;
    (i = this._$EO) == null || i.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const o of i.keys()) this.hasOwnProperty(o) && (t.set(o, this[o]), delete this[o]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Mt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((i) => {
      var o;
      return (o = i.hostConnected) == null ? void 0 : o.call(i);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var o;
      return (o = i.hostDisconnected) == null ? void 0 : o.call(i);
    });
  }
  attributeChangedCallback(t, i, o) {
    this._$AK(t, o);
  }
  _$ET(t, i) {
    var n;
    const o = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, o);
    if (r !== void 0 && o.reflect === !0) {
      const s = (((n = o.converter) == null ? void 0 : n.toAttribute) !== void 0 ? o.converter : he).toAttribute(i, o.type);
      this._$Em = t, s == null ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var n, s;
    const o = this.constructor, r = o._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = o.getPropertyOptions(r), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : he;
      this._$Em = r;
      const c = l.fromAttribute(i, a.type);
      this[r] = c ?? ((s = this._$Ej) == null ? void 0 : s.get(r)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, i, o, r = !1, n) {
    var s;
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[t]), o ?? (o = a.getPropertyOptions(t)), !((o.hasChanged ?? Ie)(n, i) || o.useDefault && o.reflect && n === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(a._$Eu(t, o)))) return;
      this.C(t, i, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: o, reflect: r, wrapped: n }, s) {
    o && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, s ?? i ?? this[t]), n !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || o || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var o;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, s] of this._$Ep) this[n] = s;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, s] of r) {
        const { wrapped: a } = s, l = this[n];
        a !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, s, l);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (o = this._$EO) == null || o.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(i)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$EO) == null || i.forEach((o) => {
      var r;
      return (r = o.hostUpdated) == null ? void 0 : r.call(o);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
L.elementStyles = [], L.shadowRootOptions = { mode: "open" }, L[J("elementProperties")] = /* @__PURE__ */ new Map(), L[J("finalized")] = /* @__PURE__ */ new Map(), be == null || be({ ReactiveElement: L }), (k.reactiveElementVersions ?? (k.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis, Ve = (e) => e, pe = Q.trustedTypes, Ge = pe ? pe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, pt = "$lit$", M = `lit$${Math.random().toFixed(9).slice(2)}$`, ut = "?" + M, zt = `<${ut}>`, H = document, te = () => H.createComment(""), ie = (e) => e === null || typeof e != "object" && typeof e != "function", Oe = Array.isArray, Dt = (e) => Oe(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", ve = `[ 	
\f\r]`, q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, qe = /-->/g, Ze = />/g, I = RegExp(`>|${ve}(?:([^\\s"'>=/]+)(${ve}*=${ve}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ye = /'/g, Ke = /"/g, ft = /^(?:script|style|textarea|title)$/i, gt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), g = gt(1), D = gt(2), B = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Xe = /* @__PURE__ */ new WeakMap(), O = H.createTreeWalker(H, 129);
function _t(e, t) {
  if (!Oe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ge !== void 0 ? Ge.createHTML(t) : t;
}
const Ut = (e, t) => {
  const i = e.length - 1, o = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = q;
  for (let a = 0; a < i; a++) {
    const l = e[a];
    let c, h, d = -1, u = 0;
    for (; u < l.length && (s.lastIndex = u, h = s.exec(l), h !== null); ) u = s.lastIndex, s === q ? h[1] === "!--" ? s = qe : h[1] !== void 0 ? s = Ze : h[2] !== void 0 ? (ft.test(h[2]) && (r = RegExp("</" + h[2], "g")), s = I) : h[3] !== void 0 && (s = I) : s === I ? h[0] === ">" ? (s = r ?? q, d = -1) : h[1] === void 0 ? d = -2 : (d = s.lastIndex - h[2].length, c = h[1], s = h[3] === void 0 ? I : h[3] === '"' ? Ke : Ye) : s === Ke || s === Ye ? s = I : s === qe || s === Ze ? s = q : (s = I, r = void 0);
    const m = s === I && e[a + 1].startsWith("/>") ? " " : "";
    n += s === q ? l + zt : d >= 0 ? (o.push(c), l.slice(0, d) + pt + l.slice(d) + M + m) : l + M + (d === -2 ? a : m);
  }
  return [_t(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class oe {
  constructor({ strings: t, _$litType$: i }, o) {
    let r;
    this.parts = [];
    let n = 0, s = 0;
    const a = t.length - 1, l = this.parts, [c, h] = Ut(t, i);
    if (this.el = oe.createElement(c, o), O.currentNode = this.el.content, i === 2 || i === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = O.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(pt)) {
          const u = h[s++], m = r.getAttribute(d).split(M), v = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: n, name: v[2], strings: m, ctor: v[1] === "." ? Wt : v[1] === "?" ? jt : v[1] === "@" ? Ft : ge }), r.removeAttribute(d);
        } else d.startsWith(M) && (l.push({ type: 6, index: n }), r.removeAttribute(d));
        if (ft.test(r.tagName)) {
          const d = r.textContent.split(M), u = d.length - 1;
          if (u > 0) {
            r.textContent = pe ? pe.emptyScript : "";
            for (let m = 0; m < u; m++) r.append(d[m], te()), O.nextNode(), l.push({ type: 2, index: ++n });
            r.append(d[u], te());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ut) l.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(M, d + 1)) !== -1; ) l.push({ type: 7, index: n }), d += M.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const o = H.createElement("template");
    return o.innerHTML = t, o;
  }
}
function V(e, t, i = e, o) {
  var s, a;
  if (t === B) return t;
  let r = o !== void 0 ? (s = i._$Co) == null ? void 0 : s[o] : i._$Cl;
  const n = ie(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, i, o)), o !== void 0 ? (i._$Co ?? (i._$Co = []))[o] = r : i._$Cl = r), r !== void 0 && (t = V(e, r._$AS(e, t.values), r, o)), t;
}
class Lt {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: o } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? H).importNode(i, !0);
    O.currentNode = r;
    let n = O.nextNode(), s = 0, a = 0, l = o[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let c;
        l.type === 2 ? c = new re(n, n.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (c = new Bt(n, this, t)), this._$AV.push(c), l = o[++a];
      }
      s !== (l == null ? void 0 : l.index) && (n = O.nextNode(), s++);
    }
    return O.currentNode = H, r;
  }
  p(t) {
    let i = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, i), i += o.strings.length - 2) : o._$AI(t[i])), i++;
  }
}
class re {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, o, r) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = o, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = V(this, t, i), ie(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== B && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Dt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && ie(this._$AH) ? this._$AA.nextSibling.data = t : this.T(H.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: i, _$litType$: o } = t, r = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = oe.createElement(_t(o.h, o.h[0]), this.options)), o);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(i);
    else {
      const s = new Lt(r, this), a = s.u(this.options);
      s.p(i), this.T(a), this._$AH = s;
    }
  }
  _$AC(t) {
    let i = Xe.get(t.strings);
    return i === void 0 && Xe.set(t.strings, i = new oe(t)), i;
  }
  k(t) {
    Oe(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let o, r = 0;
    for (const n of t) r === i.length ? i.push(o = new re(this.O(te()), this.O(te()), this, this.options)) : o = i[r], o._$AI(n), r++;
    r < i.length && (this._$AR(o && o._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var o;
    for ((o = this._$AP) == null ? void 0 : o.call(this, !1, !0, i); t !== this._$AB; ) {
      const r = Ve(t).nextSibling;
      Ve(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class ge {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, o, r, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = n, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = _;
  }
  _$AI(t, i = this, o, r) {
    const n = this.strings;
    let s = !1;
    if (n === void 0) t = V(this, t, i, 0), s = !ie(t) || t !== this._$AH && t !== B, s && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = n[0], l = 0; l < n.length - 1; l++) c = V(this, a[o + l], i, l), c === B && (c = this._$AH[l]), s || (s = !ie(c) || c !== this._$AH[l]), c === _ ? t = _ : t !== _ && (t += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    s && !r && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends ge {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class jt extends ge {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class Ft extends ge {
  constructor(t, i, o, r, n) {
    super(t, i, o, r, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = V(this, t, i, 0) ?? _) === B) return;
    const o = this._$AH, r = t === _ && o !== _ || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, n = t !== _ && (o === _ || r);
    r && this.element.removeEventListener(this.name, this, o), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Bt {
  constructor(t, i, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    V(this, t);
  }
}
const xe = Q.litHtmlPolyfillSupport;
xe == null || xe(oe, re), (Q.litHtmlVersions ?? (Q.litHtmlVersions = [])).push("3.3.3");
const Vt = (e, t, i) => {
  const o = (i == null ? void 0 : i.renderBefore) ?? t;
  let r = o._$litPart$;
  if (r === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    o._$litPart$ = r = new re(t.insertBefore(te(), n), n, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis;
class F extends L {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const t = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = t.firstChild), t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Vt(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return B;
  }
}
var ct;
F._$litElement$ = !0, F.finalized = !0, (ct = P.litElementHydrateSupport) == null || ct.call(P, { LitElement: F });
const $e = P.litElementPolyfillSupport;
$e == null || $e({ LitElement: F });
(P.litElementVersions ?? (P.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gt = { attribute: !0, type: String, converter: he, reflect: !1, hasChanged: Ie }, qt = (e = Gt, t, i) => {
  const { kind: o, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), o === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), o === "accessor") {
    const { name: s } = i;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(s, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(s, void 0, e, a), a;
    } };
  }
  if (o === "setter") {
    const { name: s } = i;
    return function(a) {
      const l = this[s];
      t.call(this, a), this.requestUpdate(s, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function Zt(e) {
  return (t, i) => typeof i == "object" ? qt(e, t, i) : ((o, r, n) => {
    const s = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, o), s ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(e) {
  return Zt({ ...e, state: !0, attribute: !1 });
}
const ee = {
  type: "custom:nexus-energy-card",
  title: "Nexus Energy",
  mode: "power",
  range: "today",
  show_time_selector: !0,
  height: 720,
  animation: !0,
  animation_speed: 1,
  line_width_base: 2,
  overflow_tolerance: 5,
  background_style: "glass",
  hide_zero_nodes: !1,
  base_color: "#38a5ff",
  default_expanded_depth: 2,
  thresholds: {
    warning: 0.65,
    critical: 0.85
  },
  sources: [],
  nodes: []
}, W = {
  title: "Nexus Energy",
  mode: "power",
  range: "today",
  show_time_selector: !0,
  height: 720,
  animation: !0,
  animation_speed: 1,
  line_width_base: 2,
  overflow_tolerance: 5,
  background_style: "glass",
  hide_zero_nodes: !1,
  base_color: "#38a5ff",
  default_expanded_depth: 2,
  thresholds: {
    warning: 0.65,
    critical: 0.85
  },
  sources: [
    {
      id: "solar",
      name: "Solar",
      entity: "sensor.solar_power",
      power_entity: "sensor.solar_power",
      energy_entity: "sensor.solar_energy_today",
      icon: "mdi:white-balance-sunny",
      capacity: 7
    },
    {
      id: "battery",
      name: "Batería",
      entity: "sensor.battery_power",
      power_entity: "sensor.battery_power",
      energy_entity: "sensor.battery_energy_today",
      icon: "mdi:battery-charging-60",
      capacity: 3,
      direction: "auto"
    },
    {
      id: "grid",
      name: "Red eléctrica",
      entity: "sensor.grid_power",
      power_entity: "sensor.grid_power",
      energy_entity: "sensor.grid_energy_today",
      icon: "mdi:transmission-tower",
      capacity: 6
    },
    {
      id: "generator",
      name: "Generador",
      entity: "sensor.generator_power",
      power_entity: "sensor.generator_power",
      energy_entity: "sensor.generator_energy_today",
      icon: "mdi:engine",
      capacity: 5
    }
  ],
  nodes: [
    {
      id: "home",
      name: "Casa",
      entity: "sensor.home_power",
      power_entity: "sensor.home_power",
      energy_entity: "sensor.home_energy_today",
      icon: "mdi:home-outline",
      capacity: 6,
      children: [
        {
          id: "ground-floor",
          name: "Planta Baja",
          entity: "sensor.ground_floor_power",
          power_entity: "sensor.ground_floor_power",
          energy_entity: "sensor.ground_floor_energy_today",
          icon: "mdi:office-building-marker-outline",
          capacity: 3.5,
          children: [
            {
              id: "living-room",
              name: "Salón",
              entity: "sensor.living_room_power",
              power_entity: "sensor.living_room_power",
              energy_entity: "sensor.living_room_energy_today",
              icon: "mdi:sofa-outline",
              capacity: 1.3
            },
            {
              id: "kitchen",
              name: "Cocina",
              entity: "sensor.kitchen_power",
              power_entity: "sensor.kitchen_power",
              energy_entity: "sensor.kitchen_energy_today",
              icon: "mdi:pot-steam-outline",
              capacity: 1.4,
              children: [
                {
                  id: "oven",
                  name: "Horno",
                  entity: "sensor.oven_power",
                  power_entity: "sensor.oven_power",
                  energy_entity: "sensor.oven_energy_today",
                  icon: "mdi:stove",
                  capacity: 1.8
                },
                {
                  id: "microwave",
                  name: "Microondas",
                  entity: "sensor.microwave_power",
                  power_entity: "sensor.microwave_power",
                  energy_entity: "sensor.microwave_energy_today",
                  icon: "mdi:microwave",
                  capacity: 0.9
                }
              ]
            },
            {
              id: "bathroom-small",
              name: "Aseo",
              entity: "sensor.small_bathroom_power",
              power_entity: "sensor.small_bathroom_power",
              energy_entity: "sensor.small_bathroom_energy_today",
              icon: "mdi:toilet",
              capacity: 0.6
            }
          ]
        },
        {
          id: "top-floor",
          name: "Planta Alta",
          entity: "sensor.top_floor_power",
          power_entity: "sensor.top_floor_power",
          energy_entity: "sensor.top_floor_energy_today",
          icon: "mdi:office-building-marker-outline",
          capacity: 2.2,
          children: [
            {
              id: "main-bedroom",
              name: "Dormitorio Principal",
              entity: "sensor.main_bedroom_power",
              power_entity: "sensor.main_bedroom_power",
              energy_entity: "sensor.main_bedroom_energy_today",
              icon: "mdi:bed-king-outline",
              capacity: 0.7
            },
            {
              id: "bedroom-2",
              name: "Dormitorio 2",
              entity: "sensor.bedroom_2_power",
              power_entity: "sensor.bedroom_2_power",
              energy_entity: "sensor.bedroom_2_energy_today",
              icon: "mdi:bed-outline",
              capacity: 0.6
            },
            {
              id: "bathroom",
              name: "Baño",
              entity: "sensor.bathroom_power",
              power_entity: "sensor.bathroom_power",
              energy_entity: "sensor.bathroom_energy_today",
              icon: "mdi:bathtub-outline",
              capacity: 0.6
            }
          ]
        }
      ]
    }
  ]
}, Yt = /* @__PURE__ */ new Set(["w", "kw"]), Kt = /* @__PURE__ */ new Set(["wh", "kwh"]);
function Xt(e, t, i) {
  const o = t && e ? e.states[t] : void 0, r = Number.parseFloat(String((o == null ? void 0 : o.state) ?? "0").replace(",", ".")), s = String((o == null ? void 0 : o.attributes.unit_of_measurement) ?? (i === "power" ? "kW" : "kWh")).toLowerCase(), a = Number.isFinite(r) ? r : 0;
  return i === "power" && Yt.has(s) ? {
    value: s === "w" ? Math.abs(a) / 1e3 : Math.abs(a),
    rawValue: s === "w" ? a / 1e3 : a,
    unit: "kW",
    state: o
  } : i === "energy" && Kt.has(s) ? {
    value: s === "wh" ? Math.abs(a) / 1e3 : Math.abs(a),
    rawValue: s === "wh" ? a / 1e3 : a,
    unit: "kWh",
    state: o
  } : {
    value: Math.abs(a),
    rawValue: a,
    unit: i === "power" ? "kW" : "kWh",
    state: o
  };
}
function yt(e) {
  const [, t = e] = e.split(".");
  return t.split("_").filter(Boolean).map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join(" ");
}
function se(e, t, i = 2) {
  return t === "power" ? Math.abs(e) < 1 ? `${Math.round(e * 1e3)} W` : `${e.toFixed(i)} kW` : Math.abs(e) < 1 ? `${Math.round(e * 1e3)} Wh` : `${e.toFixed(i)} kWh`;
}
function Z(e) {
  return Number.isFinite(e) ? `${Math.round(e * 100)}%` : "0%";
}
const we = 5e-4, Jt = 64;
function Qt(e) {
  const t = {
    ...W,
    ...e,
    thresholds: {
      ...W.thresholds,
      ...e.thresholds
    }
  };
  return (e.nodes || e.entities) && (t.nodes = e.nodes ?? ei(e.entities ?? [])), e.sources && (t.sources = e.sources), t;
}
function ei(e) {
  return [
    {
      id: "home",
      name: "Casa",
      icon: "mdi:home-outline",
      children: e.map((t) => ({
        id: t.replace(/\W+/g, "-"),
        entity: t,
        name: yt(t)
      }))
    }
  ];
}
function Je(e, t, i, o = /* @__PURE__ */ new Map()) {
  var $, S;
  const r = Qt(e), n = {
    warning: (($ = r.thresholds) == null ? void 0 : $.warning) ?? 0.65,
    critical: ((S = r.thresholds) == null ? void 0 : S.critical) ?? 0.85
  }, s = ii(r.overflow_tolerance ?? 5) / 100, a = [], l = (f, y, E, Re = "0") => {
    var De, Ue;
    const me = i === "energy" ? f.energy_entity ?? f.entity : f.power_entity ?? f.entity, ze = f.id ?? me ?? `node-${Re}`, ne = Xt(t, me, i), ye = f.invert_value ? -ne.rawValue : ne.rawValue, Ct = Math.abs(ye), St = f.children ?? [], p = {
      id: ze,
      name: f.name ?? ((Ue = (De = ne.state) == null ? void 0 : De.attributes.friendly_name) == null ? void 0 : Ue.toString()) ?? yt(ze),
      entity: me,
      icon: f.icon ?? oi(y),
      role: y,
      value: Ct,
      rawValue: ye,
      unit: ne.unit,
      capacity: f.capacity,
      percentOfParent: 0,
      severity: "normal",
      direction: ri(f.direction, ye),
      virtual: !1,
      overflow: !1,
      children: [],
      parent: E,
      color: f.color,
      history: []
    };
    p.children = St.map(
      (x, G) => {
        var Le;
        return l(x, (Le = x.children) != null && Le.length ? "hub" : "load", p, `${Re}-${G}`);
      }
    );
    const z = p.children.reduce((x, G) => x + G.value, 0);
    if (!f.entity && p.children.length > 0 && (p.value = z, p.rawValue = z), p.children.length > 0) {
      const x = z - p.value, G = Math.max(we, p.value * s);
      x > G ? (p.overflow = !0, p.severity = "overflow", a.push(p), typeof console < "u" && console.warn(
        `[nexus-energy-card] Overflow detected in ${p.name}: children=${z.toFixed(
          3
        )}${p.unit}, parent=${p.value.toFixed(3)}${p.unit}`
      ), p.children.push(Ne(p, 0))) : x > we ? p.children.push(Ne(p, 0)) : p.value - z > Math.max(we, p.value * 5e-3) && p.children.push(Ne(p, p.value - z));
    }
    p.severity = p.overflow ? "overflow" : Qe(p, n.warning, n.critical), p.history = ni(o, p);
    for (const x of p.children)
      x.percentOfParent = p.value > 0 ? x.value / p.value : 0, x.severity = x.overflow ? "overflow" : Qe(x, n.warning, n.critical);
    return p;
  }, c = (r.nodes ?? []).map((f, y) => l(f, "hub", void 0, `root-${y}`)), h = c[0], d = (r.sources ?? []).map((f, y) => {
    const E = l(f, "source", h, `source-${y}`);
    return E.percentOfParent = h && h.value > 0 ? E.value / h.value : 0, E;
  }), u = [...d, ...ti(c)], m = (h == null ? void 0 : h.value) ?? c.reduce((f, y) => f + y.value, 0), v = d.reduce((f, y) => f + y.value, 0), w = u.map((f) => `${f.id}:${f.rawValue.toFixed(4)}:${f.children.length}`).join("|");
  return {
    sources: d,
    roots: c,
    primaryRoot: h,
    allNodes: u,
    overflowNodes: a,
    total: m,
    sourceTotal: v,
    signature: w
  };
}
function ti(e) {
  const t = [], i = (o) => {
    t.push(o), o.children.forEach(i);
  };
  return e.forEach(i), t;
}
function ii(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : 5;
}
function Ne(e, t) {
  return {
    id: `${e.id}__rest`,
    name: `Resto ${e.name}`,
    icon: "mdi:dots-horizontal",
    role: "rest",
    value: Math.max(0, t),
    rawValue: Math.max(0, t),
    unit: e.unit,
    percentOfParent: e.value > 0 ? Math.max(0, t) / e.value : 0,
    severity: "normal",
    direction: "forward",
    virtual: !0,
    overflow: !1,
    children: [],
    parent: e,
    history: Ee(`${e.id}__rest`, Math.max(0, t))
  };
}
function oi(e) {
  switch (e) {
    case "source":
      return "mdi:flash";
    case "hub":
      return "mdi:home-lightning-bolt-outline";
    case "rest":
      return "mdi:dots-horizontal";
    case "load":
    default:
      return "mdi:power-plug-outline";
  }
}
function ri(e, t) {
  return e === "export" ? "reverse" : e === "import" ? "forward" : t < 0 ? "reverse" : "forward";
}
function Qe(e, t, i) {
  if (!e.capacity || e.capacity <= 0)
    return e.percentOfParent >= i ? "critical" : e.percentOfParent >= t ? "warning" : "normal";
  const o = e.value / e.capacity;
  return o >= i ? "critical" : o >= t ? "warning" : "normal";
}
function ni(e, t) {
  if (!t.entity)
    return Ee(t.id, t.value);
  const i = e.get(t.entity) ?? Ee(t.entity, t.value).slice(0, 18), o = i.at(-1);
  for ((o === void 0 || Math.abs(o - t.value) > Math.max(1e-3, t.value * 5e-3)) && i.push(t.value); i.length > Jt; )
    i.shift();
  return e.set(t.entity, i), [...i];
}
function Ee(e, t) {
  let i = 0;
  for (let o = 0; o < e.length; o += 1)
    i = i * 31 + e.charCodeAt(o) >>> 0;
  return Array.from({ length: 32 }, (o, r) => {
    const n = Math.sin(r / 3 + i % 17) * 0.16, s = Math.cos(r / 7 + i % 11) * 0.08;
    return Math.max(0, t * (0.9 + n + s));
  });
}
function si(e) {
  var t = 0, i = e.children, o = i && i.length;
  if (!o) t = 1;
  else for (; --o >= 0; ) t += i[o].value;
  e.value = t;
}
function ai() {
  return this.eachAfter(si);
}
function li(e, t) {
  let i = -1;
  for (const o of this)
    e.call(t, o, ++i, this);
  return this;
}
function ci(e, t) {
  for (var i = this, o = [i], r, n, s = -1; i = o.pop(); )
    if (e.call(t, i, ++s, this), r = i.children)
      for (n = r.length - 1; n >= 0; --n)
        o.push(r[n]);
  return this;
}
function di(e, t) {
  for (var i = this, o = [i], r = [], n, s, a, l = -1; i = o.pop(); )
    if (r.push(i), n = i.children)
      for (s = 0, a = n.length; s < a; ++s)
        o.push(n[s]);
  for (; i = r.pop(); )
    e.call(t, i, ++l, this);
  return this;
}
function hi(e, t) {
  let i = -1;
  for (const o of this)
    if (e.call(t, o, ++i, this))
      return o;
}
function pi(e) {
  return this.eachAfter(function(t) {
    for (var i = +e(t.data) || 0, o = t.children, r = o && o.length; --r >= 0; ) i += o[r].value;
    t.value = i;
  });
}
function ui(e) {
  return this.eachBefore(function(t) {
    t.children && t.children.sort(e);
  });
}
function fi(e) {
  for (var t = this, i = gi(t, e), o = [t]; t !== i; )
    t = t.parent, o.push(t);
  for (var r = o.length; e !== i; )
    o.splice(r, 0, e), e = e.parent;
  return o;
}
function gi(e, t) {
  if (e === t) return e;
  var i = e.ancestors(), o = t.ancestors(), r = null;
  for (e = i.pop(), t = o.pop(); e === t; )
    r = e, e = i.pop(), t = o.pop();
  return r;
}
function _i() {
  for (var e = this, t = [e]; e = e.parent; )
    t.push(e);
  return t;
}
function mi() {
  return Array.from(this);
}
function yi() {
  var e = [];
  return this.eachBefore(function(t) {
    t.children || e.push(t);
  }), e;
}
function bi() {
  var e = this, t = [];
  return e.each(function(i) {
    i !== e && t.push({ source: i.parent, target: i });
  }), t;
}
function* vi() {
  var e = this, t, i = [e], o, r, n;
  do
    for (t = i.reverse(), i = []; e = t.pop(); )
      if (yield e, o = e.children)
        for (r = 0, n = o.length; r < n; ++r)
          i.push(o[r]);
  while (i.length);
}
function Pe(e, t) {
  e instanceof Map ? (e = [void 0, e], t === void 0 && (t = wi)) : t === void 0 && (t = $i);
  for (var i = new ue(e), o, r = [i], n, s, a, l; o = r.pop(); )
    if ((s = t(o.data)) && (l = (s = Array.from(s)).length))
      for (o.children = s, a = l - 1; a >= 0; --a)
        r.push(n = s[a] = new ue(s[a])), n.parent = o, n.depth = o.depth + 1;
  return i.eachBefore(Ai);
}
function xi() {
  return Pe(this).eachBefore(Ni);
}
function $i(e) {
  return e.children;
}
function wi(e) {
  return Array.isArray(e) ? e[1] : null;
}
function Ni(e) {
  e.data.value !== void 0 && (e.value = e.data.value), e.data = e.data.data;
}
function Ai(e) {
  var t = 0;
  do
    e.height = t;
  while ((e = e.parent) && e.height < ++t);
}
function ue(e) {
  this.data = e, this.depth = this.height = 0, this.parent = null;
}
ue.prototype = Pe.prototype = {
  constructor: ue,
  count: ai,
  each: li,
  eachAfter: di,
  eachBefore: ci,
  find: hi,
  sum: pi,
  sort: ui,
  path: fi,
  ancestors: _i,
  descendants: mi,
  leaves: yi,
  links: bi,
  copy: xi,
  [Symbol.iterator]: vi
};
const fe = 304, Ci = 72, Si = 218, Ei = 232, Me = 270, Mi = 410, ce = 52, He = 16, bt = 32, ki = He;
function Ti(e, t) {
  const i = Math.max(360, t.width), o = Math.max(520, t.height), r = Pi(e.sources, i, o, t.orientation, t.hideZeroNodes ?? !1), n = e.primaryRoot;
  if (!n)
    return {
      orientation: t.orientation,
      width: i,
      height: o,
      nodes: r,
      sources: r,
      edges: []
    };
  if (t.orientation === "vertical") {
    const c = Hi(n, i, r, t), h = c.find((u) => u.id === n.id), d = et(r, c, h);
    return {
      orientation: t.orientation,
      width: i,
      height: Math.max(o, Math.max(...c.map((u) => u.y + u.height + 32), 0)),
      nodes: [...r, ...c],
      sources: r,
      primaryRoot: h,
      edges: d
    };
  }
  const s = Ri(n, i, o, r, t), a = s.find((c) => c.id === n.id), l = et(r, s, a);
  return {
    orientation: t.orientation,
    width: i,
    height: Math.max(o, Math.max(...s.map((c) => c.y + c.height + 32), 0)),
    nodes: [...r, ...s],
    sources: r,
    primaryRoot: a,
    edges: l
  };
}
function Ii(e, t) {
  const i = tt(e.from, t, "out", e.fromSlot, e.fromSlotCount), o = tt(e.to, t, "in", e.toSlot, e.toSlotCount);
  if (t === "horizontal") {
    const n = (o.x - i.x) / 2;
    return `M ${i.x} ${i.y} C ${i.x + n} ${i.y}, ${o.x - n} ${o.y}, ${o.x} ${o.y}`;
  }
  const r = (o.y - i.y) / 2;
  return `M ${i.x} ${i.y} C ${i.x} ${i.y + r}, ${o.x} ${o.y - r}, ${o.x} ${o.y}`;
}
function j(e) {
  return {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  };
}
function vt(e, t, i, o) {
  if (e.children.length === 0 || i.has(e.id))
    return !1;
  const r = Oi(e);
  return t.has(e.id) ? !0 : r < o;
}
function Oi(e) {
  let t = 0, i = e.parent;
  for (; i; )
    t += 1, i = i.parent;
  return t;
}
function Pi(e, t, i, o, r) {
  const n = r ? e.filter((h) => h.value > 1e-3) : e;
  if (o === "horizontal") {
    const h = Math.min(Ei, Math.max(Si, t * 0.16)), d = 112, u = ki, m = n.length * d + Math.max(0, n.length - 1) * u, v = Math.max(116, (i - m) / 2);
    return n.map((w, $) => ({
      ...w,
      x: 32,
      y: v + $ * (d + u),
      width: h,
      height: d,
      depth: 0,
      visibleChildren: []
    }));
  }
  const s = 10, a = t < 520 ? 1 : Math.min(4, Math.max(2, n.length)), l = Math.min(300, Math.floor((t - 32 - s * (a - 1)) / a)), c = 82;
  return n.map((h, d) => ({
    ...h,
    x: a === 1 ? (t - l) / 2 : 16 + d % a * (l + s),
    y: 92 + Math.floor(d / a) * (c + s),
    width: l,
    height: c,
    depth: 0,
    visibleChildren: []
  }));
}
function Hi(e, t, i, o) {
  const r = [];
  let s = 92 + Math.max(1, Math.ceil(i.length / (t < 520 ? 1 : Math.min(4, i.length)))) * 92 + 34;
  const a = Math.min(280, t - 32), l = 318, c = {
    ...e,
    x: (t - a) / 2,
    y: s,
    width: a,
    height: l,
    depth: 0,
    visibleChildren: []
  };
  r.push(c), s += l + 26;
  const h = (d, u, m) => {
    if (vt(d, o.expandedIds, o.collapsedIds, o.defaultExpandedDepth))
      for (const v of d.children) {
        const w = Math.min(42, m * 16), $ = Math.max(220, t - 32 - w), S = {
          ...v,
          x: 16 + w,
          y: s,
          width: $,
          height: 72,
          depth: m,
          visibleChildren: []
        };
        r.push(S), u.visibleChildren.push(S), s += S.height + 12, h(v, S, m + 1);
      }
  };
  return h(e, c, 1), r;
}
function Ri(e, t, i, o, r) {
  const n = Pe(e, (y) => wt(y, r)), s = Math.max(1, n.height), a = Math.min(56, Math.max(32, t * 0.025)), l = t - a - fe, c = /* @__PURE__ */ new Map();
  for (let y = 1; y <= s; y += 1)
    c.set(y, l - (s - y) * (fe + ce));
  const h = c.get(1) ?? l, d = o.reduce((y, E) => Math.max(y, E.x + E.width), 0), u = (d + h - Me) / 2, m = d + ce, v = h - Me - ce, w = zi(u, m, v), $ = xt(e, 0, r), S = Math.max(28, (i - $.subtreeHeight) / 2), f = [];
  return $t($, S, w, c, f), f;
}
function xt(e, t, i) {
  const o = wt(e, i).map((l) => xt(l, t + 1, i)), r = t === 0 ? Me : fe, n = t === 0 ? Mi : Ci, s = t === 0 ? bt : He, a = o.length > 0 ? o.reduce((l, c) => l + c.subtreeHeight, 0) + Math.max(0, o.length - 1) * s : 0;
  return {
    node: e,
    children: o,
    depth: t,
    width: r,
    height: n,
    subtreeHeight: Math.max(n, a),
    y: 0
  };
}
function $t(e, t, i, o, r) {
  const n = e.depth === 0 ? i : o.get(e.depth) ?? i + e.depth * (fe + ce), s = {
    ...e.node,
    x: n,
    y: 0,
    width: e.width,
    height: e.height,
    depth: e.depth,
    visibleChildren: []
  };
  if (r.push(s), e.children.length > 0) {
    const l = e.depth === 0 ? bt : He, c = e.children.reduce((d, u) => d + u.subtreeHeight, 0) + Math.max(0, e.children.length - 1) * l;
    let h = t + (e.subtreeHeight - c) / 2;
    for (const d of e.children) {
      const u = $t(d, h, i, o, r);
      s.visibleChildren.push(u), h += d.subtreeHeight + l;
    }
  }
  const a = s.visibleChildren.length > 0 ? (j(s.visibleChildren[0]).y + j(s.visibleChildren[s.visibleChildren.length - 1]).y) / 2 : t + e.subtreeHeight / 2;
  return s.y = a - e.height / 2, s;
}
function wt(e, t) {
  return vt(e, t.expandedIds, t.collapsedIds, t.defaultExpandedDepth) ? t.hideZeroNodes ? e.children.filter((i) => i.value > 1e-3 || i.children.length > 0) : e.children : [];
}
function zi(e, t, i) {
  return t > i ? (t + i) / 2 : Math.min(i, Math.max(t, e));
}
function et(e, t, i) {
  const o = [];
  if (i) {
    const r = [...e].sort((n, s) => j(n).y - j(s).y);
    for (const [n, s] of r.entries())
      o.push({
        id: `${s.id}->${i.id}`,
        from: s,
        to: i,
        fromSlot: 0,
        fromSlotCount: 1,
        toSlot: n,
        toSlotCount: r.length,
        value: s.value,
        percent: s.percentOfParent,
        severity: s.severity,
        direction: s.direction
      });
  }
  for (const r of t) {
    const n = [...r.visibleChildren].sort((s, a) => j(s).y - j(a).y);
    for (const [s, a] of n.entries())
      o.push({
        id: `${r.id}->${a.id}`,
        from: r,
        to: a,
        fromSlot: s,
        fromSlotCount: r.visibleChildren.length,
        toSlot: 0,
        toSlotCount: 1,
        value: a.value,
        percent: a.percentOfParent,
        severity: a.severity,
        direction: a.direction
      });
  }
  return o;
}
function tt(e, t, i, o = 0, r = 1) {
  const n = r <= 1 ? 0.5 : (o + 1) / (r + 1);
  return t === "horizontal" ? {
    x: i === "out" ? e.x + e.width : e.x,
    y: e.y + e.height * n
  } : {
    x: e.x + e.width * n,
    y: i === "out" ? e.y + e.height : e.y
  };
}
const Ae = 2, Di = 10, ae = 0.05, it = 3, Ui = 18;
function Li(e, t, i, o, r = Ae) {
  const n = Ce(r, 1, 8), s = n + (Di - Ae), a = Math.max(2, n + (it - Ae)), l = a + (Ui - it);
  if (i === "energy") {
    const h = Ce(o, 0, 1);
    return ot(a + h * (l - a));
  }
  if (e <= ae || t <= ae)
    return n;
  const c = Math.log1p(Math.max(0, e - ae)) / Math.log1p(Math.max(1e-3, t - ae));
  return ot(n + Ce(c, 0, 1) * (s - n));
}
function Ce(e, t, i) {
  return Math.min(i, Math.max(t, e));
}
function ot(e) {
  return Math.round(e * 100) / 100;
}
var Wi = Object.defineProperty, ji = Object.getOwnPropertyDescriptor, T = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? ji(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (o ? s(t, i, r) : s(r)) || r);
  return o && r && Wi(t, i, r), r;
};
const rt = 1, Fi = 250, nt = 6e4, Y = 252, K = 210;
let A = class extends F {
  constructor() {
    super(...arguments), this._config = W, this._graph = Je(W, void 0, "power"), this._mode = "power", this._width = 1180, this._expandedIds = /* @__PURE__ */ new Set(), this._collapsedIds = /* @__PURE__ */ new Set(), this._historyCache = /* @__PURE__ */ new Map(), this._tooltipHistoryCache = /* @__PURE__ */ new Map(), this._lastValues = /* @__PURE__ */ new Map(), this._tooltipRequestId = 0, this._clearTooltip = () => {
      window.clearTimeout(this._tooltipTimer), this._tooltipRequestId += 1, this._tooltip = void 0;
    };
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => oo), document.createElement("nexus-energy-card-editor");
  }
  static getStubConfig() {
    return {
      ...ee,
      thresholds: {
        ...ee.thresholds
      },
      sources: [],
      nodes: []
    };
  }
  setConfig(e) {
    if (!e.entities && !e.nodes && !e.sources)
      throw new Error("Parámetros 'entities', 'sources' o 'nodes' mínimos no definidos.");
    this._config = {
      ...W,
      ...e,
      thresholds: {
        ...W.thresholds,
        ...e.thresholds
      }
    }, this._mode = "power", this._restoreBranchState(), this._rebuildGraph(!0);
  }
  set hass(e) {
    this._hass = e, this._rebuildGraph(!1);
  }
  connectedCallback() {
    super.connectedCallback(), this._restoreBranchState();
  }
  disconnectedCallback() {
    var e;
    (e = this._resizeObserver) == null || e.disconnect(), window.clearTimeout(this._tooltipTimer), super.disconnectedCallback();
  }
  firstUpdated() {
    const e = this.renderRoot.querySelector(".nexus-card-frame");
    e && "ResizeObserver" in window && (this._resizeObserver = new ResizeObserver(([t]) => {
      this._width = Math.max(320, Math.round(t.contentRect.width));
    }), this._resizeObserver.observe(e));
  }
  render() {
    const e = this._width < 768 ? "vertical" : "horizontal", t = e === "vertical" ? Math.max(920, this._config.height ?? 720) : this._config.height ?? 720, i = Ti(this._graph, {
      width: this._width,
      height: t,
      orientation: e,
      expandedIds: this._expandedIds,
      collapsedIds: this._collapsedIds,
      defaultExpandedDepth: this._config.default_expanded_depth ?? 2,
      hideZeroNodes: this._config.hide_zero_nodes ?? !1
    }), o = i.primaryRoot, r = this._graph.sources.filter((a) => this._isSolarSource(a)), n = r.length > 0, s = n && this._graph.total > 0 ? Math.min(1, r.reduce((a, l) => a + l.value, 0) / this._graph.total) : 0;
    return g`
      <ha-card class=${`nexus-shell bg-${this._config.background_style ?? "glass"}`}>
        <section class="nexus-card-frame" @pointerleave=${this._clearTooltip}>
          <header class="topbar">
            <div class="brand">
              <span class="brand-icon"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon></span>
              <div>
                <h2>${this._config.title ?? "Nexus Energy"}</h2>
                <p>
                  Total en casa
                  <span class="live-dot"></span>
                  <strong>Ahora</strong>
                </p>
              </div>
            </div>
          </header>

          <section class="summary-strip" aria-label="Resumen energético">
            <div class="primary-metric">
              <span>Consumo actual</span>
              <strong>${se(this._graph.total, this._mode, this._config.precision)}</strong>
            </div>
            <div class="health-pill ${this._graph.overflowNodes.length ? "warning" : ""}">
              <ha-icon icon=${this._graph.overflowNodes.length ? "mdi:alert-circle-outline" : "mdi:shield-check-outline"}></ha-icon>
              ${this._graph.overflowNodes.length ? `${this._graph.overflowNodes.length} overflow` : "Sistema normal"}
            </div>
          </section>

          <section class="graph-stage ${e}" style=${`height:${i.height}px`} @click=${this._clearTooltip}>
            ${this._renderSvg(i)}
            <div class="node-layer">
              ${i.nodes.map((a) => this._renderNode(a, o, s, n))}
            </div>
            ${this._renderTooltip()}
          </section>
        </section>
      </ha-card>
    `;
  }
  _renderSvg(e) {
    const t = Math.max(0.05, ...e.edges.map((i) => i.value));
    return D`
      <svg
        class="flow-layer"
        viewBox=${`0 0 ${e.width} ${e.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          ${e.edges.map(
      (i) => D`
              <linearGradient id=${this._gradientId(i.id)} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color=${this._edgeStart(i)} stop-opacity="0.2"></stop>
                <stop offset="48%" stop-color=${this._edgeColor(i)} stop-opacity="0.94"></stop>
                <stop offset="100%" stop-color=${this._edgeColor(i)} stop-opacity="0.22"></stop>
              </linearGradient>
            `
    )}
        </defs>
        ${e.edges.map((i) => {
      const o = Ii(i, e.orientation), r = this._edgeWidth(i, t);
      return D`
            <g class=${`flow-edge ${i.severity} ${i.direction}`}>
              <path class="flow-halo" d=${o} stroke-width=${r + 8}></path>
              <path
                id=${this._pathId(i.id)}
                class=${`flow-path ${this._mode}`}
                d=${o}
                stroke=${`url(#${this._gradientId(i.id)})`}
                stroke-width=${r}
              ></path>
              ${this._mode === "power" && this._config.animation !== !1 ? D`
                  <circle class="particle" r=${Math.max(2.4, r / 2.2)} fill=${this._edgeColor(i)}>
                    <animateMotion
                      dur=${this._particleDuration(i)}
                      repeatCount="indefinite"
                      rotate="auto"
                      calcMode=${i.direction === "reverse" ? "linear" : _}
                      keyPoints=${i.direction === "reverse" ? "1;0" : _}
                      keyTimes=${i.direction === "reverse" ? "0;1" : _}
                    >
                      <mpath href=${`#${this._pathId(i.id)}`}></mpath>
                    </animateMotion>
                  </circle>
                ` : _}
            </g>
          `;
    })}
      </svg>
    `;
  }
  _renderNode(e, t, i, o) {
    const r = (t == null ? void 0 : t.id) === e.id, n = e.children.length > 0, s = this._collapsedIds.has(e.id), a = [
      "flow-node",
      `role-${e.role}`,
      e.severity,
      r ? "is-root" : "",
      n ? "is-container" : "",
      s ? "is-collapsed" : ""
    ].filter(Boolean).join(" ");
    return g`
      <article
        class=${a}
        style=${`left:${e.x}px;top:${e.y}px;width:${e.width}px;height:${e.height}px;--node-accent:${this._nodeAccent(e)};`}
        data-node-id=${e.id}
        tabindex="0"
        @mouseenter=${() => this._queueTooltip(e)}
        @mouseleave=${() => this._hideTooltipFromNode(e)}
        @focusin=${() => this._queueTooltip(e, 0)}
        @focusout=${() => this._hideTooltipFromNode(e)}
        @click=${(l) => this._handleNodeClick(l, e)}
      >
        ${r ? this._renderRootNode(e, i, o) : this._renderCompactNode(e)}
      </article>
    `;
  }
  _renderRootNode(e, t, i) {
    return g`
      <div class="root-heading">
        <span class="node-icon root-icon"><ha-icon icon=${e.icon}></ha-icon></span>
        <button class="collapse-button" type="button" title="Expandir o colapsar" @click=${(o) => this._toggleNode(o, e)}>
          <ha-icon icon=${this._collapsedIds.has(e.id) ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
        </button>
      </div>
      <div class="root-title">${e.name}</div>
      <div class="root-value">${se(e.value, this._mode, this._config.precision)}</div>
      <div class="root-subtitle">Consumo actual</div>
      <div class=${`gauge ${i ? "" : "is-hidden"}`} style=${`--gauge:${Math.round(t * 100)}%`}>
        <span>${Math.round(t * 100)}%</span>
        <small>Autonomía solar</small>
      </div>
      <dl class="root-stats">
        <div><dt>Voltaje</dt><dd>230 V</dd></div>
        <div><dt>Frecuencia</dt><dd>50.0 Hz</dd></div>
        <div><dt>Factor de potencia</dt><dd>0.97</dd></div>
      </dl>
    `;
  }
  _renderCompactNode(e) {
    const t = this._nodeStatus(e);
    return g`
      <div class="node-main">
        <span class="node-icon"><ha-icon icon=${e.icon}></ha-icon></span>
        <div class="node-copy">
          <strong>${e.name}</strong>
          <span>${se(e.value, this._mode, this._config.precision)}</span>
        </div>
            ${e.children.length ? g`
              <button class="collapse-button" type="button" title="Expandir o colapsar" @click=${(i) => this._toggleNode(i, e)}>
                <ha-icon icon=${this._collapsedIds.has(e.id) ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
              </button>
            ` : g`<span class="node-percent">${Z(e.percentOfParent)}</span>`}
      </div>
      ${e.role === "source" ? g`
            <div class="source-meta">
              <strong>${Z(e.capacity ? e.value / e.capacity : e.percentOfParent)}</strong>
              <span>${t}</span>
            </div>
            ${this._renderSparkline(e, 172, 34)}
          ` : _}
      ${e.role !== "source" && e.children.length ? g`<div class="container-share">${Z(e.percentOfParent)} del total</div>` : _}
    `;
  }
  _renderTooltip() {
    const e = this._tooltip;
    return e ? g`
      <aside
        class=${`tooltip ${e.loading ? "is-loading" : ""}`}
        style=${`left:${e.x}px;top:${e.y}px;width:${Y}px;--tooltip-accent:${e.color};`}
        role="dialog"
        aria-label=${`Detalle de ${e.name}`}
      >
        <header>
          <span class="tooltip-icon"><ha-icon icon=${e.icon}></ha-icon></span>
          <div>
            <strong>${e.name}</strong>
            <span class="tooltip-value">${e.valueLabel}</span>
          </div>
          <em>${Z(e.parentPercent)}</em>
        </header>
        <p>
          <span class="dot"></span>
          ${Z(e.parentPercent)} de ${e.parentName}
        </p>
        ${this._renderTooltipSparkline(e, 216, 58)}
        <footer>
          <ha-icon icon=${e.error ? "mdi:alert-circle-outline" : e.loading ? "mdi:clock-outline" : "mdi:chart-line"}></ha-icon>
          ${e.error ?? (e.loading ? "Cargando historial de Home Assistant" : this._tooltipHistoryLabel(e))}
        </footer>
      </aside>
    ` : _;
  }
  _renderSparkline(e, t, i) {
    const o = Bi(e.history, t, i);
    return D`
      <svg class="sparkline" viewBox=${`0 0 ${t} ${i}`} aria-hidden="true">
        <path class="sparkline-area" d=${`${o} L ${t} ${i} L 0 ${i} Z`}></path>
        <path class="sparkline-line" d=${o}></path>
      </svg>
    `;
  }
  _renderTooltipSparkline(e, t, i) {
    const o = Vi(e.history, t, i);
    return D`
      <svg class="sparkline" viewBox=${`0 0 ${t} ${i}`} aria-hidden="true">
        <path class="sparkline-area" d=${`${o} L ${t} ${i} L 0 ${i} Z`}></path>
        <path class="sparkline-line" d=${o}></path>
      </svg>
    `;
  }
  _toggleNode(e, t) {
    if (t.children.length === 0)
      return;
    e.stopPropagation();
    const i = this._isCurrentlyExpanded(t), o = new Set(this._expandedIds), r = new Set(this._collapsedIds);
    i ? (o.delete(t.id), r.add(t.id)) : (r.delete(t.id), o.add(t.id)), this._expandedIds = o, this._collapsedIds = r, this._saveBranchState();
  }
  _isCurrentlyExpanded(e) {
    return this._collapsedIds.has(e.id) ? !1 : this._expandedIds.has(e.id) ? !0 : e.depth < (this._config.default_expanded_depth ?? 2);
  }
  _queueTooltip(e, t = Fi) {
    window.clearTimeout(this._tooltipTimer), this._tooltipTimer = window.setTimeout(() => this._openTooltip(e), t);
  }
  _handleNodeClick(e, t) {
    var i;
    if (e.stopPropagation(), window.clearTimeout(this._tooltipTimer), ((i = this._tooltip) == null ? void 0 : i.nodeId) === t.id) {
      this._clearTooltip();
      return;
    }
    this._openTooltip(t);
  }
  _hideTooltipFromNode(e) {
    var t;
    window.clearTimeout(this._tooltipTimer), ((t = this._tooltip) == null ? void 0 : t.nodeId) === e.id && this._clearTooltip();
  }
  _openTooltip(e) {
    var n;
    const t = ++this._tooltipRequestId, i = e.entity, o = this._fallbackTooltipHistory(e), r = i ? this._cachedTooltipHistory(i) : void 0;
    this._tooltip = {
      nodeId: e.id,
      entityId: i,
      name: e.name,
      icon: e.icon,
      valueLabel: this._currentValueLabel(e),
      parentName: ((n = e.parent) == null ? void 0 : n.name) ?? "Balance",
      parentPercent: e.parent && e.parent.value > 0 ? e.value / e.parent.value : e.percentOfParent,
      color: this._nodeAccent(e),
      ...this._tooltipPosition(e),
      history: r ?? o,
      loading: !!(i && !r),
      historySource: r ? "home-assistant" : "local"
    }, i && !r && this._loadTooltipHistory(i, t);
  }
  async _loadTooltipHistory(e, t) {
    var i, o;
    try {
      const r = await this._getTooltipHistory(e);
      if (this._tooltipRequestId !== t || ((i = this._tooltip) == null ? void 0 : i.entityId) !== e)
        return;
      this._tooltip = {
        ...this._tooltip,
        history: r.length ? r : this._tooltip.history,
        loading: !1,
        historySource: r.length ? "home-assistant" : "local",
        error: r.length ? void 0 : "Sin muestras historicas disponibles"
      };
    } catch {
      if (this._tooltipRequestId !== t || ((o = this._tooltip) == null ? void 0 : o.entityId) !== e)
        return;
      this._tooltip = {
        ...this._tooltip,
        loading: !1,
        historySource: "local",
        error: "No se pudo cargar el historial de HA"
      };
    }
  }
  _cachedTooltipHistory(e) {
    const t = this._tooltipHistoryCache.get(this._tooltipHistoryKey(e));
    if (!(!t || t.expiresAt <= Date.now()))
      return t.points;
  }
  async _getTooltipHistory(e) {
    const t = this._tooltipHistoryKey(e), i = this._tooltipHistoryCache.get(t), o = Date.now();
    if (i && i.expiresAt > o)
      return i.pending ?? i.points;
    const r = this._fetchTooltipHistory(e);
    this._tooltipHistoryCache.set(t, {
      expiresAt: o + nt,
      points: (i == null ? void 0 : i.points) ?? [],
      pending: r
    });
    const n = await r;
    return this._tooltipHistoryCache.set(t, {
      expiresAt: Date.now() + nt,
      points: n
    }), n;
  }
  async _fetchTooltipHistory(e) {
    var o, r;
    const t = /* @__PURE__ */ new Date(), i = new Date(t.getTime() - 60 * 6e4);
    if ((o = this._hass) != null && o.callWS)
      try {
        const n = await this._hass.callWS({
          type: "history/history_during_period",
          start_time: i.toISOString(),
          end_time: t.toISOString(),
          entity_ids: [e],
          significant_changes_only: !1,
          minimal_response: !1,
          no_attributes: !0
        }), s = st(n, e);
        if (s.length)
          return s;
      } catch {
      }
    if ((r = this._hass) != null && r.callApi) {
      const n = new URLSearchParams({
        filter_entity_id: e,
        end_time: t.toISOString(),
        significant_changes_only: "false",
        minimal_response: "false",
        no_attributes: "true"
      }), s = `history/period/${encodeURIComponent(i.toISOString())}?${n.toString()}`, a = await this._hass.callApi("GET", s);
      return st(a, e);
    }
    return [];
  }
  _tooltipHistoryKey(e) {
    return `${this._mode}:${e}`;
  }
  _fallbackTooltipHistory(e) {
    const i = Date.now(), o = e.history.length ? e.history : [e.value];
    return o.map((r, n) => ({
      time: i - 36e5 + (o.length === 1 ? 36e5 : n / (o.length - 1) * 36e5),
      value: r
    }));
  }
  _currentValueLabel(e) {
    var r;
    const t = e.entity ? (r = this._hass) == null ? void 0 : r.states[e.entity] : void 0, i = Number.parseFloat(String((t == null ? void 0 : t.state) ?? "").replace(",", ".")), o = String((t == null ? void 0 : t.attributes.unit_of_measurement) ?? e.unit);
    return Number.isFinite(i) ? `${Yi(Math.abs(i))} ${o}`.trim() : se(e.value, this._mode, this._config.precision);
  }
  _tooltipPosition(e) {
    const t = this.renderRoot.querySelector(".graph-stage"), i = [...this.renderRoot.querySelectorAll(".flow-node")].find((c) => c.dataset.nodeId === e.id);
    if (!t || !i)
      return {
        x: Math.max(12, e.x + e.width + 14),
        y: Math.max(12, e.y + e.height / 2 - K / 2)
      };
    const o = t.getBoundingClientRect(), r = i.getBoundingClientRect(), n = 14, s = 12;
    let a = r.right - o.left + n, l = r.top - o.top + r.height / 2 - K / 2;
    return a + Y > o.width - s && (a = r.left - o.left - Y - n), a < s && (a = r.left - o.left + r.width / 2 - Y / 2, l = r.bottom - o.top + n, l + K > o.height - s && (l = r.top - o.top - K - n)), {
      x: Se(a, s, Math.max(s, o.width - Y - s)),
      y: Se(l, s, Math.max(s, o.height - K - s))
    };
  }
  _tooltipHistoryLabel(e) {
    return e.historySource === "home-assistant" ? "Historial inmediato desde Home Assistant" : "Historial local hasta recibir datos de HA";
  }
  _rebuildGraph(e) {
    const t = Je(this._config, this._hass, this._mode, this._historyCache);
    (e || this._hasMeaningfulGraphChange(t)) && (this._graph = t, this._lastValues = new Map(t.allNodes.map((i) => [i.id, i.value])));
  }
  _hasMeaningfulGraphChange(e) {
    return this._lastValues.size !== e.allNodes.length ? !0 : e.allNodes.some((t) => {
      const i = this._lastValues.get(t.id);
      return i === void 0 ? !0 : Math.abs(t.value - i) > Math.max(5e-3, Math.abs(i) * 5e-3);
    });
  }
  _saveBranchState() {
    try {
      sessionStorage.setItem(
        this._storageKey(),
        JSON.stringify({
          version: rt,
          expanded: [...this._expandedIds],
          collapsed: [...this._collapsedIds]
        })
      );
    } catch {
    }
  }
  _restoreBranchState() {
    try {
      const e = sessionStorage.getItem(this._storageKey());
      if (!e)
        return;
      const t = JSON.parse(e);
      if (t.version !== rt)
        return;
      this._expandedIds = new Set(t.expanded ?? []), this._collapsedIds = new Set(t.collapsed ?? []);
    } catch {
      this._expandedIds = /* @__PURE__ */ new Set(), this._collapsedIds = /* @__PURE__ */ new Set();
    }
  }
  _storageKey() {
    return `nexus-energy-card:${this._config.title ?? "nexus-energy-card"}:branches`;
  }
  _edgeWidth(e, t) {
    return Li(e.value, t, this._mode, e.percent, this._config.line_width_base ?? 2);
  }
  _particleDuration(e) {
    const t = Se(this._config.animation_speed ?? 1, 0.4, 3);
    return `${(Math.max(1.1, 6.8 - e.value * 1.2) / t).toFixed(2)}s`;
  }
  _edgeColor(e) {
    const t = this._thresholdColor(e.to);
    if (t)
      return t;
    if (e.direction === "reverse")
      return "#50f0a6";
    switch (e.severity) {
      case "overflow":
        return "#ff6259";
      case "critical":
        return "#ffb000";
      case "warning":
        return "#ffd23f";
      case "normal":
      default:
        return this._config.base_color ?? (e.from.role === "source" ? "#47f0bd" : "#38a5ff");
    }
  }
  _edgeStart(e) {
    return e.direction === "reverse" ? "#38a5ff" : "#76ffe2";
  }
  _gradientId(e) {
    return `nexus-gradient-${e.replace(/\W+/g, "-")}`;
  }
  _pathId(e) {
    return `nexus-path-${e.replace(/\W+/g, "-")}`;
  }
  _nodeAccent(e) {
    const t = this._thresholdColor(e);
    return t || (e.color ? e.color : e.role === "source" ? "#54f1b8" : e.severity === "critical" || e.severity === "overflow" ? "#ff6259" : e.severity === "warning" ? "#ffd23f" : this._config.base_color ?? "#8bbcff");
  }
  _isSolarSource(e) {
    const t = [e.id, e.name, e.icon, e.entity].filter(Boolean).join(" ").toLowerCase();
    return t.includes("solar") || t.includes("sun") || t.includes("fotovolta") || t.includes("photovolta") || t.includes("white-balance-sunny");
  }
  _thresholdColor(e) {
    const t = [...this._config.color_thresholds ?? []].sort((r, n) => n.above - r.above), i = this._mode === "power" ? e.value * 1e3 : e.value, o = t.find((r) => (!r.node_id || r.node_id === "__all__" || r.node_id === e.id) && i >= r.above);
    return o == null ? void 0 : o.color;
  }
  _nodeStatus(e) {
    return e.overflow ? "Desbordamiento" : e.direction === "reverse" ? e.role === "source" ? "Exportando" : "Flujo inverso" : e.value <= 1e-3 ? "Standby" : e.role === "source" ? "Aportando" : "Activo";
  }
};
A.styles = ht`
    :host {
      display: block;
      color: var(--primary-text-color, #f6f8fb);
      --nexus-bg: rgba(8, 18, 31, 0.82);
      --nexus-surface: rgba(24, 40, 58, 0.64);
      --nexus-surface-strong: rgba(34, 54, 76, 0.78);
      --nexus-line: rgba(164, 197, 226, 0.18);
      --nexus-muted: rgba(221, 232, 244, 0.68);
      --nexus-soft: rgba(221, 232, 244, 0.44);
      --nexus-cyan: #3aa7ff;
      --nexus-teal: #49f0bf;
      --nexus-green: #58ee83;
      --nexus-yellow: #ffd23f;
      --nexus-red: #ff6259;
      letter-spacing: 0;
    }

    .nexus-shell {
      display: block;
      overflow: hidden;
      border: 1px solid rgba(139, 180, 216, 0.18);
      border-radius: 20px;
      background:
        linear-gradient(135deg, rgba(21, 36, 54, 0.88), rgba(5, 15, 26, 0.96)),
        var(--card-background-color, #08121f);
      box-shadow: 0 22px 58px rgba(0, 0, 0, 0.38);
    }

    .nexus-shell.bg-transparent {
      border-color: transparent;
      background: transparent;
      box-shadow: none;
    }

    .nexus-shell.bg-solid {
      background: var(--card-background-color, #08121f);
      box-shadow: none;
    }

    .nexus-card-frame {
      position: relative;
      min-width: 0;
      padding: 24px 30px 18px;
      border-radius: inherit;
      background:
        linear-gradient(90deg, rgba(64, 165, 255, 0.1), transparent 32%, rgba(73, 240, 191, 0.07)),
        rgba(4, 11, 19, 0.38);
      backdrop-filter: blur(12px);
      overflow: hidden;
    }

    .bg-transparent .nexus-card-frame {
      background: transparent;
      backdrop-filter: none;
    }

    .bg-solid .nexus-card-frame {
      background: rgba(8, 18, 31, 0.96);
      backdrop-filter: none;
    }

    .topbar,
    .summary-strip {
      position: relative;
      z-index: 3;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 18px;
    }

    .brand {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      min-width: 0;
    }

    .brand-icon {
      display: grid;
      width: 38px;
      height: 38px;
      place-items: center;
      color: #62c7ff;
      filter: drop-shadow(0 0 12px rgba(56, 165, 255, 0.45));
    }

    .brand-icon ha-icon {
      --mdc-icon-size: 34px;
    }

    h2 {
      margin: 0;
      font-size: 28px;
      line-height: 1.1;
      font-weight: 760;
      letter-spacing: 0;
    }

    .brand p {
      display: flex;
      align-items: center;
      gap: 7px;
      margin: 18px 0 0;
      color: var(--nexus-muted);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .brand p strong {
      color: #7ff3ae;
      font-weight: 760;
    }

    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--nexus-green);
      box-shadow: 0 0 14px rgba(88, 238, 131, 0.9);
    }

    .summary-strip {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    button,
    select {
      font: inherit;
      letter-spacing: 0;
    }

    .health-pill {
      display: flex;
      align-items: center;
      min-height: 44px;
      border: 1px solid var(--nexus-line);
      border-radius: 22px;
      background: rgba(12, 22, 34, 0.55);
      color: var(--nexus-muted);
      backdrop-filter: blur(12px);
    }

    .summary-strip {
      justify-content: space-between;
      margin-bottom: 0;
    }

    .primary-metric {
      display: grid;
      gap: 4px;
    }

    .primary-metric span {
      color: var(--nexus-muted);
      font-size: 12px;
      font-weight: 750;
      text-transform: uppercase;
    }

    .primary-metric strong {
      font-size: 48px;
      line-height: 1;
      font-weight: 740;
    }

    .health-pill {
      gap: 8px;
      padding: 0 16px;
      color: #68f292;
      font-weight: 700;
    }

    .health-pill.warning {
      color: var(--nexus-yellow);
    }

    .graph-stage {
      position: relative;
      z-index: 2;
      min-height: 520px;
      margin-top: 2px;
    }

    .flow-layer,
    .node-layer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .flow-layer {
      z-index: 1;
      overflow: visible;
    }

    .node-layer {
      z-index: 2;
    }

    .flow-halo {
      fill: none;
      stroke: rgba(104, 181, 255, 0.08);
      stroke-linecap: round;
    }

    .flow-path {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .flow-path.power {
      stroke-dasharray: 5 18;
      animation: dash-flow 1.4s linear infinite;
    }

    .flow-edge.overflow .flow-halo {
      stroke: rgba(255, 98, 89, 0.2);
    }

    .particle {
      filter: drop-shadow(0 0 8px currentColor);
    }

    @keyframes dash-flow {
      to {
        stroke-dashoffset: -46;
      }
    }

    .flow-node {
      position: absolute;
      box-sizing: border-box;
      overflow: hidden;
      border: 1px solid rgba(158, 195, 226, 0.22);
      border-radius: 12px;
      background:
        linear-gradient(180deg, rgba(40, 61, 82, 0.72), rgba(17, 31, 46, 0.72)),
        rgba(14, 26, 39, 0.76);
      color: #f7fbff;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 14px 32px rgba(0, 0, 0, 0.28);
      backdrop-filter: blur(12px);
      outline: 0;
      cursor: default;
      transition:
        border-color 180ms ease,
        transform 180ms ease,
        box-shadow 180ms ease,
        background 180ms ease;
    }

    .flow-node:hover,
    .flow-node:focus-visible {
      transform: translateY(-1px);
      border-color: rgba(120, 190, 255, 0.56);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        0 18px 42px rgba(0, 0, 0, 0.38);
    }

    .flow-node.is-container {
      cursor: pointer;
    }

    .flow-node.warning {
      border-color: rgba(255, 210, 63, 0.52);
    }

    .flow-node.critical,
    .flow-node.overflow {
      border-color: rgba(255, 98, 89, 0.72);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        0 0 0 1px rgba(255, 98, 89, 0.16),
        0 18px 38px rgba(255, 98, 89, 0.12);
    }

    .flow-node.role-rest {
      opacity: 0.74;
      border-style: dashed;
    }

    .flow-node.role-source {
      padding: 18px;
    }

    .flow-node.role-source .node-main {
      height: auto;
      padding: 0;
    }

    .flow-node.role-source::after,
    .flow-node.is-root::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(95deg, rgba(73, 240, 191, 0.12), transparent 45%);
    }

    .node-main {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      height: 100%;
      padding: 0 18px;
    }

    .node-icon {
      display: grid;
      width: 34px;
      height: 34px;
      place-items: center;
      border-radius: 10px;
      color: var(--node-accent, #8bbcff);
      background: rgba(58, 167, 255, 0.1);
    }

    .role-source .node-icon {
      color: var(--node-accent, #54f1b8);
      background: rgba(73, 240, 191, 0.1);
    }

    .critical .node-icon,
    .overflow .node-icon {
      color: var(--nexus-red);
      background: rgba(255, 98, 89, 0.11);
    }

    .node-copy {
      display: grid;
      min-width: 0;
      gap: 4px;
    }

    .node-copy strong {
      overflow: hidden;
      font-size: 15px;
      font-weight: 710;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-copy span {
      color: #f7fbff;
      font-size: 14px;
      font-weight: 650;
    }

    .node-percent,
    .container-share {
      color: var(--node-accent, var(--nexus-green));
      font-size: 14px;
      font-weight: 780;
    }

    .warning .node-percent,
    .warning .container-share {
      color: var(--nexus-yellow);
    }

    .critical .node-percent,
    .overflow .node-percent,
    .critical .container-share,
    .overflow .container-share {
      color: var(--nexus-red);
    }

    .container-share {
      position: absolute;
      right: 18px;
      bottom: 9px;
      font-size: 12px;
    }

    .collapse-button {
      display: grid;
      width: 30px;
      height: 30px;
      place-items: center;
      border: 0;
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.74);
      background: transparent;
      cursor: pointer;
    }

    .collapse-button:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    .source-meta {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 8px 0 4px 51px;
      font-size: 13px;
      color: var(--nexus-green);
    }

    .source-meta span {
      color: var(--nexus-muted);
    }

    .role-source .sparkline {
      position: relative;
      z-index: 1;
      margin-left: 50px;
      width: calc(100% - 58px);
      height: 30px;
    }

    .sparkline-line {
      fill: none;
      stroke: #58ee83;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .sparkline-area {
      fill: rgba(88, 238, 131, 0.12);
      stroke: none;
    }

    .is-root {
      padding: 26px 26px 20px;
      border-radius: 14px;
      background:
        linear-gradient(180deg, rgba(31, 49, 70, 0.78), rgba(12, 24, 39, 0.8)),
        rgba(12, 24, 39, 0.82);
    }

    .root-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .root-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      color: var(--nexus-cyan);
    }

    .root-icon ha-icon {
      --mdc-icon-size: 34px;
    }

    .root-title {
      margin-top: 12px;
      font-size: 18px;
      font-weight: 740;
    }

    .root-value {
      margin-top: 16px;
      font-size: 36px;
      line-height: 1;
      font-weight: 740;
    }

    .root-subtitle {
      margin-top: 8px;
      color: var(--nexus-muted);
      font-size: 14px;
    }

    .gauge {
      position: relative;
      display: grid;
      width: 136px;
      height: 82px;
      place-items: center;
      margin: 22px auto 12px;
      border-radius: 152px 152px 16px 16px;
      background:
        radial-gradient(circle at 50% 85%, rgba(12, 24, 39, 1) 0 46%, transparent 47%),
        conic-gradient(from 230deg, var(--nexus-cyan) 0 var(--gauge), rgba(255, 255, 255, 0.14) var(--gauge) 74%, transparent 74%);
    }

    .gauge.is-hidden {
      display: none;
    }

    .gauge span {
      margin-top: 14px;
      font-size: 29px;
      font-weight: 760;
    }

    .gauge small {
      position: absolute;
      bottom: 8px;
      color: var(--nexus-muted);
      font-size: 11px;
    }

    .root-stats {
      display: grid;
      gap: 8px;
      margin: 0;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.09);
    }

    .root-stats div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      font-size: 13px;
    }

    .root-stats dt {
      color: var(--nexus-muted);
    }

    .root-stats dd {
      margin: 0;
      color: #f7fbff;
    }

    .tooltip {
      position: absolute;
      z-index: 5;
      box-sizing: border-box;
      padding: 14px;
      border: 1px solid rgba(158, 195, 226, 0.24);
      border-radius: 12px;
      background:
        linear-gradient(180deg, rgba(26, 42, 62, 0.88), rgba(11, 22, 36, 0.94)),
        rgba(10, 22, 34, 0.92);
      box-shadow: 0 22px 42px rgba(0, 0, 0, 0.42);
      backdrop-filter: blur(14px);
      pointer-events: none;
      --tooltip-accent: var(--nexus-red);
    }

    .tooltip header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 750;
    }

    .tooltip-icon {
      display: grid;
      flex: 0 0 auto;
      width: 34px;
      height: 34px;
      place-items: center;
      border-radius: 10px;
      color: var(--tooltip-accent);
      background: color-mix(in srgb, var(--tooltip-accent) 18%, transparent);
    }

    .tooltip-icon ha-icon {
      --mdc-icon-size: 19px;
    }

    .tooltip header div {
      min-width: 0;
      flex: 1;
    }

    .tooltip header strong,
    .tooltip-value {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tooltip-value,
    .tooltip header em {
      color: var(--tooltip-accent);
      font-style: normal;
      font-weight: 800;
    }

    .tooltip-value {
      margin-top: 4px;
      font-size: 13px;
    }

    .tooltip p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 10px 0 8px;
      color: var(--nexus-muted);
      font-size: 13px;
    }

    .tooltip .dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--tooltip-accent);
    }

    .tooltip .sparkline {
      width: 100%;
      height: 58px;
      margin: 4px 0 10px;
    }

    .tooltip .sparkline-line {
      stroke: var(--tooltip-accent);
      stroke-width: 2.4;
    }

    .tooltip .sparkline-area {
      fill: var(--tooltip-accent);
      fill-opacity: 0.13;
    }

    .tooltip footer {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--nexus-muted);
      font-size: 12px;
    }

    .tooltip footer ha-icon {
      --mdc-icon-size: 16px;
    }

    @media (max-width: 767px) {
      .nexus-card-frame {
        padding: 16px 14px 12px;
      }

      .topbar,
      .summary-strip {
        align-items: stretch;
        flex-direction: column;
      }

      .primary-metric strong {
        font-size: 38px;
      }

      .flow-node.role-source {
        padding: 12px;
      }

      .flow-node.role-source .source-meta,
      .flow-node.role-source .sparkline {
        display: none;
      }

      .node-main {
        padding: 0 12px;
        gap: 8px;
      }

      .node-copy strong {
        font-size: 13px;
      }

      .node-copy span,
      .node-percent {
        font-size: 12px;
      }

      .source-meta {
        margin-left: 44px;
      }

      .role-source .sparkline {
        margin-left: 42px;
      }

      .is-root {
        padding: 18px;
      }
    }
  `;
T([
  C()
], A.prototype, "_config", 2);
T([
  C()
], A.prototype, "_graph", 2);
T([
  C()
], A.prototype, "_mode", 2);
T([
  C()
], A.prototype, "_width", 2);
T([
  C()
], A.prototype, "_tooltip", 2);
T([
  C()
], A.prototype, "_expandedIds", 2);
T([
  C()
], A.prototype, "_collapsedIds", 2);
A = T([
  mt("nexus-energy-card")
], A);
function Bi(e, t, i) {
  if (e.length === 0)
    return `M 0 ${i / 2} L ${t} ${i / 2}`;
  const o = Math.min(...e), r = Math.max(...e), n = Math.max(1e-3, r - o);
  return e.map((a, l) => {
    const c = e.length === 1 ? t : l / (e.length - 1) * t, h = i - (a - o) / n * (i - 8) - 4;
    return `${l === 0 ? "M" : "L"} ${c.toFixed(2)} ${h.toFixed(2)}`;
  }).join(" ");
}
function Vi(e, t, i) {
  var d, u;
  if (e.length === 0)
    return `M 0 ${i / 2} L ${t} ${i / 2}`;
  const o = [...e].sort((m, v) => m.time - v.time), r = o.map((m) => m.value), n = Math.min(...r), s = Math.max(...r), a = Math.max(1e-3, s - n), l = ((d = o[0]) == null ? void 0 : d.time) ?? 0, c = ((u = o.at(-1)) == null ? void 0 : u.time) ?? l, h = Math.max(1, c - l);
  return o.map((m, v) => {
    const w = (m.time - l) / h * t, $ = i - (m.value - n) / a * (i - 8) - 4;
    return `${v === 0 ? "M" : "L"} ${w.toFixed(2)} ${$.toFixed(2)}`;
  }).join(" ");
}
function st(e, t) {
  const i = Gi(e), o = i.find(
    (r) => r.some((n) => n.entity_id === t)
  ) ?? i[0] ?? [];
  return o.map((r, n) => qi(r, n, o.length)).filter((r) => !!r).sort((r, n) => r.time - n.time);
}
function Gi(e) {
  return Array.isArray(e) ? e.every(Array.isArray) ? e : [e] : [];
}
function qi(e, t, i) {
  if (!e || typeof e != "object")
    return;
  const o = e, r = o.state ?? o.s, n = Number.parseFloat(String(r ?? "").replace(",", "."));
  return Number.isFinite(n) ? { time: Zi(o.last_changed ?? o.last_updated ?? o.lc ?? o.lu) ?? Date.now() - Math.max(0, i - t - 1) * 6e4, value: Math.abs(n) } : void 0;
}
function Zi(e) {
  if (typeof e == "string") {
    const t = Date.parse(e);
    return Number.isFinite(t) ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return e > 1e12 ? e : e * 1e3;
}
function Yi(e) {
  return e >= 100 || Number.isInteger(e) ? Math.round(e).toString() : e >= 10 ? at(e.toFixed(1)) : at(e.toFixed(2));
}
function at(e) {
  return e.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
function Se(e, t, i) {
  return Math.min(i, Math.max(t, e));
}
var Ki = Object.defineProperty, Xi = Object.getOwnPropertyDescriptor, _e = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Xi(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (o ? s(t, i, r) : s(r)) || r);
  return o && r && Ki(t, i, r), r;
};
const N = "__source__", X = "__all__", de = {
  id: "home",
  name: "Casa",
  icon: "mdi:home-outline",
  children: []
}, Ji = [
  "mdi:home-outline",
  "mdi:white-balance-sunny",
  "mdi:battery-charging-60",
  "mdi:transmission-tower",
  "mdi:engine",
  "mdi:office-building-marker-outline",
  "mdi:sofa-outline",
  "mdi:pot-steam-outline",
  "mdi:stove",
  "mdi:microwave",
  "mdi:toilet",
  "mdi:bed-king-outline",
  "mdi:bed-outline",
  "mdi:bathtub-outline",
  "mdi:power-plug-outline",
  "mdi:dots-horizontal"
];
let R = class extends F {
  constructor() {
    super(...arguments), this._config = ee, this._flatNodes = [], this._addThreshold = () => {
      const e = {
        id: `threshold-${Date.now().toString(36)}`,
        node_id: X,
        above: 2e3,
        color: "#ffb000"
      };
      this._patchConfig("color_thresholds", [...this._config.color_thresholds ?? [], e]);
    };
  }
  setConfig(e) {
    const t = this._expandedNodeId, i = {
      ...ee,
      ...e,
      thresholds: {
        ...ee.thresholds,
        ...e.thresholds
      },
      sources: e.sources ?? [],
      nodes: e.nodes ?? []
    }, o = Qi(i);
    this._config = i, this._flatNodes = o, this._expandedNodeId = t && o.some((r) => r.id === t) ? t : void 0;
  }
  set hass(e) {
    this._hass = e, this.requestUpdate();
  }
  render() {
    const e = this._filteredEntities(), t = this._mainNode();
    return g`
      <div class="editor">
        <header class="editor-head">
          <span class="head-icon"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon></span>
          <div>
            <h3>Nexus Energy Card</h3>
            <p>Configuracion visual</p>
          </div>
        </header>

        <datalist id="nexus-entities">
          ${e.map((i) => g`<option value=${i.entity_id}>${i.label}</option>`)}
        </datalist>
        <datalist id="nexus-icons">
          ${Ji.map((i) => g`<option value=${i}></option>`)}
        </datalist>

        ${this._renderGeneral(t, e)}
        ${this._renderBuilder(t, e)}
        ${this._renderAppearance()}
        ${this._renderThresholds(t)}
      </div>
    `;
  }
  _renderGeneral(e, t) {
    return g`
      <section class="panel">
        <div class="panel-head">
          <h4>Configuracion general</h4>
        </div>
        <div class="grid general-grid">
          <label>
            Titulo de la tarjeta
            <input .value=${this._config.title ?? ""} @input=${(i) => this._patchConfig("title", U(b(i)))} />
          </label>
          ${this._renderEntityField(
      "Entidad de la Casa",
      e.entity ?? e.power_entity ?? "",
      t,
      (i) => this._patchMain(this._entityPatch(i))
    )}
          <label>
            Tolerancia de desbordamiento (%)
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              .value=${String(this._config.overflow_tolerance ?? 5)}
              @input=${(i) => this._patchConfig("overflow_tolerance", io(Number(b(i))))}
            />
          </label>
          <label>
            Nombre del nodo principal
            <input
              .value=${e.name ?? "Casa"}
              @input=${(i) => this._patchMain({ name: U(b(i)) || "Casa" })}
            />
          </label>
          <label>
            Icono del nodo principal
            <input
              list="nexus-icons"
              .value=${e.icon ?? "mdi:home-outline"}
              @input=${(i) => this._patchMain({ icon: U(b(i)) || "mdi:home-outline" })}
            />
          </label>
        </div>
      </section>
    `;
  }
  _renderBuilder(e, t) {
    const i = this._flatNodes.length > 0;
    return g`
      <section class="panel">
        <div class="panel-head">
          <h4>Constructor del arbol</h4>
          ${i ? g`
                <div class="head-actions">
                  <button type="button" @click=${() => this._addNode(N)}>Fuente</button>
                  <button type="button" @click=${() => this._addNode(this._mainId())}>Nodo</button>
                </div>
              ` : _}
        </div>
        ${i ? g`<div class="node-list">${this._flatNodes.map((o) => this._renderNodeRow(o, e, t))}</div>` : g`
              <div class="zero-state">
                <button class="primary-add" type="button" @click=${() => this._addNode(this._mainId())}>
                  <span class="add-mark">+</span>
                  Anadir Primer Nodo
                </button>
              </div>
            `}
      </section>
    `;
  }
  _renderNodeRow(e, t, i) {
    const o = e.parentId === N, r = o ? 0 : this._depthOf(e), n = o ? "Raiz/Fuente" : e.parentId === this._mainId() ? t.name ?? "Casa" : this._nodeName(e.parentId), s = e.entity ?? e.power_entity ?? e.energy_entity ?? "Sin entidad", a = this._expandedNodeId === e.id;
    return g`
      <article class=${`node-row ${o ? "is-source" : ""}`} style=${`--depth:${r}`}>
        <div class="row-title">
          <button
            class="row-toggle"
            type="button"
            aria-expanded=${a}
            title=${a ? "Contraer" : "Editar"}
            @click=${() => this._toggleNode(e.id)}
          >
            <span class="row-icon"><ha-icon icon=${e.icon ?? (o ? "mdi:flash" : "mdi:power-plug-outline")}></ha-icon></span>
            <span class="row-summary">
              <strong>${e.name || "Nodo sin nombre"}</strong>
              <small>${s} - ${n}</small>
            </span>
            <ha-icon class="chevron" icon=${a ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
          </button>
          <button class="icon-button danger" type="button" title="Eliminar" @click=${() => this._removeNode(e.id)}>
            <ha-icon icon="mdi:trash-can-outline"></ha-icon>
          </button>
        </div>

        ${a ? g`
              <div class="node-form">
                <div class="grid node-grid">
                  ${this._renderEntityField(
      "Entidad",
      e.entity ?? e.power_entity ?? e.energy_entity ?? "",
      i,
      (l) => this._patchNode(e.id, this._entityPatch(l))
    )}
                  <label>
                    Nombre a mostrar
                    <input .value=${e.name} @input=${(l) => this._patchNode(e.id, { name: U(b(l)) })} />
                  </label>
                  <label>
                    Icono
                    <input
                      list="nexus-icons"
                      .value=${e.icon ?? ""}
                      @input=${(l) => this._patchNode(e.id, { icon: U(b(l)) || void 0 })}
                    />
                  </label>
                  <label>
                    Nodo padre
                    <select .value=${e.parentId} @change=${(l) => this._patchNode(e.id, { parentId: b(l) })}>
                      <option value=${N} ?selected=${e.parentId === N}>Raiz/Fuente</option>
                      <option value=${this._mainId()} ?selected=${e.parentId === this._mainId()}>${t.name ?? "Casa"}</option>
                      ${this._flatNodes.filter((l) => this._canUseAsParent(l, e)).map((l) => g`<option value=${l.id} ?selected=${e.parentId === l.id}>${l.name}</option>`)}
                    </select>
                  </label>
                  <label>
                    Direccion
                    <select
                      .value=${e.direction ?? "auto"}
                      @change=${(l) => this._patchNode(e.id, { direction: b(l) })}
                    >
                      <option value="auto">Auto</option>
                      <option value="import">Importar</option>
                      <option value="export">Exportar</option>
                    </select>
                  </label>
                  <label>
                    Capacidad kW
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      .value=${e.capacity === void 0 ? "" : String(e.capacity)}
                      @input=${(l) => this._patchNode(e.id, { capacity: to(b(l)) })}
                    />
                  </label>
                  ${this._renderCheck("Invertir valor", e.invert_value === !0, (l) => this._patchNode(e.id, { invert_value: l }))}
                </div>
              </div>
            ` : _}
      </article>
    `;
  }
  _renderAppearance() {
    const e = this._config.animation_speed ?? 1, t = e < 0.85 ? "Lento" : e > 1.25 ? "Rapido" : "Normal";
    return g`
      <section class="panel">
        <div class="panel-head">
          <h4>Apariencia y animaciones</h4>
        </div>
        <div class="grid appearance-grid">
          <label>
            Grosor de las lineas
            <div class="range-row">
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                .value=${String(this._config.line_width_base ?? 2)}
                @input=${(i) => this._patchConfig("line_width_base", Number(b(i)))}
              />
              <output>${this._config.line_width_base ?? 2}px</output>
            </div>
          </label>
          <label>
            Velocidad
            <div class="range-row">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                .value=${String(e)}
                @input=${(i) => this._patchConfig("animation_speed", Number(b(i)))}
              />
              <output>${t}</output>
            </div>
          </label>
          <label>
            Estilo del fondo
            <select
              .value=${this._config.background_style ?? "glass"}
              @change=${(i) => this._patchConfig("background_style", b(i))}
            >
              <option value="glass">Glassmorphism</option>
              <option value="transparent">Transparente</option>
              <option value="solid">Color solido</option>
            </select>
          </label>
          <label>
            Color base
            <input type="color" .value=${this._config.base_color ?? "#38a5ff"} @input=${(i) => this._patchConfig("base_color", b(i))} />
          </label>
          ${this._renderCheck("Animacion", this._config.animation !== !1, (i) => this._patchConfig("animation", i))}
          ${this._renderCheck("Ocultar nodos a 0W", this._config.hide_zero_nodes === !0, (i) => this._patchConfig("hide_zero_nodes", i))}
          <label>
            Profundidad expandida
            <input
              type="number"
              min="0"
              max="6"
              .value=${String(this._config.default_expanded_depth ?? 2)}
              @input=${(i) => this._patchConfig("default_expanded_depth", Number(b(i)))}
            />
          </label>
          <label>
            Alto
            <input
              type="number"
              min="520"
              step="20"
              .value=${String(this._config.height ?? 720)}
              @input=${(i) => this._patchConfig("height", Number(b(i)))}
            />
          </label>
        </div>
      </section>
    `;
  }
  _renderThresholds(e) {
    const t = this._config.color_thresholds ?? [], i = [{ id: this._mainId(), name: e.name ?? "Casa" }, ...this._flatNodes.map((o) => ({ id: o.id, name: o.name }))];
    return g`
      <section class="panel">
        <div class="panel-head">
          <h4>Umbrales de color</h4>
          <button type="button" @click=${this._addThreshold}>Anadir umbral</button>
        </div>
        <div class="threshold-list">
          ${t.length ? t.map(
      (o, r) => g`
                  <article class="threshold-row">
                    <label>
                      Nodo
                      <select
                        .value=${o.node_id ?? X}
                        @change=${(n) => this._patchThreshold(r, { node_id: b(n) })}
                      >
                        <option value=${X}>Todos</option>
                        ${i.map((n) => g`<option value=${n.id}>${n.name}</option>`)}
                      </select>
                    </label>
                    <label>
                      Por encima de
                      <input
                        type="number"
                        min="0"
                        step="10"
                        .value=${String(o.above)}
                        @input=${(n) => this._patchThreshold(r, { above: Number(b(n)) })}
                      />
                    </label>
                    <label>
                      Color
                      <input type="color" .value=${o.color} @input=${(n) => this._patchThreshold(r, { color: b(n) })} />
                    </label>
                    <button class="icon-button danger" type="button" title="Eliminar" @click=${() => this._removeThreshold(r)}>
                      <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                    </button>
                  </article>
                `
    ) : g`<div class="empty-state">Sin umbrales personalizados.</div>`}
        </div>
      </section>
    `;
  }
  _renderEntityField(e, t, i, o) {
    return g`
      <label>
        ${e}
        <input
          list="nexus-entities"
          .value=${t}
          @input=${(r) => o(U(b(r)))}
          placeholder="sensor..."
        />
        ${i.length ? _ : g`<span class="field-note">sensor power</span>`}
      </label>
    `;
  }
  _renderCheck(e, t, i) {
    return g`
      <label class="check-row">
        <input type="checkbox" .checked=${t} @change=${(o) => i(o.target.checked)} />
        <span>${e}</span>
      </label>
    `;
  }
  _filteredEntities() {
    var t;
    return Object.values(((t = this._hass) == null ? void 0 : t.states) ?? {}).filter((i) => {
      const o = i.entity_id, r = String(i.attributes.device_class ?? "");
      return o.startsWith("sensor.") && r === "power";
    }).map((i) => ({
      entity_id: i.entity_id,
      label: `${i.attributes.friendly_name ?? i.entity_id} (${i.attributes.unit_of_measurement ?? ""})`,
      deviceClass: String(i.attributes.device_class ?? "")
    })).sort((i, o) => i.label.localeCompare(o.label));
  }
  _patchConfig(e, t) {
    this._commitConfig({
      ...this._config,
      [e]: t
    });
  }
  _patchMain(e) {
    const t = {
      ...this._mainNode(),
      ...e
    };
    this._config = {
      ...this._config,
      nodes: [t]
    }, this._emitConfig();
  }
  _patchNode(e, t) {
    this._flatNodes.find((o) => o.id === e) && (t.parentId && (t.parentId === e || this._isDescendant(t.parentId, e)) || (this._flatNodes = this._flatNodes.map((o) => o.id === e ? { ...o, ...t } : o), this._emitConfig()));
  }
  _addNode(e) {
    const t = e === N, i = eo(this._flatNodes, t ? "fuente" : "nodo");
    this._flatNodes = [
      ...this._flatNodes,
      {
        id: i,
        parentId: e,
        name: t ? "Nueva fuente" : "Nuevo nodo",
        icon: t ? "mdi:flash" : "mdi:power-plug-outline",
        direction: "auto"
      }
    ], this._expandedNodeId = i, this._emitConfig();
  }
  _removeNode(e) {
    const t = /* @__PURE__ */ new Set([e]);
    let i = !0;
    for (; i; ) {
      i = !1;
      for (const o of this._flatNodes)
        t.has(o.parentId) && !t.has(o.id) && (t.add(o.id), i = !0);
    }
    this._flatNodes = this._flatNodes.filter((o) => !t.has(o.id)), this._expandedNodeId && t.has(this._expandedNodeId) && (this._expandedNodeId = void 0), this._emitConfig();
  }
  _toggleNode(e) {
    this._expandedNodeId = this._expandedNodeId === e ? void 0 : e;
  }
  _patchThreshold(e, t) {
    var o;
    const i = [...this._config.color_thresholds ?? []];
    i[e] = {
      ...i[e],
      ...t,
      node_id: t.node_id === X ? X : t.node_id ?? ((o = i[e]) == null ? void 0 : o.node_id)
    }, this._patchConfig("color_thresholds", i);
  }
  _removeThreshold(e) {
    this._patchConfig(
      "color_thresholds",
      (this._config.color_thresholds ?? []).filter((t, i) => i !== e)
    );
  }
  _entityPatch(e) {
    return e ? {
      entity: e,
      power_entity: e,
      energy_entity: void 0
    } : {
      entity: void 0,
      power_entity: void 0,
      energy_entity: void 0
    };
  }
  _mainNode() {
    var e;
    return ((e = this._config.nodes) == null ? void 0 : e[0]) ?? de;
  }
  _mainId() {
    return this._mainNode().id ?? "home";
  }
  _nodeName(e) {
    var t;
    return ((t = this._flatNodes.find((i) => i.id === e)) == null ? void 0 : t.name) ?? e;
  }
  _canUseAsParent(e, t) {
    return e.id !== t.id && e.parentId !== N && !this._isDescendant(e.id, t.id);
  }
  _isDescendant(e, t) {
    let i = e;
    for (; i && i !== N && i !== this._mainId(); ) {
      if (i === t)
        return !0;
      const o = this._flatNodes.find((r) => r.id === i);
      i = (o == null ? void 0 : o.parentId) ?? "";
    }
    return !1;
  }
  _depthOf(e) {
    let t = 0, i = e.parentId;
    for (; i && i !== this._mainId() && i !== N; ) {
      const o = this._flatNodes.find((r) => r.id === i);
      if (!o)
        break;
      t += 1, i = o.parentId;
    }
    return t;
  }
  _emitConfig() {
    const e = this._mainNode(), t = e.id ?? "home", i = this._flatNodes.filter((s) => s.parentId === N).map((s) => At(s)), o = Nt(this._flatNodes, t), r = o.length || this._hasConfiguredMain(e) ? [
      {
        ...e,
        id: t,
        children: o
      }
    ] : [], n = {
      ...this._config,
      mode: "power",
      sources: i,
      nodes: r
    };
    this._commitConfig(n);
  }
  _commitConfig(e) {
    this._config = e, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _hasConfiguredMain(e) {
    return !!(e.entity || e.power_entity || e.energy_entity || e.capacity !== void 0 || e.color || e.name && e.name !== de.name || e.icon && e.icon !== de.icon);
  }
};
R.styles = ht`
    :host {
      display: block;
      color: var(--primary-text-color, #eef5ff);
      letter-spacing: 0;
      --editor-surface: rgba(21, 36, 54, 0.62);
      --editor-surface-soft: rgba(255, 255, 255, 0.045);
      --editor-line: rgba(150, 180, 210, 0.2);
      --editor-muted: var(--secondary-text-color, rgba(230, 240, 250, 0.68));
      --editor-accent: #3aa7ff;
      --editor-danger: #ff6259;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .editor {
      display: grid;
      gap: 14px;
      max-width: 100%;
      overflow-x: hidden;
      padding: 16px;
    }

    .editor-head,
    .panel {
      border: 1px solid var(--editor-line);
      border-radius: 8px;
      background: var(--editor-surface);
    }

    .editor-head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
    }

    .head-icon,
    .row-icon {
      display: grid;
      flex: 0 0 auto;
      width: 36px;
      height: 36px;
      place-items: center;
      border-radius: 8px;
      color: #6fc8ff;
      background: rgba(58, 167, 255, 0.12);
    }

    h3,
    h4,
    p {
      margin: 0;
    }

    h3 {
      font-size: 18px;
      line-height: 1.2;
    }

    h4 {
      font-size: 14px;
      text-transform: uppercase;
    }

    p,
    small,
    .field-note,
    .empty-state {
      color: var(--editor-muted);
    }

    p,
    small,
    .field-note {
      font-size: 12px;
    }

    .panel {
      display: grid;
      gap: 12px;
      padding: 14px;
    }

    .panel-head,
    .head-actions,
    .row-title,
    .range-row {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .panel-head,
    .row-title {
      justify-content: space-between;
    }

    .head-actions {
      margin-left: auto;
    }

    .head-actions button {
      min-width: 0;
    }

    .grid {
      display: grid;
      gap: 10px;
    }

    .general-grid {
      grid-template-columns: 1fr;
    }

    .appearance-grid {
      grid-template-columns: 1fr;
    }

    .node-list,
    .threshold-list {
      display: grid;
      gap: 10px;
    }

    .node-row,
    .threshold-row,
    .empty-state {
      border: 1px solid rgba(150, 180, 210, 0.16);
      border-radius: 8px;
      background: var(--editor-surface-soft);
    }

    .node-row {
      display: grid;
      gap: 10px;
      padding: 12px;
    }

    .node-row.is-source .row-icon {
      color: #57efbd;
      background: rgba(73, 240, 191, 0.12);
    }

    .row-title {
      min-width: 0;
    }

    .row-toggle {
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 0;
      gap: 10px;
      padding: 0;
      border: 0;
      color: inherit;
      background: transparent;
      text-align: left;
    }

    .row-toggle:hover {
      border-color: transparent;
      background: transparent;
    }

    .row-summary {
      display: block;
      min-width: 0;
      flex: 1;
    }

    .row-summary strong,
    .row-summary small {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chevron {
      flex: 0 0 auto;
      color: var(--editor-muted);
    }

    .node-form {
      display: grid;
      min-width: 0;
    }

    .node-grid {
      grid-template-columns: 1fr;
    }

    .threshold-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      align-items: end;
      padding: 10px;
    }

    label {
      display: grid;
      gap: 6px;
      min-width: 0;
      color: var(--editor-muted);
      font-size: 12px;
      font-weight: 700;
    }

    input,
    select {
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
      min-height: 36px;
      border: 1px solid rgba(150, 180, 210, 0.24);
      border-radius: 8px;
      padding: 0 10px;
      color: var(--primary-text-color, #eef5ff);
      background: rgba(0, 0, 0, 0.18);
      font: inherit;
      letter-spacing: 0;
      outline: 0;
    }

    input:focus,
    select:focus {
      border-color: rgba(90, 170, 255, 0.64);
    }

    input[type="color"] {
      padding: 4px;
    }

    input[type="range"] {
      padding: 0;
      accent-color: var(--editor-accent);
    }

    button {
      box-sizing: border-box;
      max-width: 100%;
      min-height: 34px;
      border: 1px solid rgba(90, 170, 255, 0.35);
      border-radius: 8px;
      padding: 0 12px;
      color: #dff0ff;
      background: rgba(58, 167, 255, 0.16);
      font: inherit;
      cursor: pointer;
      letter-spacing: 0;
    }

    button:hover {
      border-color: rgba(90, 170, 255, 0.6);
      background: rgba(58, 167, 255, 0.24);
    }

    .icon-button {
      display: grid;
      width: 36px;
      min-height: 36px;
      place-items: center;
      padding: 0;
    }

    .danger {
      border-color: rgba(255, 98, 89, 0.28);
      color: #ff837b;
      background: rgba(255, 98, 89, 0.1);
    }

    .check-row {
      display: flex;
      align-items: center;
      min-height: 36px;
      gap: 9px;
      padding: 0 10px;
      border: 1px solid rgba(150, 180, 210, 0.16);
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.12);
    }

    .check-row input {
      width: 16px;
      min-height: 16px;
      accent-color: var(--editor-accent);
    }

    .range-row output {
      min-width: 62px;
      color: #dff0ff;
      text-align: right;
      font-weight: 700;
    }

    .empty-state {
      padding: 16px;
      text-align: center;
    }

    .zero-state {
      display: grid;
      min-width: 0;
    }

    .primary-add {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 58px;
      gap: 10px;
      border-style: dashed;
      font-weight: 800;
    }

    .add-mark {
      display: grid;
      width: 24px;
      height: 24px;
      place-items: center;
      border-radius: 999px;
      color: #04121f;
      background: #8bd8ff;
      font-size: 18px;
      line-height: 1;
    }

    @media (max-width: 900px) {
      .general-grid,
      .appearance-grid,
      .node-grid,
      .threshold-row {
        grid-template-columns: 1fr;
      }

      .panel-head,
      .editor-head {
        align-items: stretch;
        flex-direction: column;
      }

      .head-actions {
        width: 100%;
        margin-left: 0;
      }

      .head-actions button {
        flex: 1;
      }

      .node-row {
        margin-left: 0;
      }
    }
  `;
_e([
  C()
], R.prototype, "_config", 2);
_e([
  C()
], R.prototype, "_flatNodes", 2);
_e([
  C()
], R.prototype, "_expandedNodeId", 2);
R = _e([
  mt("nexus-energy-card-editor")
], R);
function Qi(e) {
  var n;
  const t = [], i = (n = e.nodes) == null ? void 0 : n[0], o = (i == null ? void 0 : i.id) ?? de.id ?? "home";
  for (const s of e.sources ?? [])
    t.push(lt(s, N, t.length));
  const r = (s, a) => {
    for (const l of s ?? []) {
      const c = lt(l, a, t.length);
      t.push(c), r(l.children, c.id);
    }
  };
  return r(i == null ? void 0 : i.children, o), t;
}
function lt(e, t, i) {
  const o = e.id ?? e.entity ?? `node-${i}`;
  return {
    id: o,
    parentId: t,
    name: e.name ?? o,
    entity: e.entity,
    power_entity: e.power_entity,
    energy_entity: e.energy_entity,
    icon: e.icon,
    capacity: e.capacity,
    direction: e.direction,
    invert_value: e.invert_value,
    color: e.color
  };
}
function Nt(e, t) {
  return e.filter((i) => i.parentId === t).map((i) => At(i, Nt(e, i.id)));
}
function At(e, t = []) {
  return {
    id: e.id,
    name: e.name,
    entity: e.entity,
    power_entity: e.power_entity,
    energy_entity: e.energy_entity,
    icon: e.icon,
    capacity: e.capacity,
    direction: e.direction,
    invert_value: e.invert_value || void 0,
    color: e.color,
    children: t
  };
}
function eo(e, t) {
  let i = e.length + 1, o = `${t}-${i}`;
  for (; e.some((r) => r.id === o); )
    i += 1, o = `${t}-${i}`;
  return o;
}
function U(e) {
  return e.trim();
}
function to(e) {
  const t = e.trim();
  if (!t)
    return;
  const i = Number(t);
  return Number.isFinite(i) ? i : void 0;
}
function io(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : 5;
}
function b(e) {
  return e.target.value;
}
const oo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get NexusEnergyCardEditor() {
    return R;
  }
}, Symbol.toStringTag, { value: "Module" }));
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "nexus-energy-card",
  name: "Nexus Energy Card",
  description: "Advanced hierarchical energy and power flow map with collapsible nodes."
});
//# sourceMappingURL=nexus-energy-card.js.map

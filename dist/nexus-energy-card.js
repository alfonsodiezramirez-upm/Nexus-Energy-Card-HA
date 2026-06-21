/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = globalThis, Oe = le.ShadowRoot && (le.ShadyCSS === void 0 || le.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Pe = Symbol(), Ge = /* @__PURE__ */ new WeakMap();
let _t = class {
  constructor(t, i, o) {
    if (this._$cssResult$ = !0, o !== Pe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (Oe && t === void 0) {
      const o = i !== void 0 && i.length === 1;
      o && (t = Ge.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && Ge.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ht = (e) => new _t(typeof e == "string" ? e : e + "", void 0, Pe), yt = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((o, r, n) => o + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new _t(i, e, Pe);
}, zt = (e, t) => {
  if (Oe) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const o = document.createElement("style"), r = le.litNonce;
    r !== void 0 && o.setAttribute("nonce", r), o.textContent = i.cssText, e.appendChild(o);
  }
}, Ve = Oe ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const o of t.cssRules) i += o.cssText;
  return Ht(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Rt, defineProperty: Dt, getOwnPropertyDescriptor: Ut, getOwnPropertyNames: Wt, getOwnPropertySymbols: Lt, getPrototypeOf: Ft } = Object, k = globalThis, qe = k.trustedTypes, Bt = qe ? qe.emptyScript : "", ve = k.reactiveElementPolyfillSupport, J = (e, t) => e, he = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Bt : null;
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
} }, He = (e, t) => !Rt(e, t), Ze = { attribute: !0, type: String, converter: he, reflect: !1, useDefault: !1, hasChanged: He };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), k.litPropertyMetadata ?? (k.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let L = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Ze) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const o = Symbol(), r = this.getPropertyDescriptor(t, o, i);
      r !== void 0 && Dt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, o) {
    const { get: r, set: n } = Ut(this.prototype, t) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: r, set(s) {
      const l = r == null ? void 0 : r.call(this);
      n == null || n.call(this, s), this.requestUpdate(t, l, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ze;
  }
  static _$Ei() {
    if (this.hasOwnProperty(J("elementProperties"))) return;
    const t = Ft(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(J("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(J("properties"))) {
      const i = this.properties, o = [...Wt(i), ...Lt(i)];
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
      for (const r of o) i.unshift(Ve(r));
    } else t !== void 0 && i.push(Ve(t));
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
    return zt(t, this.constructor.elementStyles), t;
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
      const l = o.getPropertyOptions(r), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : he;
      this._$Em = r;
      const c = a.fromAttribute(i, l.type);
      this[r] = c ?? ((s = this._$Ej) == null ? void 0 : s.get(r)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, i, o, r = !1, n) {
    var s;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (n = this[t]), o ?? (o = l.getPropertyOptions(t)), !((o.hasChanged ?? He)(n, i) || o.useDefault && o.reflect && n === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(l._$Eu(t, o)))) return;
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
        const { wrapped: l } = s, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, s, a);
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
L.elementStyles = [], L.shadowRootOptions = { mode: "open" }, L[J("elementProperties")] = /* @__PURE__ */ new Map(), L[J("finalized")] = /* @__PURE__ */ new Map(), ve == null || ve({ ReactiveElement: L }), (k.reactiveElementVersions ?? (k.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis, Ye = (e) => e, pe = Q.trustedTypes, Ke = pe ? pe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, xt = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, bt = "?" + T, jt = `<${bt}>`, H = document, te = () => H.createComment(""), ie = (e) => e === null || typeof e != "object" && typeof e != "function", ze = Array.isArray, Gt = (e) => ze(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", $e = `[ 	
\f\r]`, q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Xe = /-->/g, Je = />/g, I = RegExp(`>|${$e}(?:([^\\s"'>=/]+)(${$e}*=${$e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Qe = /'/g, et = /"/g, vt = /^(?:script|style|textarea|title)$/i, $t = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), m = $t(1), D = $t(2), j = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), tt = /* @__PURE__ */ new WeakMap(), O = H.createTreeWalker(H, 129);
function wt(e, t) {
  if (!ze(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ke !== void 0 ? Ke.createHTML(t) : t;
}
const Vt = (e, t) => {
  const i = e.length - 1, o = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = q;
  for (let l = 0; l < i; l++) {
    const a = e[l];
    let c, d, h = -1, p = 0;
    for (; p < a.length && (s.lastIndex = p, d = s.exec(a), d !== null); ) p = s.lastIndex, s === q ? d[1] === "!--" ? s = Xe : d[1] !== void 0 ? s = Je : d[2] !== void 0 ? (vt.test(d[2]) && (r = RegExp("</" + d[2], "g")), s = I) : d[3] !== void 0 && (s = I) : s === I ? d[0] === ">" ? (s = r ?? q, h = -1) : d[1] === void 0 ? h = -2 : (h = s.lastIndex - d[2].length, c = d[1], s = d[3] === void 0 ? I : d[3] === '"' ? et : Qe) : s === et || s === Qe ? s = I : s === Xe || s === Je ? s = q : (s = I, r = void 0);
    const g = s === I && e[l + 1].startsWith("/>") ? " " : "";
    n += s === q ? a + jt : h >= 0 ? (o.push(c), a.slice(0, h) + xt + a.slice(h) + T + g) : a + T + (h === -2 ? l : g);
  }
  return [wt(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class oe {
  constructor({ strings: t, _$litType$: i }, o) {
    let r;
    this.parts = [];
    let n = 0, s = 0;
    const l = t.length - 1, a = this.parts, [c, d] = Vt(t, i);
    if (this.el = oe.createElement(c, o), O.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = O.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(xt)) {
          const p = d[s++], g = r.getAttribute(h).split(T), x = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: n, name: x[2], strings: g, ctor: x[1] === "." ? Zt : x[1] === "?" ? Yt : x[1] === "@" ? Kt : _e }), r.removeAttribute(h);
        } else h.startsWith(T) && (a.push({ type: 6, index: n }), r.removeAttribute(h));
        if (vt.test(r.tagName)) {
          const h = r.textContent.split(T), p = h.length - 1;
          if (p > 0) {
            r.textContent = pe ? pe.emptyScript : "";
            for (let g = 0; g < p; g++) r.append(h[g], te()), O.nextNode(), a.push({ type: 2, index: ++n });
            r.append(h[p], te());
          }
        }
      } else if (r.nodeType === 8) if (r.data === bt) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(T, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += T.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const o = H.createElement("template");
    return o.innerHTML = t, o;
  }
}
function G(e, t, i = e, o) {
  var s, l;
  if (t === j) return t;
  let r = o !== void 0 ? (s = i._$Co) == null ? void 0 : s[o] : i._$Cl;
  const n = ie(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, i, o)), o !== void 0 ? (i._$Co ?? (i._$Co = []))[o] = r : i._$Cl = r), r !== void 0 && (t = G(e, r._$AS(e, t.values), r, o)), t;
}
class qt {
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
    let n = O.nextNode(), s = 0, l = 0, a = o[0];
    for (; a !== void 0; ) {
      if (s === a.index) {
        let c;
        a.type === 2 ? c = new re(n, n.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (c = new Xt(n, this, t)), this._$AV.push(c), a = o[++l];
      }
      s !== (a == null ? void 0 : a.index) && (n = O.nextNode(), s++);
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
    t = G(this, t, i), ie(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== j && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Gt(t) ? this.k(t) : this._(t);
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
    const { values: i, _$litType$: o } = t, r = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = oe.createElement(wt(o.h, o.h[0]), this.options)), o);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(i);
    else {
      const s = new qt(r, this), l = s.u(this.options);
      s.p(i), this.T(l), this._$AH = s;
    }
  }
  _$AC(t) {
    let i = tt.get(t.strings);
    return i === void 0 && tt.set(t.strings, i = new oe(t)), i;
  }
  k(t) {
    ze(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let o, r = 0;
    for (const n of t) r === i.length ? i.push(o = new re(this.O(te()), this.O(te()), this, this.options)) : o = i[r], o._$AI(n), r++;
    r < i.length && (this._$AR(o && o._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var o;
    for ((o = this._$AP) == null ? void 0 : o.call(this, !1, !0, i); t !== this._$AB; ) {
      const r = Ye(t).nextSibling;
      Ye(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class _e {
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
    if (n === void 0) t = G(this, t, i, 0), s = !ie(t) || t !== this._$AH && t !== j, s && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = n[0], a = 0; a < n.length - 1; a++) c = G(this, l[o + a], i, a), c === j && (c = this._$AH[a]), s || (s = !ie(c) || c !== this._$AH[a]), c === _ ? t = _ : t !== _ && (t += (c ?? "") + n[a + 1]), this._$AH[a] = c;
    }
    s && !r && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Zt extends _e {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class Yt extends _e {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class Kt extends _e {
  constructor(t, i, o, r, n) {
    super(t, i, o, r, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = G(this, t, i, 0) ?? _) === j) return;
    const o = this._$AH, r = t === _ && o !== _ || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, n = t !== _ && (o === _ || r);
    r && this.element.removeEventListener(this.name, this, o), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Xt {
  constructor(t, i, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    G(this, t);
  }
}
const we = Q.litHtmlPolyfillSupport;
we == null || we(oe, re), (Q.litHtmlVersions ?? (Q.litHtmlVersions = [])).push("3.3.3");
const Jt = (e, t, i) => {
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
class B extends L {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jt(i, this.renderRoot, this.renderOptions);
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
    return j;
  }
}
var mt;
B._$litElement$ = !0, B.finalized = !0, (mt = P.litElementHydrateSupport) == null || mt.call(P, { LitElement: B });
const Ce = P.litElementPolyfillSupport;
Ce == null || Ce({ LitElement: B });
(P.litElementVersions ?? (P.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ct = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = { attribute: !0, type: String, converter: he, reflect: !1, hasChanged: He }, ei = (e = Qt, t, i) => {
  const { kind: o, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), o === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), o === "accessor") {
    const { name: s } = i;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(s, a, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(s, void 0, e, l), l;
    } };
  }
  if (o === "setter") {
    const { name: s } = i;
    return function(l) {
      const a = this[s];
      t.call(this, l), this.requestUpdate(s, a, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function ti(e) {
  return (t, i) => typeof i == "object" ? ei(e, t, i) : ((o, r, n) => {
    const s = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, o), s ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function A(e) {
  return ti({ ...e, state: !0, attribute: !1 });
}
const ee = {
  type: "custom:nexus-energy-card",
  title: "Nexus Energy",
  mode: "power",
  range: "today",
  show_time_selector: !0,
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
}, F = {
  title: "Nexus Energy",
  mode: "power",
  range: "today",
  show_time_selector: !0,
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
}, ii = /* @__PURE__ */ new Set(["w", "kw"]), oi = /* @__PURE__ */ new Set(["wh", "kwh"]);
function ri(e, t, i) {
  const o = t && e ? e.states[t] : void 0, r = Number.parseFloat(String((o == null ? void 0 : o.state) ?? "0").replace(",", ".")), s = String((o == null ? void 0 : o.attributes.unit_of_measurement) ?? (i === "power" ? "kW" : "kWh")).toLowerCase(), l = Number.isFinite(r) ? r : 0;
  return i === "power" && ii.has(s) ? {
    value: s === "w" ? Math.abs(l) / 1e3 : Math.abs(l),
    rawValue: s === "w" ? l / 1e3 : l,
    unit: "kW",
    state: o
  } : i === "energy" && oi.has(s) ? {
    value: s === "wh" ? Math.abs(l) / 1e3 : Math.abs(l),
    rawValue: s === "wh" ? l / 1e3 : l,
    unit: "kWh",
    state: o
  } : {
    value: Math.abs(l),
    rawValue: l,
    unit: i === "power" ? "kW" : "kWh",
    state: o
  };
}
function At(e) {
  const [, t = e] = e.split(".");
  return t.split("_").filter(Boolean).map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join(" ");
}
function se(e, t, i = 2) {
  return t === "power" ? Math.abs(e) < 1 ? `${Math.round(e * 1e3)} W` : `${e.toFixed(i)} kW` : Math.abs(e) < 1 ? `${Math.round(e * 1e3)} Wh` : `${e.toFixed(i)} kWh`;
}
function Z(e) {
  return Number.isFinite(e) ? `${Math.round(e * 100)}%` : "0%";
}
const Ae = 5e-4, ni = 64;
function si(e) {
  const t = {
    ...F,
    ...e,
    thresholds: {
      ...F.thresholds,
      ...e.thresholds
    }
  };
  return (e.nodes || e.entities) && (t.nodes = e.nodes ?? ai(e.entities ?? [])), e.sources && (t.sources = e.sources), t;
}
function ai(e) {
  return [
    {
      id: "home",
      name: "Casa",
      icon: "mdi:home-outline",
      children: e.map((t) => ({
        id: t.replace(/\W+/g, "-"),
        entity: t,
        name: At(t)
      }))
    }
  ];
}
function it(e, t, i, o = /* @__PURE__ */ new Map()) {
  var w, v;
  const r = si(e), n = {
    warning: ((w = r.thresholds) == null ? void 0 : w.warning) ?? 0.65,
    critical: ((v = r.thresholds) == null ? void 0 : v.critical) ?? 0.85
  }, s = ci(r.overflow_tolerance ?? 5) / 100, l = [], a = (f, y, M, We = "0") => {
    var Fe, Be;
    const xe = i === "energy" ? f.energy_entity ?? f.entity : f.power_entity ?? f.entity, Le = f.id ?? xe ?? `node-${We}`, ne = ri(t, xe, i), be = f.invert_value ? -ne.rawValue : ne.rawValue, Ot = Math.abs(be), Pt = f.children ?? [], u = {
      id: Le,
      name: f.name ?? ((Be = (Fe = ne.state) == null ? void 0 : Fe.attributes.friendly_name) == null ? void 0 : Be.toString()) ?? At(Le),
      entity: xe,
      icon: f.icon ?? di(y),
      role: y,
      value: Ot,
      rawValue: be,
      unit: ne.unit,
      capacity: f.capacity,
      percentOfParent: 0,
      severity: "normal",
      direction: hi(f.direction, be),
      virtual: !1,
      overflow: !1,
      children: [],
      parent: M,
      color: f.color,
      history: []
    };
    u.children = Pt.map(
      ($, V) => {
        var je;
        return a($, (je = $.children) != null && je.length ? "hub" : "load", u, `${We}-${V}`);
      }
    );
    const R = u.children.reduce(($, V) => $ + V.value, 0);
    if (!f.entity && u.children.length > 0 && (u.value = R, u.rawValue = R), u.children.length > 0) {
      const $ = R - u.value, V = Math.max(Ae, u.value * s);
      $ > V ? (u.overflow = !0, u.severity = "overflow", l.push(u), typeof console < "u" && console.warn(
        `[nexus-energy-card] Overflow detected in ${u.name}: children=${R.toFixed(
          3
        )}${u.unit}, parent=${u.value.toFixed(3)}${u.unit}`
      ), u.children.push(Ne(u, 0))) : $ > Ae ? u.children.push(Ne(u, 0)) : u.value - R > Math.max(Ae, u.value * 5e-3) && u.children.push(Ne(u, u.value - R));
    }
    u.severity = u.overflow ? "overflow" : ot(u, n.warning, n.critical), u.history = pi(o, u);
    for (const $ of u.children)
      $.percentOfParent = u.value > 0 ? $.value / u.value : 0, $.severity = $.overflow ? "overflow" : ot($, n.warning, n.critical);
    return u;
  }, c = (r.nodes ?? []).map((f, y) => a(f, "hub", void 0, `root-${y}`)), d = c[0], h = (r.sources ?? []).map((f, y) => {
    const M = a(f, "source", d, `source-${y}`);
    return M.percentOfParent = d && d.value > 0 ? M.value / d.value : 0, M;
  }), p = [...h, ...li(c)], g = (d == null ? void 0 : d.value) ?? c.reduce((f, y) => f + y.value, 0), x = h.reduce((f, y) => f + y.value, 0), S = p.map((f) => `${f.id}:${f.rawValue.toFixed(4)}:${f.children.length}`).join("|");
  return {
    sources: h,
    roots: c,
    primaryRoot: d,
    allNodes: p,
    overflowNodes: l,
    total: g,
    sourceTotal: x,
    signature: S
  };
}
function li(e) {
  const t = [], i = (o) => {
    t.push(o), o.children.forEach(i);
  };
  return e.forEach(i), t;
}
function ci(e) {
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
    history: Te(`${e.id}__rest`, Math.max(0, t))
  };
}
function di(e) {
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
function hi(e, t) {
  return e === "export" ? "reverse" : e === "import" ? "forward" : t < 0 ? "reverse" : "forward";
}
function ot(e, t, i) {
  if (!e.capacity || e.capacity <= 0)
    return e.percentOfParent >= i ? "critical" : e.percentOfParent >= t ? "warning" : "normal";
  const o = e.value / e.capacity;
  return o >= i ? "critical" : o >= t ? "warning" : "normal";
}
function pi(e, t) {
  if (!t.entity)
    return Te(t.id, t.value);
  const i = e.get(t.entity) ?? Te(t.entity, t.value).slice(0, 18), o = i.at(-1);
  for ((o === void 0 || Math.abs(o - t.value) > Math.max(1e-3, t.value * 5e-3)) && i.push(t.value); i.length > ni; )
    i.shift();
  return e.set(t.entity, i), [...i];
}
function Te(e, t) {
  let i = 0;
  for (let o = 0; o < e.length; o += 1)
    i = i * 31 + e.charCodeAt(o) >>> 0;
  return Array.from({ length: 32 }, (o, r) => {
    const n = Math.sin(r / 3 + i % 17) * 0.16, s = Math.cos(r / 7 + i % 11) * 0.08;
    return Math.max(0, t * (0.9 + n + s));
  });
}
function ui(e) {
  var t = 0, i = e.children, o = i && i.length;
  if (!o) t = 1;
  else for (; --o >= 0; ) t += i[o].value;
  e.value = t;
}
function fi() {
  return this.eachAfter(ui);
}
function gi(e, t) {
  let i = -1;
  for (const o of this)
    e.call(t, o, ++i, this);
  return this;
}
function mi(e, t) {
  for (var i = this, o = [i], r, n, s = -1; i = o.pop(); )
    if (e.call(t, i, ++s, this), r = i.children)
      for (n = r.length - 1; n >= 0; --n)
        o.push(r[n]);
  return this;
}
function _i(e, t) {
  for (var i = this, o = [i], r = [], n, s, l, a = -1; i = o.pop(); )
    if (r.push(i), n = i.children)
      for (s = 0, l = n.length; s < l; ++s)
        o.push(n[s]);
  for (; i = r.pop(); )
    e.call(t, i, ++a, this);
  return this;
}
function yi(e, t) {
  let i = -1;
  for (const o of this)
    if (e.call(t, o, ++i, this))
      return o;
}
function xi(e) {
  return this.eachAfter(function(t) {
    for (var i = +e(t.data) || 0, o = t.children, r = o && o.length; --r >= 0; ) i += o[r].value;
    t.value = i;
  });
}
function bi(e) {
  return this.eachBefore(function(t) {
    t.children && t.children.sort(e);
  });
}
function vi(e) {
  for (var t = this, i = $i(t, e), o = [t]; t !== i; )
    t = t.parent, o.push(t);
  for (var r = o.length; e !== i; )
    o.splice(r, 0, e), e = e.parent;
  return o;
}
function $i(e, t) {
  if (e === t) return e;
  var i = e.ancestors(), o = t.ancestors(), r = null;
  for (e = i.pop(), t = o.pop(); e === t; )
    r = e, e = i.pop(), t = o.pop();
  return r;
}
function wi() {
  for (var e = this, t = [e]; e = e.parent; )
    t.push(e);
  return t;
}
function Ci() {
  return Array.from(this);
}
function Ai() {
  var e = [];
  return this.eachBefore(function(t) {
    t.children || e.push(t);
  }), e;
}
function Ni() {
  var e = this, t = [];
  return e.each(function(i) {
    i !== e && t.push({ source: i.parent, target: i });
  }), t;
}
function* Ei() {
  var e = this, t, i = [e], o, r, n;
  do
    for (t = i.reverse(), i = []; e = t.pop(); )
      if (yield e, o = e.children)
        for (r = 0, n = o.length; r < n; ++r)
          i.push(o[r]);
  while (i.length);
}
function Re(e, t) {
  e instanceof Map ? (e = [void 0, e], t === void 0 && (t = Ti)) : t === void 0 && (t = Mi);
  for (var i = new ue(e), o, r = [i], n, s, l, a; o = r.pop(); )
    if ((s = t(o.data)) && (a = (s = Array.from(s)).length))
      for (o.children = s, l = a - 1; l >= 0; --l)
        r.push(n = s[l] = new ue(s[l])), n.parent = o, n.depth = o.depth + 1;
  return i.eachBefore(Ii);
}
function Si() {
  return Re(this).eachBefore(ki);
}
function Mi(e) {
  return e.children;
}
function Ti(e) {
  return Array.isArray(e) ? e[1] : null;
}
function ki(e) {
  e.data.value !== void 0 && (e.value = e.data.value), e.data = e.data.data;
}
function Ii(e) {
  var t = 0;
  do
    e.height = t;
  while ((e = e.parent) && e.height < ++t);
}
function ue(e) {
  this.data = e, this.depth = this.height = 0, this.parent = null;
}
ue.prototype = Re.prototype = {
  constructor: ue,
  count: fi,
  each: gi,
  eachAfter: _i,
  eachBefore: mi,
  find: yi,
  sum: xi,
  sort: bi,
  path: vi,
  ancestors: wi,
  descendants: Ci,
  leaves: Ai,
  links: Ni,
  copy: Si,
  [Symbol.iterator]: Ei
};
const fe = 304, Oi = 72, Pi = 218, Hi = 232, ke = 270, zi = 410, ce = 52, De = 16, Nt = 32, Ri = De, Ie = 16, Di = 0, U = 8, rt = 40, ge = 140, nt = 64, Ui = 68, Wi = 300, Li = 300;
function Fi(e, t) {
  const i = Math.max(280, t.width), o = Math.max(520, t.height), r = Gi(e.sources, i, o, t.orientation, t.hideZeroNodes ?? !1), n = e.primaryRoot;
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
    const c = Vi(n, i, r, t), d = c.find((p) => p.id === n.id), h = st(r, c, d, t.orientation);
    return {
      orientation: t.orientation,
      width: i,
      height: Math.max(o, Math.max(...c.map((p) => p.y + p.height + 32), 0)),
      nodes: [...r, ...c],
      sources: r,
      primaryRoot: d,
      edges: h
    };
  }
  const s = qi(n, i, o, r, t), l = s.find((c) => c.id === n.id), a = st(r, s, l, t.orientation);
  return {
    orientation: t.orientation,
    width: i,
    height: Math.max(o, Math.max(...s.map((c) => c.y + c.height + 32), 0)),
    nodes: [...r, ...s],
    sources: r,
    primaryRoot: l,
    edges: a
  };
}
function Bi(e, t) {
  const i = lt(e.from, t, "out", e.fromSlot, e.fromSlotCount), o = lt(e.to, t, "in", e.toSlot, e.toSlotCount);
  if (t === "horizontal") {
    const n = (o.x - i.x) / 2;
    return `M ${i.x} ${i.y} C ${i.x + n} ${i.y}, ${o.x - n} ${o.y}, ${o.x} ${o.y}`;
  }
  const r = Math.abs(o.y - i.y) * 0.45;
  return `M ${i.x} ${i.y} C ${i.x} ${i.y + r}, ${o.x} ${o.y - r}, ${o.x} ${o.y}`;
}
function me(e) {
  return {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  };
}
function Et(e, t, i, o) {
  if (e.children.length === 0 || i.has(e.id))
    return !1;
  const r = ji(e);
  return t.has(e.id) ? !0 : r < o;
}
function ji(e) {
  let t = 0, i = e.parent;
  for (; i; )
    t += 1, i = i.parent;
  return t;
}
function Gi(e, t, i, o, r) {
  const n = r ? e.filter((h) => h.value > 1e-3) : e;
  if (o === "horizontal") {
    const h = Math.min(Hi, Math.max(Pi, t * 0.16)), p = 112, g = Ri, x = n.length * p + Math.max(0, n.length - 1) * g, S = Math.max(116, (i - x) / 2);
    return n.map((w, v) => ({
      ...w,
      x: 32,
      y: S + v * (p + g),
      width: h,
      height: p,
      depth: 0,
      visibleChildren: []
    }));
  }
  const s = 10, l = Math.max(ge, t - Ie * 2), a = l >= ge * 2 + s ? Math.min(2, Math.max(1, n.length)) : 1, c = Math.floor((l - s * (a - 1)) / a), d = Ui;
  return n.map((h, p) => ({
    ...h,
    x: a === 1 ? (t - c) / 2 : Ie + p % a * (c + s),
    y: 20 + Math.floor(p / a) * (d + s),
    width: c,
    height: d,
    depth: 0,
    visibleChildren: []
  }));
}
function Vi(e, t, i, o) {
  const r = [];
  let s = (i.length ? Math.max(...i.map((d) => d.y + d.height)) : 20) + rt;
  const l = Math.min(Wi, t - Ie * 2), a = Li, c = {
    ...e,
    x: (t - l) / 2,
    y: s,
    width: l,
    height: a,
    depth: 0,
    visibleChildren: []
  };
  return r.push(c), s += a + rt, St(e, c, s, 1, t, o, r), r;
}
function St(e, t, i, o, r, n, s) {
  const l = Ue(e, n);
  if (l.length === 0)
    return i;
  const a = Math.min(20, Math.max(0, o - 1) * 8), c = Math.max(ge, r - Di * 2 - a * 2), d = c >= ge * 2 + U ? 2 : 1, h = Math.floor((c - U * (d - 1)) / d), p = (r - (h * d + U * (d - 1))) / 2;
  let g = i;
  for (let x = 0; x < l.length; x += d) {
    const w = l.slice(x, x + d).map((v, f) => {
      const y = {
        ...v,
        x: p + f * (h + U),
        y: g,
        width: h,
        height: nt,
        depth: o,
        visibleChildren: []
      };
      return s.push(y), t.visibleChildren.push(y), { source: v, node: y };
    });
    g += nt + U;
    for (const v of w)
      Et(v.source, n.expandedIds, n.collapsedIds, n.defaultExpandedDepth) && (g = St(v.source, v.node, g + U, o + 1, r, n, s));
  }
  return g;
}
function qi(e, t, i, o, r) {
  const n = Re(e, (y) => Ue(y, r)), s = Math.max(1, n.height), l = Math.min(56, Math.max(32, t * 0.025)), a = t - l - fe, c = /* @__PURE__ */ new Map();
  for (let y = 1; y <= s; y += 1)
    c.set(y, a - (s - y) * (fe + ce));
  const d = c.get(1) ?? a, h = o.reduce((y, M) => Math.max(y, M.x + M.width), 0), p = (h + d - ke) / 2, g = h + ce, x = d - ke - ce, S = Zi(p, g, x), w = Mt(e, 0, r), v = Math.max(28, (i - w.subtreeHeight) / 2), f = [];
  return Tt(w, v, S, c, f), f;
}
function Mt(e, t, i) {
  const o = Ue(e, i).map((a) => Mt(a, t + 1, i)), r = t === 0 ? ke : fe, n = t === 0 ? zi : Oi, s = t === 0 ? Nt : De, l = o.length > 0 ? o.reduce((a, c) => a + c.subtreeHeight, 0) + Math.max(0, o.length - 1) * s : 0;
  return {
    node: e,
    children: o,
    depth: t,
    width: r,
    height: n,
    subtreeHeight: Math.max(n, l),
    y: 0
  };
}
function Tt(e, t, i, o, r) {
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
    const a = e.depth === 0 ? Nt : De, c = e.children.reduce((h, p) => h + p.subtreeHeight, 0) + Math.max(0, e.children.length - 1) * a;
    let d = t + (e.subtreeHeight - c) / 2;
    for (const h of e.children) {
      const p = Tt(h, d, i, o, r);
      s.visibleChildren.push(p), d += h.subtreeHeight + a;
    }
  }
  const l = s.visibleChildren.length > 0 ? (me(s.visibleChildren[0]).y + me(s.visibleChildren[s.visibleChildren.length - 1]).y) / 2 : t + e.subtreeHeight / 2;
  return s.y = l - e.height / 2, s;
}
function Ue(e, t) {
  return Et(e, t.expandedIds, t.collapsedIds, t.defaultExpandedDepth) ? t.hideZeroNodes ? e.children.filter((i) => i.value > 1e-3 || i.children.length > 0) : e.children : [];
}
function Zi(e, t, i) {
  return t > i ? (t + i) / 2 : Math.min(i, Math.max(t, e));
}
function st(e, t, i, o) {
  const r = [];
  if (i) {
    const n = at(e, o);
    for (const [s, l] of n.entries())
      r.push({
        id: `${l.id}->${i.id}`,
        from: l,
        to: i,
        fromSlot: 0,
        fromSlotCount: 1,
        toSlot: s,
        toSlotCount: n.length,
        value: l.value,
        percent: l.percentOfParent,
        severity: l.severity,
        direction: l.direction
      });
  }
  for (const n of t) {
    const s = at(n.visibleChildren, o);
    for (const [l, a] of s.entries())
      r.push({
        id: `${n.id}->${a.id}`,
        from: n,
        to: a,
        fromSlot: l,
        fromSlotCount: n.visibleChildren.length,
        toSlot: 0,
        toSlotCount: 1,
        value: a.value,
        percent: a.percentOfParent,
        severity: a.severity,
        direction: a.direction
      });
  }
  return r;
}
function at(e, t) {
  return [...e].sort((i, o) => {
    const r = me(i), n = me(o);
    return t === "horizontal" ? r.y - n.y || r.x - n.x : r.x - n.x || r.y - n.y;
  });
}
function lt(e, t, i, o = 0, r = 1) {
  const n = r <= 1 ? 0.5 : (o + 1) / (r + 1);
  return t === "horizontal" ? {
    x: i === "out" ? e.x + e.width : e.x,
    y: e.y + e.height * n
  } : {
    x: e.x + e.width * n,
    y: i === "out" ? e.y + e.height : e.y
  };
}
const Ee = 2, Yi = 10, ae = 0.05, ct = 3, Ki = 18;
function Xi(e, t, i, o, r = Ee) {
  const n = Se(r, 1, 8), s = n + (Yi - Ee), l = Math.max(2, n + (ct - Ee)), a = l + (Ki - ct);
  if (i === "energy") {
    const d = Se(o, 0, 1);
    return dt(l + d * (a - l));
  }
  if (e <= ae || t <= ae)
    return n;
  const c = Math.log1p(Math.max(0, e - ae)) / Math.log1p(Math.max(1e-3, t - ae));
  return dt(n + Se(c, 0, 1) * (s - n));
}
function Se(e, t, i) {
  return Math.min(i, Math.max(t, e));
}
function dt(e) {
  return Math.round(e * 100) / 100;
}
var Ji = Object.defineProperty, Qi = Object.getOwnPropertyDescriptor, E = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Qi(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (o ? s(t, i, r) : s(r)) || r);
  return o && r && Ji(t, i, r), r;
};
const ht = 1, eo = 250, pt = 6e4, Y = 252, K = 210, to = 600, io = 100, oo = 720, ro = 520;
let C = class extends B {
  constructor() {
    super(...arguments), this._config = F, this._graph = it(F, void 0, "power"), this._mode = "power", this._width = 1180, this._breakpoint = "wide", this._expandedIds = /* @__PURE__ */ new Set(), this._collapsedIds = /* @__PURE__ */ new Set(), this._historyCache = /* @__PURE__ */ new Map(), this._tooltipHistoryCache = /* @__PURE__ */ new Map(), this._lastValues = /* @__PURE__ */ new Map(), this._pendingWidth = 1180, this._tooltipRequestId = 0, this._clearTooltip = () => {
      window.clearTimeout(this._tooltipTimer), this._tooltipRequestId += 1, this._tooltip = void 0;
    };
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => bo), document.createElement("nexus-energy-card-editor");
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
    const t = { ...e };
    delete t.height, this._config = {
      ...F,
      ...t,
      thresholds: {
        ...F.thresholds,
        ...t.thresholds
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
    (e = this._resizeObserver) == null || e.disconnect(), window.clearTimeout(this._tooltipTimer), window.clearTimeout(this._resizeTimer), super.disconnectedCallback();
  }
  firstUpdated() {
    const t = this.renderRoot.querySelector(".nexus-card-frame") ?? this;
    "ResizeObserver" in window && (this._resizeObserver = new ResizeObserver(([i]) => {
      this._scheduleResize(i.contentRect.width);
    }), this._resizeObserver.observe(t)), this._scheduleResize(this._measuredContentWidth(t) || this._width, 0);
  }
  _measuredContentWidth(e) {
    const t = e.getBoundingClientRect();
    if (!(e instanceof HTMLElement))
      return t.width;
    const i = getComputedStyle(e), o = Number.parseFloat(i.paddingLeft || "0") + Number.parseFloat(i.paddingRight || "0") + Number.parseFloat(i.borderLeftWidth || "0") + Number.parseFloat(i.borderRightWidth || "0");
    return Math.max(0, t.width - o);
  }
  _scheduleResize(e, t = io) {
    !Number.isFinite(e) || e <= 0 || (this._pendingWidth = Math.max(280, Math.round(e)), window.clearTimeout(this._resizeTimer), this._resizeTimer = window.setTimeout(() => {
      const i = this._pendingWidth, o = i <= to ? "compact" : "wide";
      this._width !== i && (this._width = i), this._breakpoint !== o && (this._breakpoint = o);
    }, t));
  }
  render() {
    const e = this._breakpoint === "compact" ? "vertical" : "horizontal", t = e === "vertical" ? ro : oo, i = Fi(this._graph, {
      width: this._width,
      height: t,
      orientation: e,
      expandedIds: this._expandedIds,
      collapsedIds: this._collapsedIds,
      defaultExpandedDepth: this._config.default_expanded_depth ?? 2,
      hideZeroNodes: this._config.hide_zero_nodes ?? !1
    }), o = i.primaryRoot, r = this._graph.sources.filter((l) => this._isSolarSource(l)), n = r.length > 0, s = n && this._graph.total > 0 ? Math.min(1, r.reduce((l, a) => l + a.value, 0) / this._graph.total) : 0;
    return m`
      <ha-card class=${`nexus-shell bg-${this._config.background_style ?? "glass"}`}>
        <section class=${`nexus-card-frame ${this._breakpoint}`} data-breakpoint=${this._breakpoint} @pointerleave=${this._clearTooltip}>
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

          <section class=${`graph-stage ${e} ${this._breakpoint}`} style=${`height:${i.height}px`} @click=${this._clearTooltip}>
            ${this._renderSvg(i)}
            <div class="node-layer">
              ${i.nodes.map((l) => this._renderNode(l, o, s, n))}
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
      const o = Bi(i, e.orientation), r = this._edgeWidth(i, t);
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
    const r = (t == null ? void 0 : t.id) === e.id, n = e.children.length > 0, s = this._collapsedIds.has(e.id), l = [
      "flow-node",
      `role-${e.role}`,
      e.severity,
      r ? "is-root" : "",
      n ? "is-container" : "",
      s ? "is-collapsed" : ""
    ].filter(Boolean).join(" ");
    return m`
      <article
        class=${l}
        style=${`left:${e.x}px;top:${e.y}px;width:${e.width}px;height:${e.height}px;--node-accent:${this._nodeAccent(e)};`}
        data-node-id=${e.id}
        tabindex="0"
        @mouseenter=${() => this._queueTooltip(e)}
        @mouseleave=${() => this._hideTooltipFromNode(e)}
        @focusin=${() => this._queueTooltip(e, 0)}
        @focusout=${() => this._hideTooltipFromNode(e)}
        @click=${(a) => this._handleNodeClick(a, e)}
      >
        ${r ? this._renderRootNode(e, i, o) : this._renderCompactNode(e)}
      </article>
    `;
  }
  _renderRootNode(e, t, i) {
    return m`
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
    return m`
      <div class="node-main">
        <span class="node-icon"><ha-icon icon=${e.icon}></ha-icon></span>
        <div class="node-copy">
          <strong>${e.name}</strong>
          <span>${se(e.value, this._mode, this._config.precision)}</span>
        </div>
            ${e.children.length ? m`
              <button class="collapse-button" type="button" title="Expandir o colapsar" @click=${(i) => this._toggleNode(i, e)}>
                <ha-icon icon=${this._collapsedIds.has(e.id) ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
              </button>
            ` : m`<span class="node-percent">${Z(e.percentOfParent)}</span>`}
      </div>
      ${e.role === "source" ? m`
            <div class="source-meta">
              <strong>${Z(e.capacity ? e.value / e.capacity : e.percentOfParent)}</strong>
              <span>${t}</span>
            </div>
            ${this._renderSparkline(e, 172, 34)}
          ` : _}
      ${e.role !== "source" && e.children.length ? m`<div class="container-share">${Z(e.percentOfParent)} del total</div>` : _}
    `;
  }
  _renderTooltip() {
    const e = this._tooltip;
    return e ? m`
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
    const o = no(e.history, t, i);
    return D`
      <svg class="sparkline" viewBox=${`0 0 ${t} ${i}`} aria-hidden="true">
        <path class="sparkline-area" d=${`${o} L ${t} ${i} L 0 ${i} Z`}></path>
        <path class="sparkline-line" d=${o}></path>
      </svg>
    `;
  }
  _renderTooltipSparkline(e, t, i) {
    const o = so(e.history, t, i);
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
  _queueTooltip(e, t = eo) {
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
      expiresAt: o + pt,
      points: (i == null ? void 0 : i.points) ?? [],
      pending: r
    });
    const n = await r;
    return this._tooltipHistoryCache.set(t, {
      expiresAt: Date.now() + pt,
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
        }), s = ut(n, e);
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
      }), s = `history/period/${encodeURIComponent(i.toISOString())}?${n.toString()}`, l = await this._hass.callApi("GET", s);
      return ut(l, e);
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
    return Number.isFinite(i) ? `${ho(Math.abs(i))} ${o}`.trim() : se(e.value, this._mode, this._config.precision);
  }
  _tooltipPosition(e) {
    const t = this.renderRoot.querySelector(".graph-stage"), i = [...this.renderRoot.querySelectorAll(".flow-node")].find((c) => c.dataset.nodeId === e.id);
    if (!t || !i)
      return {
        x: Math.max(12, e.x + e.width + 14),
        y: Math.max(12, e.y + e.height / 2 - K / 2)
      };
    const o = t.getBoundingClientRect(), r = i.getBoundingClientRect(), n = 14, s = 12;
    let l = r.right - o.left + n, a = r.top - o.top + r.height / 2 - K / 2;
    return l + Y > o.width - s && (l = r.left - o.left - Y - n), l < s && (l = r.left - o.left + r.width / 2 - Y / 2, a = r.bottom - o.top + n, a + K > o.height - s && (a = r.top - o.top - K - n)), {
      x: Me(l, s, Math.max(s, o.width - Y - s)),
      y: Me(a, s, Math.max(s, o.height - K - s))
    };
  }
  _tooltipHistoryLabel(e) {
    return e.historySource === "home-assistant" ? "Historial inmediato desde Home Assistant" : "Historial local hasta recibir datos de HA";
  }
  _rebuildGraph(e) {
    const t = it(this._config, this._hass, this._mode, this._historyCache);
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
          version: ht,
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
      if (t.version !== ht)
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
    return Xi(e.value, t, this._mode, e.percent, this._config.line_width_base ?? 2);
  }
  _particleDuration(e) {
    const t = Me(this._config.animation_speed ?? 1, 0.4, 3);
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
C.styles = yt`
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
      --nexus-title-size: 28px;
      --nexus-primary-metric-size: 48px;
      --nexus-source-padding: 18px;
      --nexus-node-main-padding: 0 18px;
      --nexus-node-main-gap: 12px;
      --nexus-node-icon-size: 34px;
      --nexus-node-title-size: 15px;
      --nexus-node-value-size: 14px;
      --nexus-root-padding: 26px 26px 20px;
      --nexus-root-icon-size: 48px;
      --nexus-root-value-size: 36px;
      --nexus-gauge-width: 136px;
      --nexus-gauge-height: 82px;
      padding: 24px 30px 18px;
      border-radius: inherit;
      background:
        linear-gradient(90deg, rgba(64, 165, 255, 0.1), transparent 32%, rgba(73, 240, 191, 0.07)),
        rgba(4, 11, 19, 0.38);
      backdrop-filter: blur(12px);
      overflow: hidden;
    }

    .nexus-card-frame.compact {
      --nexus-title-size: 20px;
      --nexus-primary-metric-size: 34px;
      --nexus-source-padding: 10px;
      --nexus-node-main-padding: 0 10px;
      --nexus-node-main-gap: 8px;
      --nexus-node-icon-size: 30px;
      --nexus-node-title-size: 13px;
      --nexus-node-value-size: 12px;
      --nexus-root-padding: 16px;
      --nexus-root-icon-size: 40px;
      --nexus-root-value-size: 28px;
      --nexus-gauge-width: 108px;
      --nexus-gauge-height: 68px;
      padding: 14px 12px 12px;
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
      font-size: var(--nexus-title-size);
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
      font-size: var(--nexus-primary-metric-size);
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
      padding: var(--nexus-source-padding);
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
      gap: var(--nexus-node-main-gap);
      height: 100%;
      padding: var(--nexus-node-main-padding);
    }

    .node-icon {
      display: grid;
      width: var(--nexus-node-icon-size);
      height: var(--nexus-node-icon-size);
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
      font-size: var(--nexus-node-title-size);
      font-weight: 710;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-copy span {
      overflow: hidden;
      color: #f7fbff;
      font-size: var(--nexus-node-value-size);
      font-weight: 650;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-percent,
    .container-share {
      color: var(--node-accent, var(--nexus-green));
      font-size: var(--nexus-node-value-size);
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
      padding: var(--nexus-root-padding);
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
      width: var(--nexus-root-icon-size);
      height: var(--nexus-root-icon-size);
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
      font-size: var(--nexus-root-value-size);
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
      width: var(--nexus-gauge-width);
      height: var(--nexus-gauge-height);
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

    .nexus-card-frame.compact .topbar,
    .nexus-card-frame.compact .summary-strip {
      align-items: stretch;
      flex-direction: column;
    }

    .nexus-card-frame.compact .topbar {
      gap: 12px;
      margin-bottom: 14px;
    }

    .nexus-card-frame.compact .brand {
      gap: 10px;
    }

    .nexus-card-frame.compact .brand p {
      margin-top: 8px;
      font-size: 11px;
    }

    .nexus-card-frame.compact .health-pill {
      align-self: flex-start;
      min-height: 38px;
    }

    .nexus-card-frame.compact .graph-stage {
      min-height: 520px;
      margin-top: 10px;
    }

    .nexus-card-frame.compact .node-main {
      grid-template-columns: var(--nexus-node-icon-size) minmax(0, 1fr) auto;
    }

    .nexus-card-frame.compact .flow-node.role-source .source-meta,
    .nexus-card-frame.compact .flow-node.role-source .sparkline {
      display: none;
    }

    .nexus-card-frame.compact .root-title {
      font-size: 16px;
    }

    .nexus-card-frame.compact .root-subtitle {
      font-size: 12px;
    }

    .nexus-card-frame.compact .gauge {
      margin: 14px auto 10px;
    }

    .nexus-card-frame.compact .gauge span {
      font-size: 23px;
    }

    .nexus-card-frame.compact .gauge small {
      font-size: 10px;
    }

    .nexus-card-frame.compact .root-stats {
      gap: 6px;
      padding-top: 10px;
    }

    .nexus-card-frame.compact .root-stats div {
      font-size: 12px;
    }
  `;
E([
  A()
], C.prototype, "_config", 2);
E([
  A()
], C.prototype, "_graph", 2);
E([
  A()
], C.prototype, "_mode", 2);
E([
  A()
], C.prototype, "_width", 2);
E([
  A()
], C.prototype, "_breakpoint", 2);
E([
  A()
], C.prototype, "_tooltip", 2);
E([
  A()
], C.prototype, "_expandedIds", 2);
E([
  A()
], C.prototype, "_collapsedIds", 2);
C = E([
  Ct("nexus-energy-card")
], C);
function no(e, t, i) {
  if (e.length === 0)
    return `M 0 ${i / 2} L ${t} ${i / 2}`;
  const o = Math.min(...e), r = Math.max(...e), n = Math.max(1e-3, r - o);
  return e.map((l, a) => {
    const c = e.length === 1 ? t : a / (e.length - 1) * t, d = i - (l - o) / n * (i - 8) - 4;
    return `${a === 0 ? "M" : "L"} ${c.toFixed(2)} ${d.toFixed(2)}`;
  }).join(" ");
}
function so(e, t, i) {
  var h, p;
  if (e.length === 0)
    return `M 0 ${i / 2} L ${t} ${i / 2}`;
  const o = [...e].sort((g, x) => g.time - x.time), r = o.map((g) => g.value), n = Math.min(...r), s = Math.max(...r), l = Math.max(1e-3, s - n), a = ((h = o[0]) == null ? void 0 : h.time) ?? 0, c = ((p = o.at(-1)) == null ? void 0 : p.time) ?? a, d = Math.max(1, c - a);
  return o.map((g, x) => {
    const S = (g.time - a) / d * t, w = i - (g.value - n) / l * (i - 8) - 4;
    return `${x === 0 ? "M" : "L"} ${S.toFixed(2)} ${w.toFixed(2)}`;
  }).join(" ");
}
function ut(e, t) {
  const i = ao(e), o = i.find(
    (r) => r.some((n) => n.entity_id === t)
  ) ?? i[0] ?? [];
  return o.map((r, n) => lo(r, n, o.length)).filter((r) => !!r).sort((r, n) => r.time - n.time);
}
function ao(e) {
  return Array.isArray(e) ? e.every(Array.isArray) ? e : [e] : [];
}
function lo(e, t, i) {
  if (!e || typeof e != "object")
    return;
  const o = e, r = o.state ?? o.s, n = Number.parseFloat(String(r ?? "").replace(",", "."));
  return Number.isFinite(n) ? { time: co(o.last_changed ?? o.last_updated ?? o.lc ?? o.lu) ?? Date.now() - Math.max(0, i - t - 1) * 6e4, value: Math.abs(n) } : void 0;
}
function co(e) {
  if (typeof e == "string") {
    const t = Date.parse(e);
    return Number.isFinite(t) ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return e > 1e12 ? e : e * 1e3;
}
function ho(e) {
  return e >= 100 || Number.isInteger(e) ? Math.round(e).toString() : e >= 10 ? ft(e.toFixed(1)) : ft(e.toFixed(2));
}
function ft(e) {
  return e.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
function Me(e, t, i) {
  return Math.min(i, Math.max(t, e));
}
var po = Object.defineProperty, uo = Object.getOwnPropertyDescriptor, ye = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? uo(t, i) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (r = (o ? s(t, i, r) : s(r)) || r);
  return o && r && po(t, i, r), r;
};
const N = "__source__", X = "__all__", de = {
  id: "home",
  name: "Casa",
  icon: "mdi:home-outline",
  children: []
}, fo = [
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
let z = class extends B {
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
    const t = this._expandedNodeId, i = _o(e), o = {
      ...ee,
      ...i,
      thresholds: {
        ...ee.thresholds,
        ...i.thresholds
      },
      sources: i.sources ?? [],
      nodes: i.nodes ?? []
    }, r = go(o);
    this._config = o, this._flatNodes = r, this._expandedNodeId = t && r.some((n) => n.id === t) ? t : void 0;
  }
  set hass(e) {
    this._hass = e, this.requestUpdate();
  }
  render() {
    const e = this._filteredEntities(), t = this._mainNode();
    return m`
      <div class="editor">
        <header class="editor-head">
          <span class="head-icon"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon></span>
          <div>
            <h3>Nexus Energy Card</h3>
            <p>Configuracion visual</p>
          </div>
        </header>

        <datalist id="nexus-entities">
          ${e.map((i) => m`<option value=${i.entity_id}>${i.label}</option>`)}
        </datalist>
        <datalist id="nexus-icons">
          ${fo.map((i) => m`<option value=${i}></option>`)}
        </datalist>

        ${this._renderGeneral(t, e)}
        ${this._renderBuilder(t, e)}
        ${this._renderAppearance()}
        ${this._renderThresholds(t)}
      </div>
    `;
  }
  _renderGeneral(e, t) {
    return m`
      <section class="panel">
        <div class="panel-head">
          <h4>Configuracion general</h4>
        </div>
        <div class="grid general-grid">
          <label>
            Titulo de la tarjeta
            <input .value=${this._config.title ?? ""} @input=${(i) => this._patchConfig("title", W(b(i)))} />
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
              @input=${(i) => this._patchConfig("overflow_tolerance", xo(Number(b(i))))}
            />
          </label>
          <label>
            Nombre del nodo principal
            <input
              .value=${e.name ?? "Casa"}
              @input=${(i) => this._patchMain({ name: W(b(i)) || "Casa" })}
            />
          </label>
          <label>
            Icono del nodo principal
            <input
              list="nexus-icons"
              .value=${e.icon ?? "mdi:home-outline"}
              @input=${(i) => this._patchMain({ icon: W(b(i)) || "mdi:home-outline" })}
            />
          </label>
        </div>
      </section>
    `;
  }
  _renderBuilder(e, t) {
    const i = this._flatNodes.length > 0;
    return m`
      <section class="panel">
        <div class="panel-head">
          <h4>Constructor del arbol</h4>
          ${i ? m`
                <div class="head-actions">
                  <button type="button" @click=${() => this._addNode(N)}>Fuente</button>
                  <button type="button" @click=${() => this._addNode(this._mainId())}>Nodo</button>
                </div>
              ` : _}
        </div>
        ${i ? m`<div class="node-list">${this._flatNodes.map((o) => this._renderNodeRow(o, e, t))}</div>` : m`
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
    const o = e.parentId === N, r = o ? 0 : this._depthOf(e), n = o ? "Raiz/Fuente" : e.parentId === this._mainId() ? t.name ?? "Casa" : this._nodeName(e.parentId), s = e.entity ?? e.power_entity ?? e.energy_entity ?? "Sin entidad", l = this._expandedNodeId === e.id;
    return m`
      <article class=${`node-row ${o ? "is-source" : ""}`} style=${`--depth:${r}`}>
        <div class="row-title">
          <button
            class="row-toggle"
            type="button"
            aria-expanded=${l}
            title=${l ? "Contraer" : "Editar"}
            @click=${() => this._toggleNode(e.id)}
          >
            <span class="row-icon"><ha-icon icon=${e.icon ?? (o ? "mdi:flash" : "mdi:power-plug-outline")}></ha-icon></span>
            <span class="row-summary">
              <strong>${e.name || "Nodo sin nombre"}</strong>
              <small>${s} - ${n}</small>
            </span>
            <ha-icon class="chevron" icon=${l ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
          </button>
          <button class="icon-button danger" type="button" title="Eliminar" @click=${() => this._removeNode(e.id)}>
            <ha-icon icon="mdi:trash-can-outline"></ha-icon>
          </button>
        </div>

        ${l ? m`
              <div class="node-form">
                <div class="grid node-grid">
                  ${this._renderEntityField(
      "Entidad",
      e.entity ?? e.power_entity ?? e.energy_entity ?? "",
      i,
      (a) => this._patchNode(e.id, this._entityPatch(a))
    )}
                  <label>
                    Nombre a mostrar
                    <input .value=${e.name} @input=${(a) => this._patchNode(e.id, { name: W(b(a)) })} />
                  </label>
                  <label>
                    Icono
                    <input
                      list="nexus-icons"
                      .value=${e.icon ?? ""}
                      @input=${(a) => this._patchNode(e.id, { icon: W(b(a)) || void 0 })}
                    />
                  </label>
                  <label>
                    Nodo padre
                    <select .value=${e.parentId} @change=${(a) => this._patchNode(e.id, { parentId: b(a) })}>
                      <option value=${N} ?selected=${e.parentId === N}>Raiz/Fuente</option>
                      <option value=${this._mainId()} ?selected=${e.parentId === this._mainId()}>${t.name ?? "Casa"}</option>
                      ${this._flatNodes.filter((a) => this._canUseAsParent(a, e)).map((a) => m`<option value=${a.id} ?selected=${e.parentId === a.id}>${a.name}</option>`)}
                    </select>
                  </label>
                  <label>
                    Direccion
                    <select
                      .value=${e.direction ?? "auto"}
                      @change=${(a) => this._patchNode(e.id, { direction: b(a) })}
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
                      @input=${(a) => this._patchNode(e.id, { capacity: yo(b(a)) })}
                    />
                  </label>
                  ${this._renderCheck("Invertir valor", e.invert_value === !0, (a) => this._patchNode(e.id, { invert_value: a }))}
                </div>
              </div>
            ` : _}
      </article>
    `;
  }
  _renderAppearance() {
    const e = this._config.animation_speed ?? 1, t = e < 0.85 ? "Lento" : e > 1.25 ? "Rapido" : "Normal";
    return m`
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
        </div>
      </section>
    `;
  }
  _renderThresholds(e) {
    const t = this._config.color_thresholds ?? [], i = [{ id: this._mainId(), name: e.name ?? "Casa" }, ...this._flatNodes.map((o) => ({ id: o.id, name: o.name }))];
    return m`
      <section class="panel">
        <div class="panel-head">
          <h4>Umbrales de color</h4>
          <button type="button" @click=${this._addThreshold}>Anadir umbral</button>
        </div>
        <div class="threshold-list">
          ${t.length ? t.map(
      (o, r) => m`
                  <article class="threshold-row">
                    <label>
                      Nodo
                      <select
                        .value=${o.node_id ?? X}
                        @change=${(n) => this._patchThreshold(r, { node_id: b(n) })}
                      >
                        <option value=${X}>Todos</option>
                        ${i.map((n) => m`<option value=${n.id}>${n.name}</option>`)}
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
    ) : m`<div class="empty-state">Sin umbrales personalizados.</div>`}
        </div>
      </section>
    `;
  }
  _renderEntityField(e, t, i, o) {
    return m`
      <label>
        ${e}
        <input
          list="nexus-entities"
          .value=${t}
          @input=${(r) => o(W(b(r)))}
          placeholder="sensor..."
        />
        ${i.length ? _ : m`<span class="field-note">sensor power</span>`}
      </label>
    `;
  }
  _renderCheck(e, t, i) {
    return m`
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
    const t = e === N, i = mo(this._flatNodes, t ? "fuente" : "nodo");
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
    const e = this._mainNode(), t = e.id ?? "home", i = this._flatNodes.filter((s) => s.parentId === N).map((s) => It(s)), o = kt(this._flatNodes, t), r = o.length || this._hasConfiguredMain(e) ? [
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
z.styles = yt`
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
ye([
  A()
], z.prototype, "_config", 2);
ye([
  A()
], z.prototype, "_flatNodes", 2);
ye([
  A()
], z.prototype, "_expandedNodeId", 2);
z = ye([
  Ct("nexus-energy-card-editor")
], z);
function go(e) {
  var n;
  const t = [], i = (n = e.nodes) == null ? void 0 : n[0], o = (i == null ? void 0 : i.id) ?? de.id ?? "home";
  for (const s of e.sources ?? [])
    t.push(gt(s, N, t.length));
  const r = (s, l) => {
    for (const a of s ?? []) {
      const c = gt(a, l, t.length);
      t.push(c), r(a.children, c.id);
    }
  };
  return r(i == null ? void 0 : i.children, o), t;
}
function gt(e, t, i) {
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
function kt(e, t) {
  return e.filter((i) => i.parentId === t).map((i) => It(i, kt(e, i.id)));
}
function It(e, t = []) {
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
function mo(e, t) {
  let i = e.length + 1, o = `${t}-${i}`;
  for (; e.some((r) => r.id === o); )
    i += 1, o = `${t}-${i}`;
  return o;
}
function W(e) {
  return e.trim();
}
function _o(e) {
  const t = { ...e };
  return delete t.height, t;
}
function yo(e) {
  const t = e.trim();
  if (!t)
    return;
  const i = Number(t);
  return Number.isFinite(i) ? i : void 0;
}
function xo(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : 5;
}
function b(e) {
  return e.target.value;
}
const bo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get NexusEnergyCardEditor() {
    return z;
  }
}, Symbol.toStringTag, { value: "Module" }));
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "nexus-energy-card",
  name: "Nexus Energy Card",
  description: "Advanced hierarchical energy and power flow map with collapsible nodes."
});
//# sourceMappingURL=nexus-energy-card.js.map

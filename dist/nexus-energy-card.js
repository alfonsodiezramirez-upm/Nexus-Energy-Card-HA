/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = globalThis, we = oe.ShadowRoot && (oe.ShadyCSS === void 0 || oe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ce = Symbol(), Pe = /* @__PURE__ */ new WeakMap();
let it = class {
  constructor(e, i, o) {
    if (this._$cssResult$ = !0, o !== Ce) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (we && e === void 0) {
      const o = i !== void 0 && i.length === 1;
      o && (e = Pe.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), o && Pe.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const vt = (t) => new it(typeof t == "string" ? t : t + "", void 0, Ce), ot = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((o, r, s) => o + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[s + 1], t[0]);
  return new it(i, t, Ce);
}, xt = (t, e) => {
  if (we) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const o = document.createElement("style"), r = oe.litNonce;
    r !== void 0 && o.setAttribute("nonce", r), o.textContent = i.cssText, t.appendChild(o);
  }
}, Te = we ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const o of e.cssRules) i += o.cssText;
  return vt(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: $t, defineProperty: wt, getOwnPropertyDescriptor: Ct, getOwnPropertyNames: At, getOwnPropertySymbols: Et, getPrototypeOf: Nt } = Object, O = globalThis, ze = O.trustedTypes, St = ze ? ze.emptyScript : "", ge = O.reactiveElementPolyfillSupport, q = (t, e) => t, ne = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? St : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, Ae = (t, e) => !$t(t, e), Re = { attribute: !0, type: String, converter: ne, reflect: !1, useDefault: !1, hasChanged: Ae };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), O.litPropertyMetadata ?? (O.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let D = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = Re) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const o = Symbol(), r = this.getPropertyDescriptor(e, o, i);
      r !== void 0 && wt(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, o) {
    const { get: r, set: s } = Ct(this.prototype, e) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: r, set(n) {
      const a = r == null ? void 0 : r.call(this);
      s == null || s.call(this, n), this.requestUpdate(e, a, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Re;
  }
  static _$Ei() {
    if (this.hasOwnProperty(q("elementProperties"))) return;
    const e = Nt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(q("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(q("properties"))) {
      const i = this.properties, o = [...At(i), ...Et(i)];
      for (const r of o) this.createProperty(r, i[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [o, r] of i) this.elementProperties.set(o, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, o] of this.elementProperties) {
      const r = this._$Eu(i, o);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const o = new Set(e.flat(1 / 0).reverse());
      for (const r of o) i.unshift(Te(r));
    } else e !== void 0 && i.push(Te(e));
    return i;
  }
  static _$Eu(e, i) {
    const o = i.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((i) => i(this));
  }
  addController(e) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((i = e.hostConnected) == null || i.call(e));
  }
  removeController(e) {
    var i;
    (i = this._$EO) == null || i.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const o of i.keys()) this.hasOwnProperty(o) && (e.set(o, this[o]), delete this[o]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return xt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((i) => {
      var o;
      return (o = i.hostConnected) == null ? void 0 : o.call(i);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var o;
      return (o = i.hostDisconnected) == null ? void 0 : o.call(i);
    });
  }
  attributeChangedCallback(e, i, o) {
    this._$AK(e, o);
  }
  _$ET(e, i) {
    var s;
    const o = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, o);
    if (r !== void 0 && o.reflect === !0) {
      const n = (((s = o.converter) == null ? void 0 : s.toAttribute) !== void 0 ? o.converter : ne).toAttribute(i, o.type);
      this._$Em = e, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var s, n;
    const o = this.constructor, r = o._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const a = o.getPropertyOptions(r), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((s = a.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? a.converter : ne;
      this._$Em = r;
      const d = l.fromAttribute(i, a.type);
      this[r] = d ?? ((n = this._$Ej) == null ? void 0 : n.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, i, o, r = !1, s) {
    var n;
    if (e !== void 0) {
      const a = this.constructor;
      if (r === !1 && (s = this[e]), o ?? (o = a.getPropertyOptions(e)), !((o.hasChanged ?? Ae)(s, i) || o.useDefault && o.reflect && s === ((n = this._$Ej) == null ? void 0 : n.get(e)) && !this.hasAttribute(a._$Eu(e, o)))) return;
      this.C(e, i, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: o, reflect: r, wrapped: s }, n) {
    o && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? i ?? this[e]), s !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || o || (i = void 0), this._$AL.set(e, i)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var o;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [s, n] of this._$Ep) this[s] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [s, n] of r) {
        const { wrapped: a } = n, l = this[s];
        a !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, n, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (o = this._$EO) == null || o.forEach((r) => {
        var s;
        return (s = r.hostUpdate) == null ? void 0 : s.call(r);
      }), this.update(i)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var i;
    (i = this._$EO) == null || i.forEach((o) => {
      var r;
      return (r = o.hostUpdated) == null ? void 0 : r.call(o);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[q("elementProperties")] = /* @__PURE__ */ new Map(), D[q("finalized")] = /* @__PURE__ */ new Map(), ge == null || ge({ ReactiveElement: D }), (O.reactiveElementVersions ?? (O.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, He = (t) => t, se = Z.trustedTypes, Ue = se ? se.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, rt = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, nt = "?" + k, Mt = `<${nt}>`, z = document, Y = () => z.createComment(""), X = (t) => t === null || typeof t != "object" && typeof t != "function", Ee = Array.isArray, kt = (t) => Ee(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", fe = `[ 	
\f\r]`, V = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, De = /-->/g, We = />/g, I = RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), je = /'/g, Le = /"/g, st = /^(?:script|style|textarea|title)$/i, at = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), m = at(1), G = at(2), j = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), Be = /* @__PURE__ */ new WeakMap(), P = z.createTreeWalker(z, 129);
function lt(t, e) {
  if (!Ee(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ue !== void 0 ? Ue.createHTML(e) : e;
}
const Ot = (t, e) => {
  const i = t.length - 1, o = [];
  let r, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = V;
  for (let a = 0; a < i; a++) {
    const l = t[a];
    let d, h, c = -1, f = 0;
    for (; f < l.length && (n.lastIndex = f, h = n.exec(l), h !== null); ) f = n.lastIndex, n === V ? h[1] === "!--" ? n = De : h[1] !== void 0 ? n = We : h[2] !== void 0 ? (st.test(h[2]) && (r = RegExp("</" + h[2], "g")), n = I) : h[3] !== void 0 && (n = I) : n === I ? h[0] === ">" ? (n = r ?? V, c = -1) : h[1] === void 0 ? c = -2 : (c = n.lastIndex - h[2].length, d = h[1], n = h[3] === void 0 ? I : h[3] === '"' ? Le : je) : n === Le || n === je ? n = I : n === De || n === We ? n = V : (n = I, r = void 0);
    const b = n === I && t[a + 1].startsWith("/>") ? " " : "";
    s += n === V ? l + Mt : c >= 0 ? (o.push(d), l.slice(0, c) + rt + l.slice(c) + k + b) : l + k + (c === -2 ? a : b);
  }
  return [lt(t, s + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), o];
};
class K {
  constructor({ strings: e, _$litType$: i }, o) {
    let r;
    this.parts = [];
    let s = 0, n = 0;
    const a = e.length - 1, l = this.parts, [d, h] = Ot(e, i);
    if (this.el = K.createElement(d, o), P.currentNode = this.el.content, i === 2 || i === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = P.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(rt)) {
          const f = h[n++], b = r.getAttribute(c).split(k), x = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: s, name: x[2], strings: b, ctor: x[1] === "." ? Pt : x[1] === "?" ? Tt : x[1] === "@" ? zt : de }), r.removeAttribute(c);
        } else c.startsWith(k) && (l.push({ type: 6, index: s }), r.removeAttribute(c));
        if (st.test(r.tagName)) {
          const c = r.textContent.split(k), f = c.length - 1;
          if (f > 0) {
            r.textContent = se ? se.emptyScript : "";
            for (let b = 0; b < f; b++) r.append(c[b], Y()), P.nextNode(), l.push({ type: 2, index: ++s });
            r.append(c[f], Y());
          }
        }
      } else if (r.nodeType === 8) if (r.data === nt) l.push({ type: 2, index: s });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(k, c + 1)) !== -1; ) l.push({ type: 7, index: s }), c += k.length - 1;
      }
      s++;
    }
  }
  static createElement(e, i) {
    const o = z.createElement("template");
    return o.innerHTML = e, o;
  }
}
function L(t, e, i = t, o) {
  var n, a;
  if (e === j) return e;
  let r = o !== void 0 ? (n = i._$Co) == null ? void 0 : n[o] : i._$Cl;
  const s = X(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== s && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), s === void 0 ? r = void 0 : (r = new s(t), r._$AT(t, i, o)), o !== void 0 ? (i._$Co ?? (i._$Co = []))[o] = r : i._$Cl = r), r !== void 0 && (e = L(t, r._$AS(t, e.values), r, o)), e;
}
class It {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: o } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? z).importNode(i, !0);
    P.currentNode = r;
    let s = P.nextNode(), n = 0, a = 0, l = o[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let d;
        l.type === 2 ? d = new J(s, s.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(s, l.name, l.strings, this, e) : l.type === 6 && (d = new Rt(s, this, e)), this._$AV.push(d), l = o[++a];
      }
      n !== (l == null ? void 0 : l.index) && (s = P.nextNode(), n++);
    }
    return P.currentNode = z, r;
  }
  p(e) {
    let i = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(e, o, i), i += o.strings.length - 2) : o._$AI(e[i])), i++;
  }
}
class J {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, o, r) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = o, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = L(this, e, i), X(e) ? e === g || e == null || e === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : e !== this._$AH && e !== j && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : kt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== g && X(this._$AH) ? this._$AA.nextSibling.data = e : this.T(z.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: i, _$litType$: o } = e, r = typeof o == "number" ? this._$AC(e) : (o.el === void 0 && (o.el = K.createElement(lt(o.h, o.h[0]), this.options)), o);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === r) this._$AH.p(i);
    else {
      const n = new It(r, this), a = n.u(this.options);
      n.p(i), this.T(a), this._$AH = n;
    }
  }
  _$AC(e) {
    let i = Be.get(e.strings);
    return i === void 0 && Be.set(e.strings, i = new K(e)), i;
  }
  k(e) {
    Ee(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let o, r = 0;
    for (const s of e) r === i.length ? i.push(o = new J(this.O(Y()), this.O(Y()), this, this.options)) : o = i[r], o._$AI(s), r++;
    r < i.length && (this._$AR(o && o._$AB.nextSibling, r), i.length = r);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var o;
    for ((o = this._$AP) == null ? void 0 : o.call(this, !1, !0, i); e !== this._$AB; ) {
      const r = He(e).nextSibling;
      He(e).remove(), e = r;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class de {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, o, r, s) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = e, this.name = i, this._$AM = r, this.options = s, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = g;
  }
  _$AI(e, i = this, o, r) {
    const s = this.strings;
    let n = !1;
    if (s === void 0) e = L(this, e, i, 0), n = !X(e) || e !== this._$AH && e !== j, n && (this._$AH = e);
    else {
      const a = e;
      let l, d;
      for (e = s[0], l = 0; l < s.length - 1; l++) d = L(this, a[o + l], i, l), d === j && (d = this._$AH[l]), n || (n = !X(d) || d !== this._$AH[l]), d === g ? e = g : e !== g && (e += (d ?? "") + s[l + 1]), this._$AH[l] = d;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pt extends de {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === g ? void 0 : e;
  }
}
class Tt extends de {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== g);
  }
}
class zt extends de {
  constructor(e, i, o, r, s) {
    super(e, i, o, r, s), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = L(this, e, i, 0) ?? g) === j) return;
    const o = this._$AH, r = e === g && o !== g || e.capture !== o.capture || e.once !== o.once || e.passive !== o.passive, s = e !== g && (o === g || r);
    r && this.element.removeEventListener(this.name, this, o), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Rt {
  constructor(e, i, o) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    L(this, e);
  }
}
const me = Z.litHtmlPolyfillSupport;
me == null || me(K, J), (Z.litHtmlVersions ?? (Z.litHtmlVersions = [])).push("3.3.3");
const Ht = (t, e, i) => {
  const o = (i == null ? void 0 : i.renderBefore) ?? e;
  let r = o._$litPart$;
  if (r === void 0) {
    const s = (i == null ? void 0 : i.renderBefore) ?? null;
    o._$litPart$ = r = new J(e.insertBefore(Y(), s), s, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis;
class W extends D {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const e = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = e.firstChild), e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ht(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return j;
  }
}
var tt;
W._$litElement$ = !0, W.finalized = !0, (tt = T.litElementHydrateSupport) == null || tt.call(T, { LitElement: W });
const _e = T.litElementPolyfillSupport;
_e == null || _e({ LitElement: W });
(T.litElementVersions ?? (T.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = { attribute: !0, type: String, converter: ne, reflect: !1, hasChanged: Ae }, Dt = (t = Ut, e, i) => {
  const { kind: o, metadata: r } = i;
  let s = globalThis.litPropertyMetadata.get(r);
  if (s === void 0 && globalThis.litPropertyMetadata.set(r, s = /* @__PURE__ */ new Map()), o === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(i.name, t), o === "accessor") {
    const { name: n } = i;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(n, l, t, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(n, void 0, t, a), a;
    } };
  }
  if (o === "setter") {
    const { name: n } = i;
    return function(a) {
      const l = this[n];
      e.call(this, a), this.requestUpdate(n, l, t, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function Wt(t) {
  return (e, i) => typeof i == "object" ? Dt(t, e, i) : ((o, r, s) => {
    const n = r.hasOwnProperty(s);
    return r.constructor.createProperty(s, o), n ? Object.getOwnPropertyDescriptor(r, s) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(t) {
  return Wt({ ...t, state: !0, attribute: !1 });
}
const y = {
  title: "Nexus Energy",
  mode: "power",
  range: "today",
  show_time_selector: !0,
  height: 720,
  animation: !0,
  animation_speed: 1,
  line_width_base: 2,
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
}, jt = /* @__PURE__ */ new Set(["w", "kw"]), Lt = /* @__PURE__ */ new Set(["wh", "kwh"]);
function Bt(t, e, i) {
  const o = e && t ? t.states[e] : void 0, r = Number.parseFloat(String((o == null ? void 0 : o.state) ?? "0").replace(",", ".")), n = String((o == null ? void 0 : o.attributes.unit_of_measurement) ?? (i === "power" ? "kW" : "kWh")).toLowerCase(), a = Number.isFinite(r) ? r : 0;
  return i === "power" && jt.has(n) ? {
    value: n === "w" ? Math.abs(a) / 1e3 : Math.abs(a),
    rawValue: n === "w" ? a / 1e3 : a,
    unit: "kW",
    state: o
  } : i === "energy" && Lt.has(n) ? {
    value: n === "wh" ? Math.abs(a) / 1e3 : Math.abs(a),
    rawValue: n === "wh" ? a / 1e3 : a,
    unit: "kWh",
    state: o
  } : {
    value: Math.abs(a),
    rawValue: a,
    unit: i === "power" ? "kW" : "kWh",
    state: o
  };
}
function ct(t) {
  const [, e = t] = t.split(".");
  return e.split("_").filter(Boolean).map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join(" ");
}
function ee(t, e, i = 2) {
  return e === "power" ? Math.abs(t) < 1 ? `${Math.round(t * 1e3)} W` : `${t.toFixed(i)} kW` : Math.abs(t) < 1 ? `${Math.round(t * 1e3)} Wh` : `${t.toFixed(i)} kWh`;
}
function te(t) {
  return Number.isFinite(t) ? `${Math.round(t * 100)}%` : "0%";
}
function Vt(t) {
  switch (t) {
    case "yesterday":
      return "Ayer";
    case "week":
      return "Esta semana";
    case "month":
      return "Mes actual";
    case "year":
      return "Año actual";
    case "custom":
      return "Personalizado";
    case "today":
    default:
      return "Hoy";
  }
}
const Ve = 5e-4, Gt = 64;
function Ft(t) {
  const e = {
    ...y,
    ...t,
    thresholds: {
      ...y.thresholds,
      ...t.thresholds
    }
  };
  return (t.nodes || t.entities) && (e.nodes = t.nodes ?? qt(t.entities ?? [])), t.sources && (e.sources = t.sources), e;
}
function qt(t) {
  return [
    {
      id: "home",
      name: "Casa",
      icon: "mdi:home-outline",
      children: t.map((e) => ({
        id: e.replace(/\W+/g, "-"),
        entity: e,
        name: ct(e)
      }))
    }
  ];
}
function Ge(t, e, i, o = /* @__PURE__ */ new Map()) {
  var N, S;
  const r = Ft(t), s = {
    warning: ((N = r.thresholds) == null ? void 0 : N.warning) ?? 0.65,
    critical: ((S = r.thresholds) == null ? void 0 : S.critical) ?? 0.85
  }, n = [], a = (p, $, v, B = "0") => {
    var ke, Oe;
    const he = i === "energy" ? p.energy_entity ?? p.entity : p.power_entity ?? p.entity, Me = p.id ?? he ?? `node-${B}`, Q = Bt(e, he, i), pe = p.invert_value ? -Q.rawValue : Q.rawValue, bt = Math.abs(pe), yt = p.children ?? [], u = {
      id: Me,
      name: p.name ?? ((Oe = (ke = Q.state) == null ? void 0 : ke.attributes.friendly_name) == null ? void 0 : Oe.toString()) ?? ct(Me),
      entity: he,
      icon: p.icon ?? Yt($),
      role: $,
      value: bt,
      rawValue: pe,
      unit: Q.unit,
      capacity: p.capacity,
      percentOfParent: 0,
      severity: "normal",
      direction: Xt(p.direction, pe),
      virtual: !1,
      overflow: !1,
      children: [],
      parent: v,
      color: p.color,
      history: []
    };
    u.children = yt.map(
      (A, ue) => {
        var Ie;
        return a(A, (Ie = A.children) != null && Ie.length ? "hub" : "load", u, `${B}-${ue}`);
      }
    );
    const H = u.children.reduce((A, ue) => A + ue.value, 0);
    !p.entity && u.children.length > 0 && (u.value = H, u.rawValue = H), u.children.length > 0 && (H > u.value + Math.max(Ve, u.value * 5e-3) ? (u.overflow = !0, u.severity = "overflow", n.push(u), typeof console < "u" && console.warn(
      `[nexus-energy-card] Overflow detected in ${u.name}: children=${H.toFixed(
        3
      )}${u.unit}, parent=${u.value.toFixed(3)}${u.unit}`
    ), u.children.push(Fe(u, 0))) : u.value - H > Math.max(Ve, u.value * 5e-3) && u.children.push(Fe(u, u.value - H))), u.severity = u.overflow ? "overflow" : qe(u, s.warning, s.critical), u.history = Kt(o, u);
    for (const A of u.children)
      A.percentOfParent = u.value > 0 ? A.value / u.value : 0, A.severity = A.overflow ? "overflow" : qe(A, s.warning, s.critical);
    return u;
  }, l = (r.nodes ?? []).map((p, $) => a(p, "hub", void 0, `root-${$}`)), d = l[0], h = (r.sources ?? []).map((p, $) => {
    const v = a(p, "source", d, `source-${$}`);
    return v.percentOfParent = d && d.value > 0 ? v.value / d.value : 0, v;
  }), c = [...h, ...Zt(l)], f = (d == null ? void 0 : d.value) ?? l.reduce((p, $) => p + $.value, 0), b = h.reduce((p, $) => p + $.value, 0), x = c.map((p) => `${p.id}:${p.rawValue.toFixed(4)}:${p.children.length}`).join("|");
  return {
    sources: h,
    roots: l,
    primaryRoot: d,
    allNodes: c,
    overflowNodes: n,
    total: f,
    sourceTotal: b,
    signature: x
  };
}
function Zt(t) {
  const e = [], i = (o) => {
    e.push(o), o.children.forEach(i);
  };
  return t.forEach(i), e;
}
function Fe(t, e) {
  return {
    id: `${t.id}__rest`,
    name: `Resto ${t.name}`,
    icon: "mdi:dots-horizontal",
    role: "rest",
    value: Math.max(0, e),
    rawValue: Math.max(0, e),
    unit: t.unit,
    percentOfParent: t.value > 0 ? Math.max(0, e) / t.value : 0,
    severity: "normal",
    direction: "forward",
    virtual: !0,
    overflow: !1,
    children: [],
    parent: t,
    history: ve(`${t.id}__rest`, Math.max(0, e))
  };
}
function Yt(t) {
  switch (t) {
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
function Xt(t, e) {
  return t === "export" ? "reverse" : t === "import" ? "forward" : e < 0 ? "reverse" : "forward";
}
function qe(t, e, i) {
  if (!t.capacity || t.capacity <= 0)
    return t.percentOfParent >= i ? "critical" : t.percentOfParent >= e ? "warning" : "normal";
  const o = t.value / t.capacity;
  return o >= i ? "critical" : o >= e ? "warning" : "normal";
}
function Kt(t, e) {
  if (!e.entity)
    return ve(e.id, e.value);
  const i = t.get(e.entity) ?? ve(e.entity, e.value).slice(0, 18), o = i.at(-1);
  for ((o === void 0 || Math.abs(o - e.value) > Math.max(1e-3, e.value * 5e-3)) && i.push(e.value); i.length > Gt; )
    i.shift();
  return t.set(e.entity, i), [...i];
}
function ve(t, e) {
  let i = 0;
  for (let o = 0; o < t.length; o += 1)
    i = i * 31 + t.charCodeAt(o) >>> 0;
  return Array.from({ length: 32 }, (o, r) => {
    const s = Math.sin(r / 3 + i % 17) * 0.16, n = Math.cos(r / 7 + i % 11) * 0.08;
    return Math.max(0, e * (0.9 + s + n));
  });
}
function Jt(t) {
  var e = 0, i = t.children, o = i && i.length;
  if (!o) e = 1;
  else for (; --o >= 0; ) e += i[o].value;
  t.value = e;
}
function Qt() {
  return this.eachAfter(Jt);
}
function ei(t, e) {
  let i = -1;
  for (const o of this)
    t.call(e, o, ++i, this);
  return this;
}
function ti(t, e) {
  for (var i = this, o = [i], r, s, n = -1; i = o.pop(); )
    if (t.call(e, i, ++n, this), r = i.children)
      for (s = r.length - 1; s >= 0; --s)
        o.push(r[s]);
  return this;
}
function ii(t, e) {
  for (var i = this, o = [i], r = [], s, n, a, l = -1; i = o.pop(); )
    if (r.push(i), s = i.children)
      for (n = 0, a = s.length; n < a; ++n)
        o.push(s[n]);
  for (; i = r.pop(); )
    t.call(e, i, ++l, this);
  return this;
}
function oi(t, e) {
  let i = -1;
  for (const o of this)
    if (t.call(e, o, ++i, this))
      return o;
}
function ri(t) {
  return this.eachAfter(function(e) {
    for (var i = +t(e.data) || 0, o = e.children, r = o && o.length; --r >= 0; ) i += o[r].value;
    e.value = i;
  });
}
function ni(t) {
  return this.eachBefore(function(e) {
    e.children && e.children.sort(t);
  });
}
function si(t) {
  for (var e = this, i = ai(e, t), o = [e]; e !== i; )
    e = e.parent, o.push(e);
  for (var r = o.length; t !== i; )
    o.splice(r, 0, t), t = t.parent;
  return o;
}
function ai(t, e) {
  if (t === e) return t;
  var i = t.ancestors(), o = e.ancestors(), r = null;
  for (t = i.pop(), e = o.pop(); t === e; )
    r = t, t = i.pop(), e = o.pop();
  return r;
}
function li() {
  for (var t = this, e = [t]; t = t.parent; )
    e.push(t);
  return e;
}
function di() {
  return Array.from(this);
}
function ci() {
  var t = [];
  return this.eachBefore(function(e) {
    e.children || t.push(e);
  }), t;
}
function hi() {
  var t = this, e = [];
  return t.each(function(i) {
    i !== t && e.push({ source: i.parent, target: i });
  }), e;
}
function* pi() {
  var t = this, e, i = [t], o, r, s;
  do
    for (e = i.reverse(), i = []; t = e.pop(); )
      if (yield t, o = t.children)
        for (r = 0, s = o.length; r < s; ++r)
          i.push(o[r]);
  while (i.length);
}
function Ne(t, e) {
  t instanceof Map ? (t = [void 0, t], e === void 0 && (e = fi)) : e === void 0 && (e = gi);
  for (var i = new ae(t), o, r = [i], s, n, a, l; o = r.pop(); )
    if ((n = e(o.data)) && (l = (n = Array.from(n)).length))
      for (o.children = n, a = l - 1; a >= 0; --a)
        r.push(s = n[a] = new ae(n[a])), s.parent = o, s.depth = o.depth + 1;
  return i.eachBefore(_i);
}
function ui() {
  return Ne(this).eachBefore(mi);
}
function gi(t) {
  return t.children;
}
function fi(t) {
  return Array.isArray(t) ? t[1] : null;
}
function mi(t) {
  t.data.value !== void 0 && (t.value = t.data.value), t.data = t.data.data;
}
function _i(t) {
  var e = 0;
  do
    t.height = e;
  while ((t = t.parent) && t.height < ++e);
}
function ae(t) {
  this.data = t, this.depth = this.height = 0, this.parent = null;
}
ae.prototype = Ne.prototype = {
  constructor: ae,
  count: Qt,
  each: ei,
  eachAfter: ii,
  eachBefore: ti,
  find: oi,
  sum: ri,
  sort: ni,
  path: si,
  ancestors: li,
  descendants: di,
  leaves: ci,
  links: hi,
  copy: ui,
  [Symbol.iterator]: pi
};
const le = 304, bi = 72, yi = 218, vi = 232, xe = 270, xi = 410, re = 52, Se = 16, ht = 32, $i = Se;
function wi(t, e) {
  const i = Math.max(360, e.width), o = Math.max(520, e.height), r = Ei(t.sources, i, o, e.orientation, e.hideZeroNodes ?? !1), s = t.primaryRoot;
  if (!s)
    return {
      orientation: e.orientation,
      width: i,
      height: o,
      nodes: r,
      sources: r,
      edges: []
    };
  if (e.orientation === "vertical") {
    const d = Ni(s, i, r, e), h = d.find((f) => f.id === s.id), c = Ze(r, d, h);
    return {
      orientation: e.orientation,
      width: i,
      height: Math.max(o, Math.max(...d.map((f) => f.y + f.height + 32), 0)),
      nodes: [...r, ...d],
      sources: r,
      primaryRoot: h,
      edges: c
    };
  }
  const n = Si(s, i, o, r, e), a = n.find((d) => d.id === s.id), l = Ze(r, n, a);
  return {
    orientation: e.orientation,
    width: i,
    height: Math.max(o, Math.max(...n.map((d) => d.y + d.height + 32), 0)),
    nodes: [...r, ...n],
    sources: r,
    primaryRoot: a,
    edges: l
  };
}
function Ci(t, e) {
  const i = Ye(t.from, e, "out", t.fromSlot, t.fromSlotCount), o = Ye(t.to, e, "in", t.toSlot, t.toSlotCount);
  if (e === "horizontal") {
    const s = (o.x - i.x) / 2;
    return `M ${i.x} ${i.y} C ${i.x + s} ${i.y}, ${o.x - s} ${o.y}, ${o.x} ${o.y}`;
  }
  const r = (o.y - i.y) / 2;
  return `M ${i.x} ${i.y} C ${i.x} ${i.y + r}, ${o.x} ${o.y - r}, ${o.x} ${o.y}`;
}
function $e(t) {
  return {
    x: t.x + t.width / 2,
    y: t.y + t.height / 2
  };
}
function pt(t, e, i, o) {
  if (t.children.length === 0 || i.has(t.id))
    return !1;
  const r = Ai(t);
  return e.has(t.id) ? !0 : r < o;
}
function Ai(t) {
  let e = 0, i = t.parent;
  for (; i; )
    e += 1, i = i.parent;
  return e;
}
function Ei(t, e, i, o, r) {
  const s = r ? t.filter((h) => h.value > 1e-3) : t;
  if (o === "horizontal") {
    const h = Math.min(vi, Math.max(yi, e * 0.16)), c = 112, f = $i, b = s.length * c + Math.max(0, s.length - 1) * f, x = Math.max(116, (i - b) / 2);
    return s.map((N, S) => ({
      ...N,
      x: 32,
      y: x + S * (c + f),
      width: h,
      height: c,
      depth: 0,
      visibleChildren: []
    }));
  }
  const n = 10, a = e < 520 ? 1 : Math.min(4, Math.max(2, s.length)), l = Math.min(300, Math.floor((e - 32 - n * (a - 1)) / a)), d = 82;
  return s.map((h, c) => ({
    ...h,
    x: a === 1 ? (e - l) / 2 : 16 + c % a * (l + n),
    y: 92 + Math.floor(c / a) * (d + n),
    width: l,
    height: d,
    depth: 0,
    visibleChildren: []
  }));
}
function Ni(t, e, i, o) {
  const r = [];
  let n = 92 + Math.max(1, Math.ceil(i.length / (e < 520 ? 1 : Math.min(4, i.length)))) * 92 + 34;
  const a = Math.min(280, e - 32), l = 318, d = {
    ...t,
    x: (e - a) / 2,
    y: n,
    width: a,
    height: l,
    depth: 0,
    visibleChildren: []
  };
  r.push(d), n += l + 26;
  const h = (c, f, b) => {
    if (pt(c, o.expandedIds, o.collapsedIds, o.defaultExpandedDepth))
      for (const x of c.children) {
        const N = Math.min(42, b * 16), S = Math.max(220, e - 32 - N), p = {
          ...x,
          x: 16 + N,
          y: n,
          width: S,
          height: 72,
          depth: b,
          visibleChildren: []
        };
        r.push(p), f.visibleChildren.push(p), n += p.height + 12, h(x, p, b + 1);
      }
  };
  return h(t, d, 1), r;
}
function Si(t, e, i, o, r) {
  const s = Ne(t, (v) => ft(v, r)), n = Math.max(1, s.height), a = Math.min(56, Math.max(32, e * 0.025)), l = e - a - le, d = /* @__PURE__ */ new Map();
  for (let v = 1; v <= n; v += 1)
    d.set(v, l - (n - v) * (le + re));
  const h = d.get(1) ?? l, c = o.reduce((v, B) => Math.max(v, B.x + B.width), 0), f = (c + h - xe) / 2, b = c + re, x = h - xe - re, N = Mi(f, b, x), S = ut(t, 0, r), p = Math.max(28, (i - S.subtreeHeight) / 2), $ = [];
  return gt(S, p, N, d, $), $;
}
function ut(t, e, i) {
  const o = ft(t, i).map((l) => ut(l, e + 1, i)), r = e === 0 ? xe : le, s = e === 0 ? xi : bi, n = e === 0 ? ht : Se, a = o.length > 0 ? o.reduce((l, d) => l + d.subtreeHeight, 0) + Math.max(0, o.length - 1) * n : 0;
  return {
    node: t,
    children: o,
    depth: e,
    width: r,
    height: s,
    subtreeHeight: Math.max(s, a),
    y: 0
  };
}
function gt(t, e, i, o, r) {
  const s = t.depth === 0 ? i : o.get(t.depth) ?? i + t.depth * (le + re), n = {
    ...t.node,
    x: s,
    y: 0,
    width: t.width,
    height: t.height,
    depth: t.depth,
    visibleChildren: []
  };
  if (r.push(n), t.children.length > 0) {
    const l = t.depth === 0 ? ht : Se, d = t.children.reduce((c, f) => c + f.subtreeHeight, 0) + Math.max(0, t.children.length - 1) * l;
    let h = e + (t.subtreeHeight - d) / 2;
    for (const c of t.children) {
      const f = gt(c, h, i, o, r);
      n.visibleChildren.push(f), h += c.subtreeHeight + l;
    }
  }
  const a = n.visibleChildren.length > 0 ? ($e(n.visibleChildren[0]).y + $e(n.visibleChildren[n.visibleChildren.length - 1]).y) / 2 : e + t.subtreeHeight / 2;
  return n.y = a - t.height / 2, n;
}
function ft(t, e) {
  return pt(t, e.expandedIds, e.collapsedIds, e.defaultExpandedDepth) ? e.hideZeroNodes ? t.children.filter((i) => i.value > 1e-3 || i.children.length > 0) : t.children : [];
}
function Mi(t, e, i) {
  return e > i ? (e + i) / 2 : Math.min(i, Math.max(e, t));
}
function Ze(t, e, i) {
  const o = [];
  if (i)
    for (const [r, s] of t.entries())
      o.push({
        id: `${s.id}->${i.id}`,
        from: s,
        to: i,
        fromSlot: 0,
        fromSlotCount: 1,
        toSlot: r,
        toSlotCount: t.length,
        value: s.value,
        percent: s.percentOfParent,
        severity: s.severity,
        direction: s.direction
      });
  for (const r of e)
    for (const [s, n] of r.visibleChildren.entries())
      o.push({
        id: `${r.id}->${n.id}`,
        from: r,
        to: n,
        fromSlot: s,
        fromSlotCount: r.visibleChildren.length,
        toSlot: 0,
        toSlotCount: 1,
        value: n.value,
        percent: n.percentOfParent,
        severity: n.severity,
        direction: n.direction
      });
  return o;
}
function Ye(t, e, i, o = 0, r = 1) {
  const s = r <= 1 ? 0.5 : (o + 1) / (r + 1);
  return e === "horizontal" ? {
    x: i === "out" ? t.x + t.width : t.x,
    y: t.y + t.height * s
  } : {
    x: t.x + t.width * s,
    y: i === "out" ? t.y + t.height : t.y
  };
}
const be = 2, ki = 10, ie = 0.05, Xe = 3, Oi = 18;
function Ii(t, e, i, o, r = be) {
  const s = ye(r, 1, 8), n = s + (ki - be), a = Math.max(2, s + (Xe - be)), l = a + (Oi - Xe);
  if (i === "energy") {
    const h = ye(o, 0, 1);
    return Ke(a + h * (l - a));
  }
  if (t <= ie || e <= ie)
    return s;
  const d = Math.log1p(Math.max(0, t - ie)) / Math.log1p(Math.max(1e-3, e - ie));
  return Ke(s + ye(d, 0, 1) * (n - s));
}
function ye(t, e, i) {
  return Math.min(i, Math.max(e, t));
}
function Ke(t) {
  return Math.round(t * 100) / 100;
}
var Pi = Object.defineProperty, Ti = Object.getOwnPropertyDescriptor, M = (t, e, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Ti(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (r = (o ? n(e, i, r) : n(r)) || r);
  return o && r && Pi(e, i, r), r;
};
const Je = 1;
let w = class extends W {
  constructor() {
    super(...arguments), this._config = y, this._graph = Ge(y, void 0, "power"), this._mode = "power", this._range = "today", this._width = 1180, this._expandedIds = /* @__PURE__ */ new Set(), this._collapsedIds = /* @__PURE__ */ new Set(), this._historyCache = /* @__PURE__ */ new Map(), this._lastValues = /* @__PURE__ */ new Map(), this._clearTooltip = () => {
      this._hoveredNodeId = void 0;
    }, this._cancelTouchTooltip = () => {
      window.clearTimeout(this._touchTimer);
    };
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Li), document.createElement("nexus-energy-card-editor");
  }
  static getStubConfig() {
    return y;
  }
  setConfig(t) {
    if (!t.entities && !t.nodes && !t.sources)
      throw new Error("Parámetros 'entities', 'sources' o 'nodes' mínimos no definidos.");
    this._config = {
      ...y,
      ...t,
      thresholds: {
        ...y.thresholds,
        ...t.thresholds
      }
    }, this._mode = t.mode ?? y.mode ?? "power", this._range = t.range ?? y.range ?? "today", this._restoreBranchState(), this._rebuildGraph(!0);
  }
  set hass(t) {
    this._hass = t, this._rebuildGraph(!1);
  }
  connectedCallback() {
    super.connectedCallback(), this._restoreBranchState();
  }
  disconnectedCallback() {
    var t;
    (t = this._resizeObserver) == null || t.disconnect(), window.clearTimeout(this._touchTimer), super.disconnectedCallback();
  }
  firstUpdated() {
    const t = this.renderRoot.querySelector(".nexus-card-frame");
    t && "ResizeObserver" in window && (this._resizeObserver = new ResizeObserver(([e]) => {
      this._width = Math.max(320, Math.round(e.contentRect.width));
    }), this._resizeObserver.observe(t));
  }
  render() {
    const t = this._width < 768 ? "vertical" : "horizontal", e = t === "vertical" ? Math.max(920, this._config.height ?? 720) : this._config.height ?? 720, i = wi(this._graph, {
      width: this._width,
      height: e,
      orientation: t,
      expandedIds: this._expandedIds,
      collapsedIds: this._collapsedIds,
      defaultExpandedDepth: this._config.default_expanded_depth ?? 2,
      hideZeroNodes: this._config.hide_zero_nodes ?? !1
    }), o = i.primaryRoot, r = this._graph.sourceTotal > 0 ? Math.min(1, this._graph.total / this._graph.sourceTotal) : 0;
    return m`
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
                  <strong>${this._mode === "power" ? "Ahora" : Vt(this._range)}</strong>
                </p>
              </div>
            </div>

            <div class="toolbar" aria-label="Controles de Nexus Energy">
              <div class="segmented" role="tablist" aria-label="Modo de operación">
                <button
                  class=${this._mode === "power" ? "active" : ""}
                  type="button"
                  role="tab"
                  aria-selected=${this._mode === "power"}
                  @click=${() => this._setMode("power")}
                >
                  Potencia
                </button>
                <button
                  class=${this._mode === "energy" ? "active" : ""}
                  type="button"
                  role="tab"
                  aria-selected=${this._mode === "energy"}
                  @click=${() => this._setMode("energy")}
                >
                  Energía
                </button>
              </div>

              ${this._mode === "energy" && this._config.show_time_selector !== !1 ? m`
                    <label class="range-select">
                      <ha-icon icon="mdi:calendar-month-outline"></ha-icon>
                      <select .value=${this._range} @change=${this._handleRangeChange}>
                        <option value="today">Hoy</option>
                        <option value="yesterday">Ayer</option>
                        <option value="week">Esta semana</option>
                        <option value="month">Mes actual</option>
                        <option value="year">Año actual</option>
                        <option value="custom">Personalizado</option>
                      </select>
                    </label>
                  ` : this._mode === "power" ? m`<div class="now-pill"><ha-icon icon="mdi:clock-outline"></ha-icon> Ahora</div>` : g}
            </div>
          </header>

          <section class="summary-strip" aria-label="Resumen energético">
            <div class="primary-metric">
              <span>${this._mode === "power" ? "Consumo actual" : "Consumo acumulado"}</span>
              <strong>${ee(this._graph.total, this._mode, this._config.precision)}</strong>
              <small><ha-icon icon="mdi:trending-down"></ha-icon> 18% vs ayer 9:00</small>
            </div>
            <div class="glass-control" aria-label="Zoom visual">
              <button type="button" title="Centrar mapa"><ha-icon icon="mdi:crosshairs-gps"></ha-icon></button>
              <span>100%</span>
              <button type="button" title="Alejar"><ha-icon icon="mdi:minus"></ha-icon></button>
              <button type="button" title="Acercar"><ha-icon icon="mdi:plus"></ha-icon></button>
              <button type="button" title="Pantalla completa"><ha-icon icon="mdi:fullscreen"></ha-icon></button>
            </div>
            <div class="health-pill ${this._graph.overflowNodes.length ? "warning" : ""}">
              <ha-icon icon=${this._graph.overflowNodes.length ? "mdi:alert-circle-outline" : "mdi:shield-check-outline"}></ha-icon>
              ${this._graph.overflowNodes.length ? `${this._graph.overflowNodes.length} overflow` : "Sistema normal"}
            </div>
          </section>

          <section class="graph-stage ${t}" style=${`height:${i.height}px`}>
            ${this._renderSvg(i)}
            <div class="node-layer">
              ${i.nodes.map((s) => this._renderNode(s, o, r))}
            </div>
            ${this._renderTooltip(i)}
          </section>

          <footer class="bottom-metrics">
            <div><ha-icon icon="mdi:leaf"></ha-icon><span>CO2 evitado hoy</span><strong>12.4 kg</strong></div>
            <div><ha-icon icon="mdi:cash-multiple"></ha-icon><span>Ahorro hoy</span><strong>2.18 €</strong></div>
            <div><ha-icon icon="mdi:thermometer"></ha-icon><span>Temperatura</span><strong>24.1 °C</strong></div>
          </footer>
        </section>
      </ha-card>
    `;
  }
  _renderSvg(t) {
    const e = Math.max(0.05, ...t.edges.map((i) => i.value));
    return G`
      <svg
        class="flow-layer"
        viewBox=${`0 0 ${t.width} ${t.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          ${t.edges.map(
      (i) => G`
              <linearGradient id=${this._gradientId(i.id)} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color=${this._edgeStart(i)} stop-opacity="0.2"></stop>
                <stop offset="48%" stop-color=${this._edgeColor(i)} stop-opacity="0.94"></stop>
                <stop offset="100%" stop-color=${this._edgeColor(i)} stop-opacity="0.22"></stop>
              </linearGradient>
            `
    )}
        </defs>
        ${t.edges.map((i) => {
      const o = Ci(i, t.orientation), r = this._edgeWidth(i, e);
      return G`
            <g class=${`flow-edge ${i.severity} ${i.direction}`}>
              <path class="flow-halo" d=${o} stroke-width=${r + 8}></path>
              <path
                id=${this._pathId(i.id)}
                class=${`flow-path ${this._mode}`}
                d=${o}
                stroke=${`url(#${this._gradientId(i.id)})`}
                stroke-width=${r}
              ></path>
              ${this._mode === "power" && this._config.animation !== !1 ? G`
                  <circle class="particle" r=${Math.max(2.4, r / 2.2)} fill=${this._edgeColor(i)}>
                    <animateMotion
                      dur=${this._particleDuration(i)}
                      repeatCount="indefinite"
                      rotate="auto"
                      calcMode=${i.direction === "reverse" ? "linear" : g}
                      keyPoints=${i.direction === "reverse" ? "1;0" : g}
                      keyTimes=${i.direction === "reverse" ? "0;1" : g}
                    >
                      <mpath href=${`#${this._pathId(i.id)}`}></mpath>
                    </animateMotion>
                  </circle>
                ` : g}
            </g>
          `;
    })}
      </svg>
    `;
  }
  _renderNode(t, e, i) {
    const o = (e == null ? void 0 : e.id) === t.id, r = t.children.length > 0, s = this._collapsedIds.has(t.id), n = [
      "flow-node",
      `role-${t.role}`,
      t.severity,
      o ? "is-root" : "",
      r ? "is-container" : "",
      s ? "is-collapsed" : ""
    ].filter(Boolean).join(" ");
    return m`
      <article
        class=${n}
        style=${`left:${t.x}px;top:${t.y}px;width:${t.width}px;height:${t.height}px;--node-accent:${this._nodeAccent(t)};`}
        tabindex="0"
        @mouseenter=${() => this._showTooltip(t)}
        @focusin=${() => this._showTooltip(t)}
        @touchstart=${() => this._queueTouchTooltip(t)}
        @touchend=${this._cancelTouchTooltip}
        @click=${(a) => this._toggleNode(a, t)}
      >
        ${o ? this._renderRootNode(t, i) : this._renderCompactNode(t)}
      </article>
    `;
  }
  _renderRootNode(t, e) {
    return m`
      <div class="root-heading">
        <span class="node-icon root-icon"><ha-icon icon=${t.icon}></ha-icon></span>
        <button class="collapse-button" type="button" title="Expandir o colapsar">
          <ha-icon icon=${this._collapsedIds.has(t.id) ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
        </button>
      </div>
      <div class="root-title">${t.name}</div>
      <div class="root-value">${ee(t.value, this._mode, this._config.precision)}</div>
      <div class="root-subtitle">${this._mode === "power" ? "Consumo actual" : "Energía del periodo"}</div>
      <div class="gauge" style=${`--gauge:${Math.round(e * 100)}%`}>
        <span>${Math.round(e * 100)}%</span>
        <small>Autonomía solar</small>
      </div>
      <dl class="root-stats">
        <div><dt>Voltaje</dt><dd>230 V</dd></div>
        <div><dt>Frecuencia</dt><dd>50.0 Hz</dd></div>
        <div><dt>Factor de potencia</dt><dd>0.97</dd></div>
      </dl>
    `;
  }
  _renderCompactNode(t) {
    const e = this._nodeStatus(t);
    return m`
      <div class="node-main">
        <span class="node-icon"><ha-icon icon=${t.icon}></ha-icon></span>
        <div class="node-copy">
          <strong>${t.name}</strong>
          <span>${ee(t.value, this._mode, this._config.precision)}</span>
        </div>
        ${t.children.length ? m`
              <button class="collapse-button" type="button" title="Expandir o colapsar">
                <ha-icon icon=${this._collapsedIds.has(t.id) ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
              </button>
            ` : m`<span class="node-percent">${te(t.percentOfParent)}</span>`}
      </div>
      ${t.role === "source" ? m`
            <div class="source-meta">
              <strong>${te(t.capacity ? t.value / t.capacity : t.percentOfParent)}</strong>
              <span>${e}</span>
            </div>
            ${this._renderSparkline(t, 172, 34)}
          ` : g}
      ${t.role !== "source" && t.children.length ? m`<div class="container-share">${te(t.percentOfParent)} del total</div>` : g}
    `;
  }
  _renderTooltip(t) {
    if (!this._hoveredNodeId)
      return g;
    const e = t.nodes.find((n) => n.id === this._hoveredNodeId);
    if (!e)
      return g;
    const i = $e(e), o = 252, r = Math.min(t.width - o - 18, Math.max(18, i.x + 34)), s = Math.min(t.height - 198, Math.max(18, i.y - 74));
    return m`
      <aside class="tooltip" style=${`left:${r}px;top:${s}px;width:${o}px;`}>
        <header>
          <strong>${e.name}</strong>
          <span>${ee(e.value, this._mode, this._config.precision)}</span>
        </header>
        <p>
          <span class="dot"></span>
          ${te(e.percentOfParent)} ${e.parent ? `de ${e.parent.name}` : "del balance"}
        </p>
        ${this._renderSparkline(e, 216, 58)}
        <footer>
          <ha-icon icon=${e.overflow ? "mdi:alert-outline" : "mdi:lightbulb-on-outline"}></ha-icon>
          ${e.overflow ? "Lecturas hijas por encima del total" : this._tooltipHint(e)}
        </footer>
      </aside>
    `;
  }
  _renderSparkline(t, e, i) {
    const o = zi(t.history, e, i);
    return G`
      <svg class="sparkline" viewBox=${`0 0 ${e} ${i}`} aria-hidden="true">
        <path class="sparkline-area" d=${`${o} L ${e} ${i} L 0 ${i} Z`}></path>
        <path class="sparkline-line" d=${o}></path>
      </svg>
    `;
  }
  _setMode(t) {
    this._mode !== t && (this._mode = t, this._rebuildGraph(!0));
  }
  _handleRangeChange(t) {
    const e = t.target.value;
    this._range = e, this.dispatchEvent(new CustomEvent("nexus-range-changed", { detail: { range: e }, bubbles: !0, composed: !0 }));
  }
  _toggleNode(t, e) {
    if (e.children.length === 0)
      return;
    t.stopPropagation();
    const i = this._isCurrentlyExpanded(e), o = new Set(this._expandedIds), r = new Set(this._collapsedIds);
    i ? (o.delete(e.id), r.add(e.id)) : (r.delete(e.id), o.add(e.id)), this._expandedIds = o, this._collapsedIds = r, this._saveBranchState();
  }
  _isCurrentlyExpanded(t) {
    return this._collapsedIds.has(t.id) ? !1 : this._expandedIds.has(t.id) ? !0 : t.depth < (this._config.default_expanded_depth ?? 2);
  }
  _showTooltip(t) {
    this._hoveredNodeId = t.id;
  }
  _queueTouchTooltip(t) {
    window.clearTimeout(this._touchTimer), this._touchTimer = window.setTimeout(() => {
      this._hoveredNodeId = t.id;
    }, 420);
  }
  _rebuildGraph(t) {
    const e = Ge(this._config, this._hass, this._mode, this._historyCache);
    (t || this._hasMeaningfulGraphChange(e)) && (this._graph = e, this._lastValues = new Map(e.allNodes.map((i) => [i.id, i.value])));
  }
  _hasMeaningfulGraphChange(t) {
    return this._lastValues.size !== t.allNodes.length ? !0 : t.allNodes.some((e) => {
      const i = this._lastValues.get(e.id);
      return i === void 0 ? !0 : Math.abs(e.value - i) > Math.max(5e-3, Math.abs(i) * 5e-3);
    });
  }
  _saveBranchState() {
    try {
      sessionStorage.setItem(
        this._storageKey(),
        JSON.stringify({
          version: Je,
          expanded: [...this._expandedIds],
          collapsed: [...this._collapsedIds]
        })
      );
    } catch {
    }
  }
  _restoreBranchState() {
    try {
      const t = sessionStorage.getItem(this._storageKey());
      if (!t)
        return;
      const e = JSON.parse(t);
      if (e.version !== Je)
        return;
      this._expandedIds = new Set(e.expanded ?? []), this._collapsedIds = new Set(e.collapsed ?? []);
    } catch {
      this._expandedIds = /* @__PURE__ */ new Set(), this._collapsedIds = /* @__PURE__ */ new Set();
    }
  }
  _storageKey() {
    return `nexus-energy-card:${this._config.title ?? "nexus-energy-card"}:branches`;
  }
  _edgeWidth(t, e) {
    return Ii(t.value, e, this._mode, t.percent, this._config.line_width_base ?? 2);
  }
  _particleDuration(t) {
    const e = Ri(this._config.animation_speed ?? 1, 0.4, 3);
    return `${(Math.max(1.1, 6.8 - t.value * 1.2) / e).toFixed(2)}s`;
  }
  _edgeColor(t) {
    const e = this._thresholdColor(t.to);
    if (e)
      return e;
    if (t.direction === "reverse")
      return "#50f0a6";
    switch (t.severity) {
      case "overflow":
        return "#ff6259";
      case "critical":
        return "#ffb000";
      case "warning":
        return "#ffd23f";
      case "normal":
      default:
        return this._config.base_color ?? (t.from.role === "source" ? "#47f0bd" : "#38a5ff");
    }
  }
  _edgeStart(t) {
    return t.direction === "reverse" ? "#38a5ff" : "#76ffe2";
  }
  _gradientId(t) {
    return `nexus-gradient-${t.replace(/\W+/g, "-")}`;
  }
  _pathId(t) {
    return `nexus-path-${t.replace(/\W+/g, "-")}`;
  }
  _nodeAccent(t) {
    const e = this._thresholdColor(t);
    return e || (t.color ? t.color : t.role === "source" ? "#54f1b8" : t.severity === "critical" || t.severity === "overflow" ? "#ff6259" : t.severity === "warning" ? "#ffd23f" : this._config.base_color ?? "#8bbcff");
  }
  _thresholdColor(t) {
    const e = [...this._config.color_thresholds ?? []].sort((r, s) => s.above - r.above), i = this._mode === "power" ? t.value * 1e3 : t.value, o = e.find((r) => (!r.node_id || r.node_id === "__all__" || r.node_id === t.id) && i >= r.above);
    return o == null ? void 0 : o.color;
  }
  _nodeStatus(t) {
    return t.overflow ? "Desbordamiento" : t.direction === "reverse" ? t.role === "source" ? "Exportando" : "Flujo inverso" : t.value <= 1e-3 ? "Standby" : t.role === "source" ? "Aportando" : "Activo";
  }
  _tooltipHint(t) {
    return t.role === "rest" ? "Carga no asignada automáticamente" : t.children.length ? "Pulsa para expandir o colapsar la rama" : "Historial inmediato calculado en la tarjeta";
  }
};
w.styles = ot`
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
      padding: 28px 30px 22px;
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
    .summary-strip,
    .bottom-metrics {
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

    .toolbar,
    .summary-strip,
    .bottom-metrics {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .segmented {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-width: 278px;
      padding: 3px;
      border: 1px solid var(--nexus-line);
      border-radius: 22px;
      background: rgba(12, 22, 34, 0.58);
      backdrop-filter: blur(12px);
    }

    button,
    select {
      font: inherit;
      letter-spacing: 0;
    }

    .segmented button {
      min-height: 42px;
      border: 0;
      border-radius: 18px;
      color: var(--nexus-muted);
      background: transparent;
      cursor: pointer;
    }

    .segmented button.active {
      color: #f8fbff;
      background: linear-gradient(180deg, rgba(58, 167, 255, 0.42), rgba(58, 167, 255, 0.18));
      box-shadow:
        inset 0 0 0 1px rgba(120, 190, 255, 0.38),
        0 6px 18px rgba(42, 132, 220, 0.2);
    }

    .range-select,
    .now-pill,
    .health-pill,
    .glass-control {
      display: flex;
      align-items: center;
      min-height: 44px;
      border: 1px solid var(--nexus-line);
      border-radius: 22px;
      background: rgba(12, 22, 34, 0.55);
      color: var(--nexus-muted);
      backdrop-filter: blur(12px);
    }

    .range-select,
    .now-pill {
      gap: 9px;
      padding: 0 16px;
    }

    .range-select select {
      border: 0;
      color: inherit;
      background: transparent;
      outline: 0;
      cursor: pointer;
    }

    .summary-strip {
      justify-content: space-between;
      margin-bottom: 6px;
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

    .primary-metric small {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #6bf19c;
      font-size: 13px;
    }

    .primary-metric ha-icon {
      --mdc-icon-size: 15px;
    }

    .glass-control {
      padding: 0 12px;
      gap: 10px;
    }

    .glass-control button {
      display: grid;
      width: 30px;
      height: 30px;
      place-items: center;
      border: 0;
      border-radius: 10px;
      color: var(--nexus-muted);
      background: transparent;
      cursor: pointer;
    }

    .glass-control button:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
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

    .flow-path.energy {
      stroke-dasharray: none;
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
    }

    .tooltip header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 14px;
      font-weight: 750;
    }

    .tooltip header span {
      color: var(--nexus-red);
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
      background: var(--nexus-red);
    }

    .tooltip .sparkline {
      width: 100%;
      height: 58px;
      margin: 4px 0 10px;
    }

    .tooltip .sparkline-line {
      stroke: var(--nexus-red);
    }

    .tooltip .sparkline-area {
      fill: rgba(255, 98, 89, 0.12);
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

    .bottom-metrics {
      justify-content: space-between;
      margin-top: 14px;
    }

    .bottom-metrics div {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 52px;
      padding: 0 16px;
      border: 1px solid var(--nexus-line);
      border-radius: 12px;
      background: rgba(21, 36, 54, 0.58);
      color: var(--nexus-muted);
    }

    .bottom-metrics ha-icon {
      color: var(--nexus-yellow);
    }

    .bottom-metrics strong {
      color: var(--nexus-green);
    }

    @media (max-width: 767px) {
      .nexus-card-frame {
        padding: 18px 14px;
      }

      .topbar,
      .summary-strip,
      .bottom-metrics {
        align-items: stretch;
        flex-direction: column;
      }

      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .segmented {
        min-width: 0;
      }

      .primary-metric strong {
        font-size: 38px;
      }

      .glass-control {
        display: none;
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
M([
  C()
], w.prototype, "_config", 2);
M([
  C()
], w.prototype, "_graph", 2);
M([
  C()
], w.prototype, "_mode", 2);
M([
  C()
], w.prototype, "_range", 2);
M([
  C()
], w.prototype, "_width", 2);
M([
  C()
], w.prototype, "_hoveredNodeId", 2);
M([
  C()
], w.prototype, "_expandedIds", 2);
M([
  C()
], w.prototype, "_collapsedIds", 2);
w = M([
  dt("nexus-energy-card")
], w);
function zi(t, e, i) {
  if (t.length === 0)
    return `M 0 ${i / 2} L ${e} ${i / 2}`;
  const o = Math.min(...t), r = Math.max(...t), s = Math.max(1e-3, r - o);
  return t.map((a, l) => {
    const d = t.length === 1 ? e : l / (t.length - 1) * e, h = i - (a - o) / s * (i - 8) - 4;
    return `${l === 0 ? "M" : "L"} ${d.toFixed(2)} ${h.toFixed(2)}`;
  }).join(" ");
}
function Ri(t, e, i) {
  return Math.min(i, Math.max(e, t));
}
var Hi = Object.defineProperty, Ui = Object.getOwnPropertyDescriptor, ce = (t, e, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Ui(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (r = (o ? n(e, i, r) : n(r)) || r);
  return o && r && Hi(e, i, r), r;
};
const E = "__source__", F = "__all__", Di = [
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
let R = class extends W {
  constructor() {
    super(...arguments), this._config = y, this._flatNodes = Qe(y), this._mode = y.mode ?? "power", this._changeMode = (t) => {
      this._mode = _(t), this._patchConfig("mode", this._mode);
    }, this._addThreshold = () => {
      const t = {
        id: `threshold-${Date.now().toString(36)}`,
        node_id: F,
        above: 2e3,
        color: "#ffb000"
      };
      this._patchConfig("color_thresholds", [...this._config.color_thresholds ?? [], t]);
    };
  }
  setConfig(t) {
    this._config = {
      ...y,
      ...t,
      thresholds: {
        ...y.thresholds,
        ...t.thresholds
      }
    }, this._mode = this._config.mode ?? "power", this._flatNodes = Qe(this._config);
  }
  set hass(t) {
    this._hass = t, this.requestUpdate();
  }
  render() {
    const t = this._filteredEntities(), e = this._mainNode();
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
          ${t.map((i) => m`<option value=${i.entity_id}>${i.label}</option>`)}
        </datalist>
        <datalist id="nexus-icons">
          ${Di.map((i) => m`<option value=${i}></option>`)}
        </datalist>

        ${this._renderGeneral(e, t)}
        ${this._renderBuilder(e, t)}
        ${this._renderAppearance()}
        ${this._renderThresholds(e)}
      </div>
    `;
  }
  _renderGeneral(t, e) {
    return m`
      <section class="panel">
        <div class="panel-head">
          <h4>Configuracion general</h4>
        </div>
        <div class="grid general-grid">
          <label>
            Titulo de la tarjeta
            <input .value=${this._config.title ?? ""} @input=${(i) => this._patchConfig("title", U(_(i)))} />
          </label>
          <label>
            Modo por defecto
            <select .value=${this._mode} @change=${this._changeMode}>
              <option value="power">Potencia</option>
              <option value="energy">Energia</option>
            </select>
          </label>
          ${this._renderCheck(
      "Selector temporal",
      this._config.show_time_selector !== !1,
      (i) => this._patchConfig("show_time_selector", i)
    )}
          ${this._renderEntityField(
      "Entidad de la Casa",
      t.entity ?? t.power_entity ?? "",
      e,
      (i) => this._patchMain(this._entityPatch(i))
    )}
          <label>
            Nombre del nodo principal
            <input
              .value=${t.name ?? "Casa"}
              @input=${(i) => this._patchMain({ name: U(_(i)) || "Casa" })}
            />
          </label>
          <label>
            Icono del nodo principal
            <input
              list="nexus-icons"
              .value=${t.icon ?? "mdi:home-outline"}
              @input=${(i) => this._patchMain({ icon: U(_(i)) || "mdi:home-outline" })}
            />
          </label>
        </div>
      </section>
    `;
  }
  _renderBuilder(t, e) {
    return m`
      <section class="panel">
        <div class="panel-head">
          <h4>Constructor del arbol</h4>
          <div class="head-actions">
            <button type="button" @click=${() => this._addNode(E)}>Fuente</button>
            <button type="button" @click=${() => this._addNode(this._mainId())}>Nodo</button>
          </div>
        </div>
        <div class="node-list">
          ${this._flatNodes.length ? this._flatNodes.map((i) => this._renderNodeRow(i, t, e)) : m`<div class="empty-state">Anade una fuente o un nodo para empezar.</div>`}
        </div>
      </section>
    `;
  }
  _renderNodeRow(t, e, i) {
    const o = t.parentId === E, r = o ? 0 : this._depthOf(t), s = o ? "Raiz/Fuente" : t.parentId === this._mainId() ? e.name ?? "Casa" : this._nodeName(t.parentId);
    return m`
      <article class=${`node-row ${o ? "is-source" : ""}`} style=${`--depth:${r}`}>
        <div class="row-title">
          <span class="row-icon"><ha-icon icon=${t.icon ?? (o ? "mdi:flash" : "mdi:power-plug-outline")}></ha-icon></span>
          <div>
            <strong>${t.name || "Nodo sin nombre"}</strong>
            <small>${s}</small>
          </div>
          <button class="icon-button danger" type="button" title="Eliminar" @click=${() => this._removeNode(t.id)}>
            <ha-icon icon="mdi:trash-can-outline"></ha-icon>
          </button>
        </div>

        <div class="grid node-grid">
          ${this._renderEntityField(
      "Entidad",
      t.entity ?? t.power_entity ?? t.energy_entity ?? "",
      i,
      (n) => this._patchNode(t.id, this._entityPatch(n))
    )}
          <label>
            Nombre a mostrar
            <input .value=${t.name} @input=${(n) => this._patchNode(t.id, { name: U(_(n)) })} />
          </label>
          <label>
            Icono
            <input
              list="nexus-icons"
              .value=${t.icon ?? ""}
              @input=${(n) => this._patchNode(t.id, { icon: U(_(n)) || void 0 })}
            />
          </label>
          <label>
            Nodo padre
            <select .value=${t.parentId} @change=${(n) => this._patchNode(t.id, { parentId: _(n) })}>
              <option value=${E} ?selected=${t.parentId === E}>Raiz/Fuente</option>
              <option value=${this._mainId()} ?selected=${t.parentId === this._mainId()}>${e.name ?? "Casa"}</option>
              ${this._flatNodes.filter((n) => this._canUseAsParent(n, t)).map((n) => m`<option value=${n.id} ?selected=${t.parentId === n.id}>${n.name}</option>`)}
            </select>
          </label>
          <label>
            Direccion
            <select
              .value=${t.direction ?? "auto"}
              @change=${(n) => this._patchNode(t.id, { direction: _(n) })}
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
              .value=${t.capacity === void 0 ? "" : String(t.capacity)}
              @input=${(n) => this._patchNode(t.id, { capacity: ji(_(n)) })}
            />
          </label>
          ${this._renderCheck("Invertir valor", t.invert_value === !0, (n) => this._patchNode(t.id, { invert_value: n }))}
        </div>
      </article>
    `;
  }
  _renderAppearance() {
    const t = this._config.animation_speed ?? 1, e = t < 0.85 ? "Lento" : t > 1.25 ? "Rapido" : "Normal";
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
                @input=${(i) => this._patchConfig("line_width_base", Number(_(i)))}
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
                .value=${String(t)}
                @input=${(i) => this._patchConfig("animation_speed", Number(_(i)))}
              />
              <output>${e}</output>
            </div>
          </label>
          <label>
            Estilo del fondo
            <select
              .value=${this._config.background_style ?? "glass"}
              @change=${(i) => this._patchConfig("background_style", _(i))}
            >
              <option value="glass">Glassmorphism</option>
              <option value="transparent">Transparente</option>
              <option value="solid">Color solido</option>
            </select>
          </label>
          <label>
            Color base
            <input type="color" .value=${this._config.base_color ?? "#38a5ff"} @input=${(i) => this._patchConfig("base_color", _(i))} />
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
              @input=${(i) => this._patchConfig("default_expanded_depth", Number(_(i)))}
            />
          </label>
          <label>
            Alto
            <input
              type="number"
              min="520"
              step="20"
              .value=${String(this._config.height ?? 720)}
              @input=${(i) => this._patchConfig("height", Number(_(i)))}
            />
          </label>
        </div>
      </section>
    `;
  }
  _renderThresholds(t) {
    const e = this._config.color_thresholds ?? [], i = [{ id: this._mainId(), name: t.name ?? "Casa" }, ...this._flatNodes.map((o) => ({ id: o.id, name: o.name }))];
    return m`
      <section class="panel">
        <div class="panel-head">
          <h4>Umbrales de color</h4>
          <button type="button" @click=${this._addThreshold}>Anadir umbral</button>
        </div>
        <div class="threshold-list">
          ${e.length ? e.map(
      (o, r) => m`
                  <article class="threshold-row">
                    <label>
                      Nodo
                      <select
                        .value=${o.node_id ?? F}
                        @change=${(s) => this._patchThreshold(r, { node_id: _(s) })}
                      >
                        <option value=${F}>Todos</option>
                        ${i.map((s) => m`<option value=${s.id}>${s.name}</option>`)}
                      </select>
                    </label>
                    <label>
                      Por encima de
                      <input
                        type="number"
                        min="0"
                        step="10"
                        .value=${String(o.above)}
                        @input=${(s) => this._patchThreshold(r, { above: Number(_(s)) })}
                      />
                    </label>
                    <label>
                      Color
                      <input type="color" .value=${o.color} @input=${(s) => this._patchThreshold(r, { color: _(s) })} />
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
  _renderEntityField(t, e, i, o) {
    return m`
      <label>
        ${t}
        <input
          list="nexus-entities"
          .value=${e}
          @input=${(r) => o(U(_(r)))}
          placeholder="sensor..."
        />
        ${i.length ? g : m`<span class="field-note">sensor power/energy</span>`}
      </label>
    `;
  }
  _renderCheck(t, e, i) {
    return m`
      <label class="check-row">
        <input type="checkbox" .checked=${e} @change=${(o) => i(o.target.checked)} />
        <span>${t}</span>
      </label>
    `;
  }
  _filteredEntities() {
    var e;
    return Object.values(((e = this._hass) == null ? void 0 : e.states) ?? {}).filter((i) => {
      const o = i.entity_id, r = String(i.attributes.device_class ?? "");
      return o.startsWith("sensor.") && (r === "power" || r === "energy");
    }).map((i) => ({
      entity_id: i.entity_id,
      label: `${i.attributes.friendly_name ?? i.entity_id} (${i.attributes.unit_of_measurement ?? ""})`,
      deviceClass: String(i.attributes.device_class ?? "")
    })).sort((i, o) => i.label.localeCompare(o.label));
  }
  _patchConfig(t, e) {
    this._config = {
      ...this._config,
      [t]: e
    }, this._emitConfig();
  }
  _patchMain(t) {
    const e = {
      ...this._mainNode(),
      ...t
    };
    this._config = {
      ...this._config,
      nodes: [e]
    }, this._emitConfig();
  }
  _patchNode(t, e) {
    this._flatNodes.find((o) => o.id === t) && (e.parentId && (e.parentId === t || this._isDescendant(e.parentId, t)) || (this._flatNodes = this._flatNodes.map((o) => o.id === t ? { ...o, ...e } : o), this._emitConfig()));
  }
  _addNode(t) {
    const e = t === E, i = Wi(this._flatNodes, e ? "fuente" : "nodo");
    this._flatNodes = [
      ...this._flatNodes,
      {
        id: i,
        parentId: t,
        name: e ? "Nueva fuente" : "Nuevo nodo",
        icon: e ? "mdi:flash" : "mdi:power-plug-outline",
        direction: "auto"
      }
    ], this._emitConfig();
  }
  _removeNode(t) {
    const e = /* @__PURE__ */ new Set([t]);
    let i = !0;
    for (; i; ) {
      i = !1;
      for (const o of this._flatNodes)
        e.has(o.parentId) && !e.has(o.id) && (e.add(o.id), i = !0);
    }
    this._flatNodes = this._flatNodes.filter((o) => !e.has(o.id)), this._emitConfig();
  }
  _patchThreshold(t, e) {
    var o;
    const i = [...this._config.color_thresholds ?? []];
    i[t] = {
      ...i[t],
      ...e,
      node_id: e.node_id === F ? F : e.node_id ?? ((o = i[t]) == null ? void 0 : o.node_id)
    }, this._patchConfig("color_thresholds", i);
  }
  _removeThreshold(t) {
    this._patchConfig(
      "color_thresholds",
      (this._config.color_thresholds ?? []).filter((e, i) => i !== t)
    );
  }
  _entityPatch(t) {
    var i;
    return t ? ((i = this._filteredEntities().find((o) => o.entity_id === t)) == null ? void 0 : i.deviceClass) === "energy" ? {
      entity: t,
      power_entity: void 0,
      energy_entity: t
    } : {
      entity: t,
      power_entity: t,
      energy_entity: void 0
    } : {
      entity: void 0,
      power_entity: void 0,
      energy_entity: void 0
    };
  }
  _mainNode() {
    var t, e;
    return ((t = this._config.nodes) == null ? void 0 : t[0]) ?? ((e = y.nodes) == null ? void 0 : e[0]) ?? { id: "home", name: "Casa", icon: "mdi:home-outline" };
  }
  _mainId() {
    return this._mainNode().id ?? "home";
  }
  _nodeName(t) {
    var e;
    return ((e = this._flatNodes.find((i) => i.id === t)) == null ? void 0 : e.name) ?? t;
  }
  _canUseAsParent(t, e) {
    return t.id !== e.id && t.parentId !== E && !this._isDescendant(t.id, e.id);
  }
  _isDescendant(t, e) {
    let i = t;
    for (; i && i !== E && i !== this._mainId(); ) {
      if (i === e)
        return !0;
      const o = this._flatNodes.find((r) => r.id === i);
      i = (o == null ? void 0 : o.parentId) ?? "";
    }
    return !1;
  }
  _depthOf(t) {
    let e = 0, i = t.parentId;
    for (; i && i !== this._mainId() && i !== E; ) {
      const o = this._flatNodes.find((r) => r.id === i);
      if (!o)
        break;
      e += 1, i = o.parentId;
    }
    return e;
  }
  _emitConfig() {
    const t = this._mainNode(), e = t.id ?? "home", i = {
      ...this._config,
      mode: this._mode,
      sources: this._flatNodes.filter((o) => o.parentId === E).map((o) => _t(o)),
      nodes: [
        {
          ...t,
          id: e,
          children: mt(this._flatNodes, e)
        }
      ]
    };
    this._config = i, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: i },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
R.styles = ot`
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

    .editor {
      display: grid;
      gap: 14px;
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
    }

    .panel-head,
    .row-title {
      justify-content: space-between;
    }

    .head-actions {
      margin-left: auto;
    }

    .grid {
      display: grid;
      gap: 10px;
    }

    .general-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .appearance-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
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
      gap: 12px;
      margin-left: calc(var(--depth) * 18px);
      padding: 12px;
    }

    .node-row.is-source .row-icon {
      color: #57efbd;
      background: rgba(73, 240, 191, 0.12);
    }

    .row-title {
      min-width: 0;
    }

    .row-title > div {
      min-width: 0;
      flex: 1;
    }

    .row-title strong,
    .row-title small {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-grid {
      grid-template-columns: repeat(4, minmax(130px, 1fr));
    }

    .threshold-row {
      display: grid;
      grid-template-columns: minmax(160px, 1.4fr) minmax(120px, 1fr) 96px 38px;
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
ce([
  C()
], R.prototype, "_config", 2);
ce([
  C()
], R.prototype, "_flatNodes", 2);
ce([
  C()
], R.prototype, "_mode", 2);
R = ce([
  dt("nexus-energy-card-editor")
], R);
function Qe(t) {
  var s, n;
  const e = [], i = ((s = t.nodes) == null ? void 0 : s[0]) ?? ((n = y.nodes) == null ? void 0 : n[0]), o = (i == null ? void 0 : i.id) ?? "home";
  for (const a of t.sources ?? [])
    e.push(et(a, E, e.length));
  const r = (a, l) => {
    for (const d of a ?? []) {
      const h = et(d, l, e.length);
      e.push(h), r(d.children, h.id);
    }
  };
  return r(i == null ? void 0 : i.children, o), e;
}
function et(t, e, i) {
  const o = t.id ?? t.entity ?? `node-${i}`;
  return {
    id: o,
    parentId: e,
    name: t.name ?? o,
    entity: t.entity,
    power_entity: t.power_entity,
    energy_entity: t.energy_entity,
    icon: t.icon,
    capacity: t.capacity,
    direction: t.direction,
    invert_value: t.invert_value,
    color: t.color
  };
}
function mt(t, e) {
  return t.filter((i) => i.parentId === e).map((i) => _t(i, mt(t, i.id)));
}
function _t(t, e = []) {
  return {
    id: t.id,
    name: t.name,
    entity: t.entity,
    power_entity: t.power_entity,
    energy_entity: t.energy_entity,
    icon: t.icon,
    capacity: t.capacity,
    direction: t.direction,
    invert_value: t.invert_value || void 0,
    color: t.color,
    children: e
  };
}
function Wi(t, e) {
  let i = t.length + 1, o = `${e}-${i}`;
  for (; t.some((r) => r.id === o); )
    i += 1, o = `${e}-${i}`;
  return o;
}
function U(t) {
  return t.trim();
}
function ji(t) {
  const e = t.trim();
  if (!e)
    return;
  const i = Number(e);
  return Number.isFinite(i) ? i : void 0;
}
function _(t) {
  return t.target.value;
}
const Li = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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

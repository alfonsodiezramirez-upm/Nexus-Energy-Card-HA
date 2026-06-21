/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = globalThis, Te = de.ShadowRoot && (de.ShadyCSS === void 0 || de.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ke = Symbol(), Fe = /* @__PURE__ */ new WeakMap();
let _t = class {
  constructor(t, o, i) {
    if (this._$cssResult$ = !0, i !== ke) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = o;
  }
  get styleSheet() {
    let t = this.o;
    const o = this.t;
    if (Te && t === void 0) {
      const i = o !== void 0 && o.length === 1;
      i && (t = Fe.get(o)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Fe.set(o, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Lt = (e) => new _t(typeof e == "string" ? e : e + "", void 0, ke), xt = (e, ...t) => {
  const o = e.length === 1 ? e[0] : t.reduce((i, r, a) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[a + 1], e[0]);
  return new _t(o, e, ke);
}, Ut = (e, t) => {
  if (Te) e.adoptedStyleSheets = t.map((o) => o instanceof CSSStyleSheet ? o : o.styleSheet);
  else for (const o of t) {
    const i = document.createElement("style"), r = de.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = o.cssText, e.appendChild(i);
  }
}, We = Te ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let o = "";
  for (const i of t.cssRules) o += i.cssText;
  return Lt(o);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ft, defineProperty: Wt, getOwnPropertyDescriptor: Gt, getOwnPropertyNames: Bt, getOwnPropertySymbols: jt, getPrototypeOf: Vt } = Object, P = globalThis, Ge = P.trustedTypes, qt = Ge ? Ge.emptyScript : "", ve = P.reactiveElementPolyfillSupport, ee = (e, t) => e, ue = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? qt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let o = e;
  switch (t) {
    case Boolean:
      o = e !== null;
      break;
    case Number:
      o = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        o = JSON.parse(e);
      } catch {
        o = null;
      }
  }
  return o;
} }, Ie = (e, t) => !Ft(e, t), Be = { attribute: !0, type: String, converter: ue, reflect: !1, useDefault: !1, hasChanged: Ie };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), P.litPropertyMetadata ?? (P.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let G = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, o = Be) {
    if (o.state && (o.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((o = Object.create(o)).wrapped = !0), this.elementProperties.set(t, o), !o.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, o);
      r !== void 0 && Wt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, o, i) {
    const { get: r, set: a } = Gt(this.prototype, t) ?? { get() {
      return this[o];
    }, set(n) {
      this[o] = n;
    } };
    return { get: r, set(n) {
      const s = r == null ? void 0 : r.call(this);
      a == null || a.call(this, n), this.requestUpdate(t, s, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Be;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ee("elementProperties"))) return;
    const t = Vt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ee("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ee("properties"))) {
      const o = this.properties, i = [...Bt(o), ...jt(o)];
      for (const r of i) this.createProperty(r, o[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const o = litPropertyMetadata.get(t);
      if (o !== void 0) for (const [i, r] of o) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [o, i] of this.elementProperties) {
      const r = this._$Eu(o, i);
      r !== void 0 && this._$Eh.set(r, o);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const o = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) o.unshift(We(r));
    } else t !== void 0 && o.push(We(t));
    return o;
  }
  static _$Eu(t, o) {
    const i = o.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((o) => this.enableUpdating = o), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((o) => o(this));
  }
  addController(t) {
    var o;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((o = t.hostConnected) == null || o.call(t));
  }
  removeController(t) {
    var o;
    (o = this._$EO) == null || o.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), o = this.constructor.elementProperties;
    for (const i of o.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ut(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((o) => {
      var i;
      return (i = o.hostConnected) == null ? void 0 : i.call(o);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((o) => {
      var i;
      return (i = o.hostDisconnected) == null ? void 0 : i.call(o);
    });
  }
  attributeChangedCallback(t, o, i) {
    this._$AK(t, i);
  }
  _$ET(t, o) {
    var a;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const n = (((a = i.converter) == null ? void 0 : a.toAttribute) !== void 0 ? i.converter : ue).toAttribute(o, i.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, o) {
    var a, n;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const s = i.getPropertyOptions(r), l = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((a = s.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? s.converter : ue;
      this._$Em = r;
      const c = l.fromAttribute(o, s.type);
      this[r] = c ?? ((n = this._$Ej) == null ? void 0 : n.get(r)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, o, i, r = !1, a) {
    var n;
    if (t !== void 0) {
      const s = this.constructor;
      if (r === !1 && (a = this[t]), i ?? (i = s.getPropertyOptions(t)), !((i.hasChanged ?? Ie)(a, o) || i.useDefault && i.reflect && a === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(s._$Eu(t, i)))) return;
      this.C(t, o, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, o, { useDefault: i, reflect: r, wrapped: a }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? o ?? this[t]), a !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (o = void 0), this._$AL.set(t, o)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (o) {
      Promise.reject(o);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, n] of this._$Ep) this[a] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [a, n] of r) {
        const { wrapped: s } = n, l = this[a];
        s !== !0 || this._$AL.has(a) || l === void 0 || this.C(a, void 0, n, l);
      }
    }
    let t = !1;
    const o = this._$AL;
    try {
      t = this.shouldUpdate(o), t ? (this.willUpdate(o), (i = this._$EO) == null || i.forEach((r) => {
        var a;
        return (a = r.hostUpdate) == null ? void 0 : a.call(r);
      }), this.update(o)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(o);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var o;
    (o = this._$EO) == null || o.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((o) => this._$ET(o, this[o]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
G.elementStyles = [], G.shadowRootOptions = { mode: "open" }, G[ee("elementProperties")] = /* @__PURE__ */ new Map(), G[ee("finalized")] = /* @__PURE__ */ new Map(), ve == null || ve({ ReactiveElement: G }), (P.reactiveElementVersions ?? (P.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis, je = (e) => e, pe = te.trustedTypes, Ve = pe ? pe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, vt = "$lit$", I = `lit$${Math.random().toFixed(9).slice(2)}$`, yt = "?" + I, Zt = `<${yt}>`, D = document, ie = () => D.createComment(""), re = (e) => e === null || typeof e != "object" && typeof e != "function", Pe = Array.isArray, Yt = (e) => Pe(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", ye = `[ 	
\f\r]`, K = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, qe = /-->/g, Ze = />/g, O = RegExp(`>|${ye}(?:([^\\s"'>=/]+)(${ye}*=${ye}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ye = /'/g, Ke = /"/g, bt = /^(?:script|style|textarea|title)$/i, wt = (e) => (t, ...o) => ({ _$litType$: e, strings: t, values: o }), m = wt(1), W = wt(2), V = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Xe = /* @__PURE__ */ new WeakMap(), z = D.createTreeWalker(D, 129);
function $t(e, t) {
  if (!Pe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ve !== void 0 ? Ve.createHTML(t) : t;
}
const Kt = (e, t) => {
  const o = e.length - 1, i = [];
  let r, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = K;
  for (let s = 0; s < o; s++) {
    const l = e[s];
    let c, d, h = -1, p = 0;
    for (; p < l.length && (n.lastIndex = p, d = n.exec(l), d !== null); ) p = n.lastIndex, n === K ? d[1] === "!--" ? n = qe : d[1] !== void 0 ? n = Ze : d[2] !== void 0 ? (bt.test(d[2]) && (r = RegExp("</" + d[2], "g")), n = O) : d[3] !== void 0 && (n = O) : n === O ? d[0] === ">" ? (n = r ?? K, h = -1) : d[1] === void 0 ? h = -2 : (h = n.lastIndex - d[2].length, c = d[1], n = d[3] === void 0 ? O : d[3] === '"' ? Ke : Ye) : n === Ke || n === Ye ? n = O : n === qe || n === Ze ? n = K : (n = O, r = void 0);
    const u = n === O && e[s + 1].startsWith("/>") ? " " : "";
    a += n === K ? l + Zt : h >= 0 ? (i.push(c), l.slice(0, h) + vt + l.slice(h) + I + u) : l + I + (h === -2 ? s : u);
  }
  return [$t(e, a + (e[o] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class ae {
  constructor({ strings: t, _$litType$: o }, i) {
    let r;
    this.parts = [];
    let a = 0, n = 0;
    const s = t.length - 1, l = this.parts, [c, d] = Kt(t, o);
    if (this.el = ae.createElement(c, i), z.currentNode = this.el.content, o === 2 || o === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = z.nextNode()) !== null && l.length < s; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(vt)) {
          const p = d[n++], u = r.getAttribute(h).split(I), x = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: a, name: x[2], strings: u, ctor: x[1] === "." ? Jt : x[1] === "?" ? Qt : x[1] === "@" ? eo : me }), r.removeAttribute(h);
        } else h.startsWith(I) && (l.push({ type: 6, index: a }), r.removeAttribute(h));
        if (bt.test(r.tagName)) {
          const h = r.textContent.split(I), p = h.length - 1;
          if (p > 0) {
            r.textContent = pe ? pe.emptyScript : "";
            for (let u = 0; u < p; u++) r.append(h[u], ie()), z.nextNode(), l.push({ type: 2, index: ++a });
            r.append(h[p], ie());
          }
        }
      } else if (r.nodeType === 8) if (r.data === yt) l.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(I, h + 1)) !== -1; ) l.push({ type: 7, index: a }), h += I.length - 1;
      }
      a++;
    }
  }
  static createElement(t, o) {
    const i = D.createElement("template");
    return i.innerHTML = t, i;
  }
}
function q(e, t, o = e, i) {
  var n, s;
  if (t === V) return t;
  let r = i !== void 0 ? (n = o._$Co) == null ? void 0 : n[i] : o._$Cl;
  const a = re(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== a && ((s = r == null ? void 0 : r._$AO) == null || s.call(r, !1), a === void 0 ? r = void 0 : (r = new a(e), r._$AT(e, o, i)), i !== void 0 ? (o._$Co ?? (o._$Co = []))[i] = r : o._$Cl = r), r !== void 0 && (t = q(e, r._$AS(e, t.values), r, i)), t;
}
class Xt {
  constructor(t, o) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = o;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: o }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? D).importNode(o, !0);
    z.currentNode = r;
    let a = z.nextNode(), n = 0, s = 0, l = i[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let c;
        l.type === 2 ? c = new ne(a, a.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(a, l.name, l.strings, this, t) : l.type === 6 && (c = new to(a, this, t)), this._$AV.push(c), l = i[++s];
      }
      n !== (l == null ? void 0 : l.index) && (a = z.nextNode(), n++);
    }
    return z.currentNode = D, r;
  }
  p(t) {
    let o = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, o), o += i.strings.length - 2) : i._$AI(t[o])), o++;
  }
}
class ne {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, o, i, r) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = o, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const o = this._$AM;
    return o !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = o.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, o = this) {
    t = q(this, t, o), re(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== V && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Yt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && re(this._$AH) ? this._$AA.nextSibling.data = t : this.T(D.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: o, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = ae.createElement($t(i.h, i.h[0]), this.options)), i);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === r) this._$AH.p(o);
    else {
      const n = new Xt(r, this), s = n.u(this.options);
      n.p(o), this.T(s), this._$AH = n;
    }
  }
  _$AC(t) {
    let o = Xe.get(t.strings);
    return o === void 0 && Xe.set(t.strings, o = new ae(t)), o;
  }
  k(t) {
    Pe(this._$AH) || (this._$AH = [], this._$AR());
    const o = this._$AH;
    let i, r = 0;
    for (const a of t) r === o.length ? o.push(i = new ne(this.O(ie()), this.O(ie()), this, this.options)) : i = o[r], i._$AI(a), r++;
    r < o.length && (this._$AR(i && i._$AB.nextSibling, r), o.length = r);
  }
  _$AR(t = this._$AA.nextSibling, o) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, o); t !== this._$AB; ) {
      const r = je(t).nextSibling;
      je(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var o;
    this._$AM === void 0 && (this._$Cv = t, (o = this._$AP) == null || o.call(this, t));
  }
}
class me {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, o, i, r, a) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = o, this._$AM = r, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = _;
  }
  _$AI(t, o = this, i, r) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) t = q(this, t, o, 0), n = !re(t) || t !== this._$AH && t !== V, n && (this._$AH = t);
    else {
      const s = t;
      let l, c;
      for (t = a[0], l = 0; l < a.length - 1; l++) c = q(this, s[i + l], o, l), c === V && (c = this._$AH[l]), n || (n = !re(c) || c !== this._$AH[l]), c === _ ? t = _ : t !== _ && (t += (c ?? "") + a[l + 1]), this._$AH[l] = c;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Jt extends me {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class Qt extends me {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class eo extends me {
  constructor(t, o, i, r, a) {
    super(t, o, i, r, a), this.type = 5;
  }
  _$AI(t, o = this) {
    if ((t = q(this, t, o, 0) ?? _) === V) return;
    const i = this._$AH, r = t === _ && i !== _ || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== _ && (i === _ || r);
    r && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var o;
    typeof this._$AH == "function" ? this._$AH.call(((o = this.options) == null ? void 0 : o.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class to {
  constructor(t, o, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = o, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    q(this, t);
  }
}
const be = te.litHtmlPolyfillSupport;
be == null || be(ae, ne), (te.litHtmlVersions ?? (te.litHtmlVersions = [])).push("3.3.3");
const oo = (e, t, o) => {
  const i = (o == null ? void 0 : o.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const a = (o == null ? void 0 : o.renderBefore) ?? null;
    i._$litPart$ = r = new ne(t.insertBefore(ie(), a), a, void 0, o ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis;
class j extends G {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var o;
    const t = super.createRenderRoot();
    return (o = this.renderOptions).renderBefore ?? (o.renderBefore = t.firstChild), t;
  }
  update(t) {
    const o = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = oo(o, this.renderRoot, this.renderOptions);
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
    return V;
  }
}
var mt;
j._$litElement$ = !0, j.finalized = !0, (mt = R.litElementHydrateSupport) == null || mt.call(R, { LitElement: j });
const we = R.litElementPolyfillSupport;
we == null || we({ LitElement: j });
(R.litElementVersions ?? (R.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const At = (e) => (t, o) => {
  o !== void 0 ? o.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const io = { attribute: !0, type: String, converter: ue, reflect: !1, hasChanged: Ie }, ro = (e = io, t, o) => {
  const { kind: i, metadata: r } = o;
  let a = globalThis.litPropertyMetadata.get(r);
  if (a === void 0 && globalThis.litPropertyMetadata.set(r, a = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(o.name, e), i === "accessor") {
    const { name: n } = o;
    return { set(s) {
      const l = t.get.call(this);
      t.set.call(this, s), this.requestUpdate(n, l, e, !0, s);
    }, init(s) {
      return s !== void 0 && this.C(n, void 0, e, s), s;
    } };
  }
  if (i === "setter") {
    const { name: n } = o;
    return function(s) {
      const l = this[n];
      t.call(this, s), this.requestUpdate(n, l, e, !0, s);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ao(e) {
  return (t, o) => typeof o == "object" ? ro(e, t, o) : ((i, r, a) => {
    const n = r.hasOwnProperty(a);
    return r.constructor.createProperty(a, i), n ? Object.getOwnPropertyDescriptor(r, a) : void 0;
  })(e, t, o);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(e) {
  return ao({ ...e, state: !0, attribute: !1 });
}
const oe = {
  type: "custom:nexus-energy-card",
  title: "Nexus Energy",
  mode: "power",
  range: "today",
  show_time_selector: !0,
  animation: !0,
  animation_speed: 1,
  line_width_base: 1.5,
  visual_scale: 1,
  overflow_tolerance: 5,
  language: "auto",
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
}, B = {
  title: "Nexus Energy",
  mode: "power",
  range: "today",
  show_time_selector: !0,
  animation: !0,
  animation_speed: 1,
  line_width_base: 1.5,
  visual_scale: 1,
  overflow_tolerance: 5,
  language: "auto",
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
}, no = /* @__PURE__ */ new Set(["w", "kw"]), so = /* @__PURE__ */ new Set(["wh", "kwh"]);
function lo(e, t, o) {
  const i = t && e ? e.states[t] : void 0, r = Number.parseFloat(String((i == null ? void 0 : i.state) ?? "0").replace(",", ".")), n = String((i == null ? void 0 : i.attributes.unit_of_measurement) ?? (o === "power" ? "kW" : "kWh")).toLowerCase(), s = Number.isFinite(r) ? r : 0;
  return o === "power" && no.has(n) ? {
    value: n === "w" ? Math.abs(s) / 1e3 : Math.abs(s),
    rawValue: n === "w" ? s / 1e3 : s,
    unit: "kW",
    state: i
  } : o === "energy" && so.has(n) ? {
    value: n === "wh" ? Math.abs(s) / 1e3 : Math.abs(s),
    rawValue: n === "wh" ? s / 1e3 : s,
    unit: "kWh",
    state: i
  } : {
    value: Math.abs(s),
    rawValue: s,
    unit: o === "power" ? "kW" : "kWh",
    state: i
  };
}
function St(e) {
  const [, t = e] = e.split(".");
  return t.split("_").filter(Boolean).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ");
}
function le(e, t, o = 2) {
  return t === "power" ? Math.abs(e) < 1 ? `${Math.round(e * 1e3)} W` : `${e.toFixed(o)} kW` : Math.abs(e) < 1 ? `${Math.round(e * 1e3)} Wh` : `${e.toFixed(o)} kWh`;
}
function X(e) {
  return Number.isFinite(e) ? `${Math.round(e * 100)}%` : "0%";
}
const Ct = ["en", "es", "zh", "fr", "de", "hi", "it", "ru"], co = {
  auto: "Automatic (System)",
  en: "English",
  es: "Español",
  zh: "中文",
  fr: "Français",
  de: "Deutsch",
  hi: "हिन्दी",
  it: "Italiano",
  ru: "Русский"
}, Je = {
  en: {
    active: "Active",
    balance: "Balance",
    currentConsumption: "Current consumption",
    energySummary: "Energy summary",
    exporting: "Exporting",
    expandCollapse: "Expand or collapse",
    frequency: "Frequency",
    historyFromHomeAssistant: "Immediate history from Home Assistant",
    historyLoadError: "Could not load HA history",
    loadingHaHistory: "Loading Home Assistant history",
    localHistoryUntilHa: "Local history until HA data arrives",
    noHistorySamples: "No history samples available",
    now: "Now",
    of: "of",
    ofTotal: "of total",
    overflowPlural: "overflows",
    overflowSingular: "overflow",
    overflowStatus: "Overflow",
    powerFactor: "Power factor",
    restPrefix: "Rest of",
    reverseFlow: "Reverse flow",
    solarAutonomy: "Solar autonomy",
    standby: "Standby",
    supplying: "Supplying",
    systemNormal: "System normal",
    tooltipDetail: "Details for",
    totalInHome: "Total home",
    voltage: "Voltage"
  },
  es: {
    active: "Activo",
    balance: "Balance",
    currentConsumption: "Consumo actual",
    energySummary: "Resumen energético",
    exporting: "Exportando",
    expandCollapse: "Expandir o colapsar",
    frequency: "Frecuencia",
    historyFromHomeAssistant: "Historial inmediato desde Home Assistant",
    historyLoadError: "No se pudo cargar el historial de HA",
    loadingHaHistory: "Cargando historial de Home Assistant",
    localHistoryUntilHa: "Historial local hasta recibir datos de HA",
    noHistorySamples: "Sin muestras históricas disponibles",
    now: "Ahora",
    of: "de",
    ofTotal: "del total",
    overflowPlural: "overflows",
    overflowSingular: "overflow",
    overflowStatus: "Desbordamiento",
    powerFactor: "Factor de potencia",
    restPrefix: "Resto",
    reverseFlow: "Flujo inverso",
    solarAutonomy: "Autonomía solar",
    standby: "Standby",
    supplying: "Aportando",
    systemNormal: "Sistema normal",
    tooltipDetail: "Detalle de",
    totalInHome: "Total en casa",
    voltage: "Voltaje"
  },
  zh: {
    active: "运行中",
    balance: "平衡",
    currentConsumption: "当前消耗",
    energySummary: "能源摘要",
    exporting: "正在输出",
    expandCollapse: "展开或折叠",
    frequency: "频率",
    historyFromHomeAssistant: "来自 Home Assistant 的即时历史",
    historyLoadError: "无法加载 HA 历史",
    loadingHaHistory: "正在加载 Home Assistant 历史",
    localHistoryUntilHa: "本地历史，等待 HA 数据",
    noHistorySamples: "没有可用历史样本",
    now: "现在",
    of: "占",
    ofTotal: "占总量",
    overflowPlural: "溢出",
    overflowSingular: "溢出",
    overflowStatus: "溢出",
    powerFactor: "功率因数",
    restPrefix: "剩余",
    reverseFlow: "反向流",
    solarAutonomy: "太阳能自给率",
    standby: "待机",
    supplying: "供电中",
    systemNormal: "系统正常",
    tooltipDetail: "详情",
    totalInHome: "全屋总计",
    voltage: "电压"
  },
  fr: {
    active: "Actif",
    balance: "Balance",
    currentConsumption: "Consommation actuelle",
    energySummary: "Résumé énergétique",
    exporting: "Exportation",
    expandCollapse: "Développer ou réduire",
    frequency: "Fréquence",
    historyFromHomeAssistant: "Historique immédiat depuis Home Assistant",
    historyLoadError: "Impossible de charger l'historique HA",
    loadingHaHistory: "Chargement de l'historique Home Assistant",
    localHistoryUntilHa: "Historique local en attendant les données HA",
    noHistorySamples: "Aucun échantillon historique disponible",
    now: "Maintenant",
    of: "de",
    ofTotal: "du total",
    overflowPlural: "débordements",
    overflowSingular: "débordement",
    overflowStatus: "Débordement",
    powerFactor: "Facteur de puissance",
    restPrefix: "Reste de",
    reverseFlow: "Flux inverse",
    solarAutonomy: "Autonomie solaire",
    standby: "Veille",
    supplying: "Alimentation",
    systemNormal: "Système normal",
    tooltipDetail: "Détail de",
    totalInHome: "Total maison",
    voltage: "Tension"
  },
  de: {
    active: "Aktiv",
    balance: "Bilanz",
    currentConsumption: "Aktueller Verbrauch",
    energySummary: "Energieübersicht",
    exporting: "Exportiert",
    expandCollapse: "Erweitern oder einklappen",
    frequency: "Frequenz",
    historyFromHomeAssistant: "Sofortverlauf aus Home Assistant",
    historyLoadError: "HA-Verlauf konnte nicht geladen werden",
    loadingHaHistory: "Home Assistant Verlauf wird geladen",
    localHistoryUntilHa: "Lokaler Verlauf bis HA-Daten eintreffen",
    noHistorySamples: "Keine Verlaufswerte verfügbar",
    now: "Jetzt",
    of: "von",
    ofTotal: "vom Gesamtwert",
    overflowPlural: "Überläufe",
    overflowSingular: "Überlauf",
    overflowStatus: "Überlauf",
    powerFactor: "Leistungsfaktor",
    restPrefix: "Rest von",
    reverseFlow: "Rückfluss",
    solarAutonomy: "Solarautarkie",
    standby: "Standby",
    supplying: "Liefert",
    systemNormal: "System normal",
    tooltipDetail: "Details zu",
    totalInHome: "Haus gesamt",
    voltage: "Spannung"
  },
  hi: {
    active: "सक्रिय",
    balance: "संतुलन",
    currentConsumption: "वर्तमान खपत",
    energySummary: "ऊर्जा सारांश",
    exporting: "निर्यात",
    expandCollapse: "फैलाएं या समेटें",
    frequency: "आवृत्ति",
    historyFromHomeAssistant: "Home Assistant से ताज़ा इतिहास",
    historyLoadError: "HA इतिहास लोड नहीं हो सका",
    loadingHaHistory: "Home Assistant इतिहास लोड हो रहा है",
    localHistoryUntilHa: "HA डेटा आने तक स्थानीय इतिहास",
    noHistorySamples: "कोई इतिहास नमूना उपलब्ध नहीं",
    now: "अभी",
    of: "का",
    ofTotal: "कुल का",
    overflowPlural: "ओवरफ्लो",
    overflowSingular: "ओवरफ्लो",
    overflowStatus: "ओवरफ्लो",
    powerFactor: "पावर फैक्टर",
    restPrefix: "शेष",
    reverseFlow: "उल्टा प्रवाह",
    solarAutonomy: "सौर स्वायत्तता",
    standby: "स्टैंडबाय",
    supplying: "आपूर्ति",
    systemNormal: "सिस्टम सामान्य",
    tooltipDetail: "विवरण",
    totalInHome: "घर कुल",
    voltage: "वोल्टेज"
  },
  it: {
    active: "Attivo",
    balance: "Bilancio",
    currentConsumption: "Consumo attuale",
    energySummary: "Riepilogo energia",
    exporting: "Esportazione",
    expandCollapse: "Espandi o comprimi",
    frequency: "Frequenza",
    historyFromHomeAssistant: "Cronologia immediata da Home Assistant",
    historyLoadError: "Impossibile caricare la cronologia HA",
    loadingHaHistory: "Caricamento cronologia Home Assistant",
    localHistoryUntilHa: "Cronologia locale in attesa dei dati HA",
    noHistorySamples: "Nessun campione storico disponibile",
    now: "Ora",
    of: "di",
    ofTotal: "del totale",
    overflowPlural: "overflow",
    overflowSingular: "overflow",
    overflowStatus: "Overflow",
    powerFactor: "Fattore di potenza",
    restPrefix: "Resto di",
    reverseFlow: "Flusso inverso",
    solarAutonomy: "Autonomia solare",
    standby: "Standby",
    supplying: "In erogazione",
    systemNormal: "Sistema normale",
    tooltipDetail: "Dettaglio di",
    totalInHome: "Totale casa",
    voltage: "Tensione"
  },
  ru: {
    active: "Активно",
    balance: "Баланс",
    currentConsumption: "Текущее потребление",
    energySummary: "Сводка энергии",
    exporting: "Экспорт",
    expandCollapse: "Развернуть или свернуть",
    frequency: "Частота",
    historyFromHomeAssistant: "Последняя история из Home Assistant",
    historyLoadError: "Не удалось загрузить историю HA",
    loadingHaHistory: "Загрузка истории Home Assistant",
    localHistoryUntilHa: "Локальная история до получения данных HA",
    noHistorySamples: "Исторические значения недоступны",
    now: "Сейчас",
    of: "от",
    ofTotal: "от общего",
    overflowPlural: "переполнения",
    overflowSingular: "переполнение",
    overflowStatus: "Переполнение",
    powerFactor: "Коэффициент мощности",
    restPrefix: "Остаток",
    reverseFlow: "Обратный поток",
    solarAutonomy: "Солнечная автономия",
    standby: "Ожидание",
    supplying: "Подает",
    systemNormal: "Система в норме",
    tooltipDetail: "Детали",
    totalInHome: "Итого по дому",
    voltage: "Напряжение"
  }
};
function Nt(e, t) {
  if (e && e !== "auto" && Qe(e))
    return e;
  const o = String(t ?? "").toLowerCase().split(/[-_]/)[0];
  return Qe(o) ? o : "en";
}
function k(e, t) {
  var o;
  return ((o = Je[e]) == null ? void 0 : o[t]) ?? Je.en[t];
}
function Qe(e) {
  return Ct.includes(e);
}
const $e = 5e-4, ho = 64;
function uo(e) {
  const t = {
    ...B,
    ...e,
    thresholds: {
      ...B.thresholds,
      ...e.thresholds
    }
  };
  return (e.nodes || e.entities) && (t.nodes = e.nodes ?? po(e.entities ?? [])), e.sources && (t.sources = e.sources), t;
}
function po(e) {
  return [
    {
      id: "home",
      name: "Casa",
      icon: "mdi:home-outline",
      children: e.map((t) => ({
        id: t.replace(/\W+/g, "-"),
        entity: t,
        name: St(t)
      }))
    }
  ];
}
function et(e, t, o, i = /* @__PURE__ */ new Map()) {
  var E, $;
  const r = uo(e), a = {
    warning: ((E = r.thresholds) == null ? void 0 : E.warning) ?? 0.65,
    critical: (($ = r.thresholds) == null ? void 0 : $.critical) ?? 0.85
  }, n = fo(r.overflow_tolerance ?? 5) / 100, s = Nt(r.language, t == null ? void 0 : t.language), l = [], c = (g, v, N, M = "0") => {
    var De, Le;
    const Z = o === "energy" ? g.energy_entity ?? g.entity : g.power_entity ?? g.entity, U = g.id ?? Z ?? `node-${M}`, se = lo(t, Z, o), xe = g.invert_value ? -se.rawValue : se.rawValue, Rt = Math.abs(xe), Dt = g.children ?? [], f = {
      id: U,
      name: g.name ?? ((Le = (De = se.state) == null ? void 0 : De.attributes.friendly_name) == null ? void 0 : Le.toString()) ?? St(U),
      entity: Z,
      icon: g.icon ?? mo(v),
      role: v,
      value: Rt,
      rawValue: xe,
      unit: se.unit,
      capacity: g.capacity,
      percentOfParent: 0,
      severity: "normal",
      direction: _o(g.direction, xe),
      virtual: !1,
      overflow: !1,
      children: [],
      parent: N,
      color: g.color,
      history: []
    };
    f.children = Dt.map(
      (w, Y) => {
        var Ue;
        return c(w, (Ue = w.children) != null && Ue.length ? "hub" : "load", f, `${M}-${Y}`);
      }
    );
    const F = f.children.reduce((w, Y) => w + Y.value, 0);
    if (!g.entity && f.children.length > 0 && (f.value = F, f.rawValue = F), f.children.length > 0) {
      const w = F - f.value, Y = Math.max($e, f.value * n);
      w > Y ? (f.overflow = !0, f.severity = "overflow", l.push(f), typeof console < "u" && console.warn(
        `[nexus-energy-card] Overflow detected in ${f.name}: children=${F.toFixed(
          3
        )}${f.unit}, parent=${f.value.toFixed(3)}${f.unit}`
      ), f.children.push(Ae(f, 0, s))) : w > $e ? f.children.push(Ae(f, 0, s)) : f.value - F > Math.max($e, f.value * 5e-3) && f.children.push(Ae(f, f.value - F, s));
    }
    f.severity = f.overflow ? "overflow" : tt(f, a.warning, a.critical), f.history = xo(i, f);
    for (const w of f.children)
      w.percentOfParent = f.value > 0 ? w.value / f.value : 0, w.severity = w.overflow ? "overflow" : tt(w, a.warning, a.critical);
    return f;
  }, d = (r.nodes ?? []).map((g, v) => c(g, "hub", void 0, `root-${v}`)), h = d[0], p = (r.sources ?? []).map((g, v) => {
    const N = c(g, "source", h, `source-${v}`);
    return N.percentOfParent = h && h.value > 0 ? N.value / h.value : 0, N;
  }), u = [...p, ...go(d)], x = (h == null ? void 0 : h.value) ?? d.reduce((g, v) => g + v.value, 0), b = p.reduce((g, v) => g + v.value, 0), A = u.map((g) => `${g.id}:${g.name}:${g.rawValue.toFixed(4)}:${g.children.length}`).join("|");
  return {
    sources: p,
    roots: d,
    primaryRoot: h,
    allNodes: u,
    overflowNodes: l,
    total: x,
    sourceTotal: b,
    signature: A
  };
}
function go(e) {
  const t = [], o = (i) => {
    t.push(i), i.children.forEach(o);
  };
  return e.forEach(o), t;
}
function fo(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : 5;
}
function Ae(e, t, o) {
  return {
    id: `${e.id}__rest`,
    name: `${k(o, "restPrefix")} ${e.name}`,
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
    history: Me(`${e.id}__rest`, Math.max(0, t))
  };
}
function mo(e) {
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
function _o(e, t) {
  return e === "export" ? "reverse" : e === "import" ? "forward" : t < 0 ? "reverse" : "forward";
}
function tt(e, t, o) {
  if (!e.capacity || e.capacity <= 0)
    return e.percentOfParent >= o ? "critical" : e.percentOfParent >= t ? "warning" : "normal";
  const i = e.value / e.capacity;
  return i >= o ? "critical" : i >= t ? "warning" : "normal";
}
function xo(e, t) {
  if (!t.entity)
    return Me(t.id, t.value);
  const o = e.get(t.entity) ?? Me(t.entity, t.value).slice(0, 18), i = o.at(-1);
  for ((i === void 0 || Math.abs(i - t.value) > Math.max(1e-3, t.value * 5e-3)) && o.push(t.value); o.length > ho; )
    o.shift();
  return e.set(t.entity, o), [...o];
}
function Me(e, t) {
  let o = 0;
  for (let i = 0; i < e.length; i += 1)
    o = o * 31 + e.charCodeAt(i) >>> 0;
  return Array.from({ length: 32 }, (i, r) => {
    const a = Math.sin(r / 3 + o % 17) * 0.16, n = Math.cos(r / 7 + o % 11) * 0.08;
    return Math.max(0, t * (0.9 + a + n));
  });
}
function vo(e) {
  var t = 0, o = e.children, i = o && o.length;
  if (!i) t = 1;
  else for (; --i >= 0; ) t += o[i].value;
  e.value = t;
}
function yo() {
  return this.eachAfter(vo);
}
function bo(e, t) {
  let o = -1;
  for (const i of this)
    e.call(t, i, ++o, this);
  return this;
}
function wo(e, t) {
  for (var o = this, i = [o], r, a, n = -1; o = i.pop(); )
    if (e.call(t, o, ++n, this), r = o.children)
      for (a = r.length - 1; a >= 0; --a)
        i.push(r[a]);
  return this;
}
function $o(e, t) {
  for (var o = this, i = [o], r = [], a, n, s, l = -1; o = i.pop(); )
    if (r.push(o), a = o.children)
      for (n = 0, s = a.length; n < s; ++n)
        i.push(a[n]);
  for (; o = r.pop(); )
    e.call(t, o, ++l, this);
  return this;
}
function Ao(e, t) {
  let o = -1;
  for (const i of this)
    if (e.call(t, i, ++o, this))
      return i;
}
function So(e) {
  return this.eachAfter(function(t) {
    for (var o = +e(t.data) || 0, i = t.children, r = i && i.length; --r >= 0; ) o += i[r].value;
    t.value = o;
  });
}
function Co(e) {
  return this.eachBefore(function(t) {
    t.children && t.children.sort(e);
  });
}
function No(e) {
  for (var t = this, o = Ho(t, e), i = [t]; t !== o; )
    t = t.parent, i.push(t);
  for (var r = i.length; e !== o; )
    i.splice(r, 0, e), e = e.parent;
  return i;
}
function Ho(e, t) {
  if (e === t) return e;
  var o = e.ancestors(), i = t.ancestors(), r = null;
  for (e = o.pop(), t = i.pop(); e === t; )
    r = e, e = o.pop(), t = i.pop();
  return r;
}
function Eo() {
  for (var e = this, t = [e]; e = e.parent; )
    t.push(e);
  return t;
}
function Mo() {
  return Array.from(this);
}
function To() {
  var e = [];
  return this.eachBefore(function(t) {
    t.children || e.push(t);
  }), e;
}
function ko() {
  var e = this, t = [];
  return e.each(function(o) {
    o !== e && t.push({ source: o.parent, target: o });
  }), t;
}
function* Io() {
  var e = this, t, o = [e], i, r, a;
  do
    for (t = o.reverse(), o = []; e = t.pop(); )
      if (yield e, i = e.children)
        for (r = 0, a = i.length; r < a; ++r)
          o.push(i[r]);
  while (o.length);
}
function Oe(e, t) {
  e instanceof Map ? (e = [void 0, e], t === void 0 && (t = zo)) : t === void 0 && (t = Oo);
  for (var o = new ge(e), i, r = [o], a, n, s, l; i = r.pop(); )
    if ((n = t(i.data)) && (l = (n = Array.from(n)).length))
      for (i.children = n, s = l - 1; s >= 0; --s)
        r.push(a = n[s] = new ge(n[s])), a.parent = i, a.depth = i.depth + 1;
  return o.eachBefore(Do);
}
function Po() {
  return Oe(this).eachBefore(Ro);
}
function Oo(e) {
  return e.children;
}
function zo(e) {
  return Array.isArray(e) ? e[1] : null;
}
function Ro(e) {
  e.data.value !== void 0 && (e.value = e.data.value), e.data = e.data.data;
}
function Do(e) {
  var t = 0;
  do
    e.height = t;
  while ((e = e.parent) && e.height < ++t);
}
function ge(e) {
  this.data = e, this.depth = this.height = 0, this.parent = null;
}
ge.prototype = Oe.prototype = {
  constructor: ge,
  count: yo,
  each: bo,
  eachAfter: $o,
  eachBefore: wo,
  find: Ao,
  sum: So,
  sort: Co,
  path: No,
  ancestors: Eo,
  descendants: Mo,
  leaves: To,
  links: ko,
  copy: Po,
  [Symbol.iterator]: Io
};
const Lo = 228, Uo = 54, Fo = 164, Wo = 174, Go = 203, Bo = 308, jo = 39, Ht = 12, Vo = 24, qo = Ht, Zo = 12, Yo = 0, Ko = 6, Xo = 30, Jo = 105, Qo = 48, ei = 51, ti = 225, oi = 225, ii = 9, ri = 15, ai = 18, ni = 47, si = 44, li = 210, ci = 165;
function di(e) {
  const t = Number(e), o = Number.isFinite(t) ? It(t, 0.5, 1.5) : 1;
  return {
    scale: o,
    deviceNodeWidth: Lo * o,
    deviceNodeHeight: Uo * o,
    sourceNodeMinWidth: Fo * o,
    sourceNodeMaxWidth: Wo * o,
    rootNodeWidth: Go * o,
    rootNodeHeight: Bo * o,
    horizontalColumnGap: jo * o,
    horizontalSiblingGap: Ht * o,
    horizontalGroupGap: Vo * o,
    horizontalSourceGap: qo * o,
    compactOuterPadding: Zo * o,
    compactChildSidePadding: Yo * o,
    compactGridGap: Ko * o,
    compactSectionGap: Xo * o,
    compactNodeMinWidth: Jo * o,
    compactNodeHeight: Qo * o,
    compactSourceHeight: ei * o,
    compactRootMaxWidth: ti * o,
    compactRootHeight: oi * o,
    ultraOuterPadding: ii * o,
    ultraChildSidePadding: ri * o,
    ultraSectionGap: ai * o,
    ultraNodeHeight: ni * o,
    ultraSourceHeight: si * o,
    ultraRootMaxWidth: li * o,
    ultraRootHeight: ci * o
  };
}
function hi(e, t) {
  const o = di(t.scale), i = Math.max(280, t.width), r = Math.max(390 * o.scale, t.height), a = gi(e.sources, i, r, t.orientation, t.hideZeroNodes ?? !1, o), n = e.primaryRoot;
  if (!n)
    return {
      orientation: t.orientation,
      width: i,
      height: r,
      nodes: a,
      sources: a,
      edges: []
    };
  if (t.orientation === "vertical" || t.orientation === "stacked") {
    const d = fi(n, i, a, t, o), h = d.find((u) => u.id === n.id), p = ot(a, d, h, t.orientation);
    return {
      orientation: t.orientation,
      width: i,
      height: Math.max(r, Math.max(...d.map((u) => u.y + u.height + 24 * o.scale), 0)),
      nodes: [...a, ...d],
      sources: a,
      primaryRoot: h,
      edges: p
    };
  }
  const s = mi(n, i, r, a, t, o), l = s.find((d) => d.id === n.id), c = ot(a, s, l, t.orientation);
  return {
    orientation: t.orientation,
    width: i,
    height: Math.max(r, Math.max(...s.map((d) => d.y + d.height + 24 * o.scale), 0)),
    nodes: [...a, ...s],
    sources: a,
    primaryRoot: l,
    edges: c
  };
}
function ui(e, t) {
  const o = rt(e.from, t, "out", e.fromSlot, e.fromSlotCount), i = rt(e.to, t, "in", e.toSlot, e.toSlotCount);
  if (t === "horizontal") {
    const a = (i.x - o.x) / 2;
    return `M ${o.x} ${o.y} C ${o.x + a} ${o.y}, ${i.x - a} ${i.y}, ${i.x} ${i.y}`;
  }
  if (t === "stacked") {
    if (e.from.role === "source" || e.to.depth === 0) {
      const a = Math.min(21, Math.abs(i.y - o.y) * 0.42);
      return `M ${o.x} ${o.y} C ${o.x} ${o.y + a}, ${i.x} ${i.y - a}, ${i.x} ${i.y}`;
    }
    return _i(o, i);
  }
  const r = Math.abs(i.y - o.y) * 0.45;
  return `M ${o.x} ${o.y} C ${o.x} ${o.y + r}, ${i.x} ${i.y - r}, ${i.x} ${i.y}`;
}
function fe(e) {
  return {
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  };
}
function Et(e, t, o, i) {
  if (e.children.length === 0 || o.has(e.id))
    return !1;
  const r = pi(e);
  return t.has(e.id) ? !0 : r < i;
}
function pi(e) {
  let t = 0, o = e.parent;
  for (; o; )
    t += 1, o = o.parent;
  return t;
}
function gi(e, t, o, i, r, a) {
  const n = r ? e.filter((p) => p.value > 1e-3) : e;
  if (i === "horizontal") {
    const p = Math.min(a.sourceNodeMaxWidth, Math.max(a.sourceNodeMinWidth, t * 0.16)), u = 84 * a.scale, x = a.horizontalSourceGap, b = n.length * u + Math.max(0, n.length - 1) * x, A = Math.max(87 * a.scale, (o - b) / 2);
    return n.map((E, $) => ({
      ...E,
      x: 24 * a.scale,
      y: A + $ * (u + x),
      width: p,
      height: u,
      depth: 0,
      visibleChildren: []
    }));
  }
  if (i === "stacked") {
    const p = Math.min(210 * a.scale, Math.max(a.compactNodeMinWidth, t - a.ultraOuterPadding * 2)), u = a.ultraSourceHeight;
    return n.map((x, b) => ({
      ...x,
      x: (t - p) / 2,
      y: 16 * a.scale + b * (u + a.compactGridGap),
      width: p,
      height: u,
      depth: 0,
      visibleChildren: []
    }));
  }
  const s = 10 * a.scale, l = Math.max(a.compactNodeMinWidth, t - a.compactOuterPadding * 2), c = l >= a.compactNodeMinWidth * 2 + s ? Math.min(2, Math.max(1, n.length)) : 1, d = Math.floor((l - s * (c - 1)) / c), h = a.compactSourceHeight;
  return n.map((p, u) => ({
    ...p,
    x: c === 1 ? (t - d) / 2 : a.compactOuterPadding + u % c * (d + s),
    y: 20 * a.scale + Math.floor(u / c) * (h + s),
    width: d,
    height: h,
    depth: 0,
    visibleChildren: []
  }));
}
function fi(e, t, o, i, r) {
  const a = [], n = o.length ? Math.max(...o.map((x) => x.y + x.height)) : 20 * r.scale, s = i.orientation === "stacked", l = s ? r.ultraSectionGap : r.compactSectionGap;
  let c = n + l;
  const d = s ? r.ultraOuterPadding : r.compactOuterPadding, h = Math.min(s ? r.ultraRootMaxWidth : r.compactRootMaxWidth, t - d * 2), p = s ? r.ultraRootHeight : r.compactRootHeight, u = {
    ...e,
    x: (t - h) / 2,
    y: c,
    width: h,
    height: p,
    depth: 0,
    visibleChildren: []
  };
  return a.push(u), c += p + l, Mt(e, u, c, 1, t, i, a, r), a;
}
function Mt(e, t, o, i, r, a, n, s) {
  const l = ze(e, a);
  if (l.length === 0)
    return o;
  const c = a.orientation === "stacked", d = s.compactGridGap, h = c ? s.ultraNodeHeight : s.compactNodeHeight, p = c ? 0 : Math.min(20 * s.scale, Math.max(0, i - 1) * 8 * s.scale), u = c ? s.ultraChildSidePadding : s.compactChildSidePadding, x = Math.max(s.compactNodeMinWidth, r - u * 2 - p * 2), b = c ? 1 : x >= s.compactNodeMinWidth * 2 + d ? 2 : 1, A = Math.floor((x - d * (b - 1)) / b), E = (r - (A * b + d * (b - 1))) / 2;
  let $ = o;
  for (let g = 0; g < l.length; g += b) {
    const N = l.slice(g, g + b).map((M, Z) => {
      const U = {
        ...M,
        x: E + Z * (A + d),
        y: $,
        width: A,
        height: h,
        depth: i,
        visibleChildren: []
      };
      return n.push(U), t.visibleChildren.push(U), { source: M, node: U };
    });
    $ += h + d;
    for (const M of N)
      Et(M.source, a.expandedIds, a.collapsedIds, a.defaultExpandedDepth) && ($ = Mt(M.source, M.node, $ + d, i + 1, r, a, n, s));
  }
  return $;
}
function mi(e, t, o, i, r, a) {
  const n = Oe(e, (v) => ze(v, r)), s = Math.max(1, n.height), l = Math.min(42 * a.scale, Math.max(24 * a.scale, t * 0.025)), c = t - l - a.deviceNodeWidth, d = /* @__PURE__ */ new Map();
  for (let v = 1; v <= s; v += 1)
    d.set(v, c - (s - v) * (a.deviceNodeWidth + a.horizontalColumnGap));
  const h = d.get(1) ?? c, p = i.reduce((v, N) => Math.max(v, N.x + N.width), 0), u = (p + h - a.rootNodeWidth) / 2, x = p + a.horizontalColumnGap, b = h - a.rootNodeWidth - a.horizontalColumnGap, A = It(u, x, b), E = Tt(e, 0, r, a), $ = Math.max(21 * a.scale, (o - E.subtreeHeight) / 2), g = [];
  return kt(E, $, A, d, g, a), g;
}
function Tt(e, t, o, i) {
  const r = ze(e, o).map((c) => Tt(c, t + 1, o, i)), a = t === 0 ? i.rootNodeWidth : i.deviceNodeWidth, n = t === 0 ? i.rootNodeHeight : i.deviceNodeHeight, s = t === 0 ? i.horizontalGroupGap : i.horizontalSiblingGap, l = r.length > 0 ? r.reduce((c, d) => c + d.subtreeHeight, 0) + Math.max(0, r.length - 1) * s : 0;
  return {
    node: e,
    children: r,
    depth: t,
    width: a,
    height: n,
    subtreeHeight: Math.max(n, l),
    y: 0
  };
}
function kt(e, t, o, i, r, a) {
  const n = e.depth === 0 ? o : i.get(e.depth) ?? o + e.depth * (a.deviceNodeWidth + a.horizontalColumnGap), s = {
    ...e.node,
    x: n,
    y: 0,
    width: e.width,
    height: e.height,
    depth: e.depth,
    visibleChildren: []
  };
  if (r.push(s), e.children.length > 0) {
    const c = e.depth === 0 ? a.horizontalGroupGap : a.horizontalSiblingGap, d = e.children.reduce((p, u) => p + u.subtreeHeight, 0) + Math.max(0, e.children.length - 1) * c;
    let h = t + (e.subtreeHeight - d) / 2;
    for (const p of e.children) {
      const u = kt(p, h, o, i, r, a);
      s.visibleChildren.push(u), h += p.subtreeHeight + c;
    }
  }
  const l = s.visibleChildren.length > 0 ? (fe(s.visibleChildren[0]).y + fe(s.visibleChildren[s.visibleChildren.length - 1]).y) / 2 : t + e.subtreeHeight / 2;
  return s.y = l - e.height / 2, s;
}
function ze(e, t) {
  return Et(e, t.expandedIds, t.collapsedIds, t.defaultExpandedDepth) ? t.hideZeroNodes ? e.children.filter((o) => o.value > 1e-3 || o.children.length > 0) : e.children : [];
}
function It(e, t, o) {
  return t > o ? (t + o) / 2 : Math.min(o, Math.max(t, e));
}
function ot(e, t, o, i) {
  const r = [];
  if (o) {
    const a = it(e, i);
    for (const [n, s] of a.entries())
      r.push({
        id: `${s.id}->${o.id}`,
        from: s,
        to: o,
        fromSlot: 0,
        fromSlotCount: 1,
        toSlot: n,
        toSlotCount: a.length,
        value: s.value,
        percent: s.percentOfParent,
        severity: s.severity,
        direction: s.direction
      });
  }
  for (const a of t) {
    const n = it(a.visibleChildren, i);
    for (const [s, l] of n.entries())
      r.push({
        id: `${a.id}->${l.id}`,
        from: a,
        to: l,
        fromSlot: s,
        fromSlotCount: a.visibleChildren.length,
        toSlot: 0,
        toSlotCount: 1,
        value: l.value,
        percent: l.percentOfParent,
        severity: l.severity,
        direction: l.direction
      });
  }
  return r;
}
function it(e, t) {
  return [...e].sort((o, i) => {
    const r = fe(o), a = fe(i);
    return t === "horizontal" || t === "stacked" ? r.y - a.y || r.x - a.x : r.x - a.x || r.y - a.y;
  });
}
function rt(e, t, o, i = 0, r = 1) {
  const a = r <= 1 ? 0.5 : (i + 1) / (r + 1);
  return t === "horizontal" ? {
    x: o === "out" ? e.x + e.width : e.x,
    y: e.y + e.height * a
  } : t === "stacked" ? o === "out" ? {
    x: e.x + e.width / 2,
    y: e.y + e.height
  } : e.depth === 0 && e.role !== "source" ? {
    x: e.x + e.width / 2,
    y: e.y
  } : {
    x: e.x,
    y: e.y + e.height / 2
  } : {
    x: e.x + e.width * a,
    y: o === "out" ? e.y + e.height : e.y
  };
}
function _i(e, t) {
  const o = Math.max(5, Math.min(e.x, t.x) - 11), i = Math.max(14, t.y - e.y), r = e.y + Math.min(17, i * 0.26), a = Math.max(
    2,
    Math.min(6, Math.abs(e.x - o) / 2, Math.abs(t.x - o) / 2, Math.abs(t.y - r) / 3)
  );
  return [
    `M ${e.x} ${e.y}`,
    `L ${e.x} ${r - a}`,
    `Q ${e.x} ${r} ${e.x - a} ${r}`,
    `L ${o + a} ${r}`,
    `Q ${o} ${r} ${o} ${r + a}`,
    `L ${o} ${t.y - a}`,
    `Q ${o} ${t.y} ${o + a} ${t.y}`,
    `L ${t.x} ${t.y}`
  ].join(" ");
}
const Se = 1.5, xi = 7.5, ce = 0.05, at = 2.25, vi = 13.5;
function yi(e, t, o, i, r = Se) {
  const a = Ce(r, 0.75, 6), n = a + (xi - Se), s = Math.max(2, a + (at - Se)), l = s + (vi - at);
  if (o === "energy") {
    const d = Ce(i, 0, 1);
    return nt(s + d * (l - s));
  }
  if (e <= ce || t <= ce)
    return a;
  const c = Math.log1p(Math.max(0, e - ce)) / Math.log1p(Math.max(1e-3, t - ce));
  return nt(a + Ce(c, 0, 1) * (n - a));
}
function Ce(e, t, o) {
  return Math.min(o, Math.max(t, e));
}
function nt(e) {
  return Math.round(e * 100) / 100;
}
const bi = 0.5, wi = 1.5, Pt = 1;
function Re(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(wi, Math.max(bi, t)) : Pt;
}
function $i(e) {
  return Math.round(Re(e) * 100);
}
function Ai(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Re(t / 100) : Pt;
}
var Si = Object.defineProperty, Ci = Object.getOwnPropertyDescriptor, T = (e, t, o, i) => {
  for (var r = i > 1 ? void 0 : i ? Ci(t, o) : t, a = e.length - 1, n; a >= 0; a--)
    (n = e[a]) && (r = (i ? n(t, o, r) : n(r)) || r);
  return i && r && Si(t, o, r), r;
};
const st = 1, Ni = 250, lt = 6e4, Hi = 189, Ei = 158, ct = 600, Ne = 380, dt = 20, Mi = 100, Ti = 540, ki = 390, Ii = 360, Pi = 46, Oi = 20, zi = 18;
let S = class extends j {
  constructor() {
    super(...arguments), this._config = B, this._graph = et(B, void 0, "power"), this._mode = "power", this._width = 1180, this._breakpoint = "wide", this._expandedIds = /* @__PURE__ */ new Set(), this._collapsedIds = /* @__PURE__ */ new Set(), this._historyCache = /* @__PURE__ */ new Map(), this._tooltipHistoryCache = /* @__PURE__ */ new Map(), this._lastValues = /* @__PURE__ */ new Map(), this._pendingHostWidth = 1180, this._tooltipRequestId = 0, this._clearTooltip = () => {
      window.clearTimeout(this._tooltipTimer), this._tooltipRequestId += 1, this._tooltip = void 0;
    };
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Yi), document.createElement("nexus-energy-card-editor");
  }
  static getStubConfig() {
    return {
      ...oe,
      thresholds: {
        ...oe.thresholds
      },
      sources: [],
      nodes: []
    };
  }
  setConfig(e) {
    if (!e.entities && !e.nodes && !e.sources)
      throw new Error("Missing minimum 'entities', 'sources', or 'nodes' parameters.");
    const t = { ...e };
    delete t.height, this._config = {
      ...B,
      ...t,
      thresholds: {
        ...B.thresholds,
        ...t.thresholds
      }
    }, this._mode = "power", this._restoreBranchState(), this._rebuildGraph(!0), this._scheduleResize(this.getBoundingClientRect().width || this._width, 0);
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
    "ResizeObserver" in window && (this._resizeObserver = new ResizeObserver(([e]) => {
      this._scheduleResize(e.contentRect.width);
    }), this._resizeObserver.observe(this)), this._scheduleResize(this.getBoundingClientRect().width || this._width, 0);
  }
  _scheduleResize(e, t = Mi) {
    !Number.isFinite(e) || e <= 0 || (this._pendingHostWidth = Math.max(1, Math.round(e)), window.clearTimeout(this._resizeTimer), this._resizeTimer = window.setTimeout(() => {
      const o = this._pendingHostWidth, i = this._nextBreakpoint(o), r = this._contentWidthForBreakpoint(o, i);
      this._width !== r && (this._width = r), this._breakpoint !== i && (this._breakpoint = i);
    }, t));
  }
  _nextBreakpoint(e) {
    return this._breakpoint === "ultra-compact" ? e >= Ne + dt ? "compact" : "ultra-compact" : this._breakpoint === "compact" ? e <= Ne ? "ultra-compact" : e >= ct + dt ? "wide" : "compact" : e <= Ne ? "ultra-compact" : e <= ct ? "compact" : "wide";
  }
  _contentWidthForBreakpoint(e, t) {
    const o = this._visualScale();
    return Math.max(280, Math.round(e - (t === "ultra-compact" ? zi : t === "compact" ? Oi : Pi) * o));
  }
  _visualScale() {
    return Re(this._config.visual_scale);
  }
  _language() {
    var e;
    return Nt(this._config.language, (e = this._hass) == null ? void 0 : e.language);
  }
  _t(e) {
    return k(this._language(), e);
  }
  _tooltipWidth() {
    return Hi * this._visualScale();
  }
  _tooltipHeight() {
    return Ei * this._visualScale();
  }
  render() {
    const e = this._visualScale(), t = this._language(), o = this._breakpoint === "ultra-compact" ? "stacked" : this._breakpoint === "compact" ? "vertical" : "horizontal", i = o === "stacked" ? Ii : o === "vertical" ? ki : Ti, r = hi(this._graph, {
      width: this._width,
      height: i * e,
      orientation: o,
      expandedIds: this._expandedIds,
      collapsedIds: this._collapsedIds,
      defaultExpandedDepth: this._config.default_expanded_depth ?? 2,
      hideZeroNodes: this._config.hide_zero_nodes ?? !1,
      scale: e
    }), a = r.primaryRoot, n = this._graph.sources.filter((c) => this._isSolarSource(c)), s = n.length > 0, l = s && this._graph.total > 0 ? Math.min(1, n.reduce((c, d) => c + d.value, 0) / this._graph.total) : 0;
    return m`
      <ha-card class=${`nexus-shell bg-${this._config.background_style ?? "glass"}`} style=${`--nexus-scale:${e};`}>
        <section class=${`nexus-card-frame ${this._breakpoint}`} data-breakpoint=${this._breakpoint} @pointerleave=${this._clearTooltip}>
          <header class="topbar">
            <div class="brand">
              <span class="brand-icon"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon></span>
              <div>
                <h2>${this._config.title ?? "Nexus Energy"}</h2>
                <p>
                  ${k(t, "totalInHome")}
                  <span class="live-dot"></span>
                  <strong>${k(t, "now")}</strong>
                </p>
              </div>
            </div>
          </header>

          <section class="summary-strip" aria-label=${k(t, "energySummary")}>
            <div class="primary-metric">
              <span>${k(t, "currentConsumption")}</span>
              <strong>${le(this._graph.total, this._mode, this._config.precision)}</strong>
            </div>
            <div class="health-pill ${this._graph.overflowNodes.length ? "warning" : ""}">
              <ha-icon icon=${this._graph.overflowNodes.length ? "mdi:alert-circle-outline" : "mdi:shield-check-outline"}></ha-icon>
              ${this._graph.overflowNodes.length ? `${this._graph.overflowNodes.length} ${k(
      t,
      this._graph.overflowNodes.length === 1 ? "overflowSingular" : "overflowPlural"
    )}` : k(t, "systemNormal")}
            </div>
          </section>

          <section class=${`graph-stage ${o} ${this._breakpoint}`} style=${`height:${r.height}px`} @click=${this._clearTooltip}>
            ${this._renderSvg(r)}
            <div class="node-layer">
              ${r.nodes.map((c) => this._renderNode(c, a, l, s))}
            </div>
            ${this._renderTooltip()}
          </section>
        </section>
      </ha-card>
    `;
  }
  _renderSvg(e) {
    const t = Math.max(0.05, ...e.edges.map((o) => o.value));
    return W`
      <svg
        class="flow-layer"
        viewBox=${`0 0 ${e.width} ${e.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          ${e.edges.map(
      (o) => W`
              <linearGradient id=${this._gradientId(o.id)} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color=${this._edgeStart(o)} stop-opacity="0.2"></stop>
                <stop offset="48%" stop-color=${this._edgeColor(o)} stop-opacity="0.94"></stop>
                <stop offset="100%" stop-color=${this._edgeColor(o)} stop-opacity="0.22"></stop>
              </linearGradient>
            `
    )}
        </defs>
        ${e.edges.map((o) => {
      const i = ui(o, e.orientation), r = this._edgeWidth(o, t);
      return W`
            <g class=${`flow-edge ${o.severity} ${o.direction}`}>
              <path class="flow-halo" d=${i} stroke-width=${r + 6}></path>
              <path
                id=${this._pathId(o.id)}
                class=${`flow-path ${this._mode}`}
                d=${i}
                stroke=${`url(#${this._gradientId(o.id)})`}
                stroke-width=${r}
              ></path>
              ${this._mode === "power" && this._config.animation !== !1 ? W`
                  <circle class="particle" r=${Math.max(1.8, r / 2.2)} fill=${this._edgeColor(o)}>
                    <animateMotion
                      dur=${this._particleDuration(o)}
                      repeatCount="indefinite"
                      rotate="auto"
                      calcMode=${o.direction === "reverse" ? "linear" : _}
                      keyPoints=${o.direction === "reverse" ? "1;0" : _}
                      keyTimes=${o.direction === "reverse" ? "0;1" : _}
                    >
                      <mpath href=${`#${this._pathId(o.id)}`}></mpath>
                    </animateMotion>
                  </circle>
                ` : _}
            </g>
          `;
    })}
      </svg>
    `;
  }
  _renderNode(e, t, o, i) {
    const r = (t == null ? void 0 : t.id) === e.id, a = e.children.length > 0, n = this._collapsedIds.has(e.id), s = [
      "flow-node",
      `role-${e.role}`,
      e.severity,
      r ? "is-root" : "",
      a ? "is-container" : "",
      n ? "is-collapsed" : ""
    ].filter(Boolean).join(" ");
    return m`
      <article
        class=${s}
        style=${`left:${e.x}px;top:${e.y}px;width:${e.width}px;height:${e.height}px;--node-accent:${this._nodeAccent(e)};`}
        data-node-id=${e.id}
        tabindex="0"
        @mouseenter=${() => this._queueTooltip(e)}
        @mouseleave=${() => this._hideTooltipFromNode(e)}
        @focusin=${() => this._queueTooltip(e, 0)}
        @focusout=${() => this._hideTooltipFromNode(e)}
        @click=${(l) => this._handleNodeClick(l, e)}
      >
        ${r ? this._renderRootNode(e, o, i) : this._renderCompactNode(e)}
      </article>
    `;
  }
  _renderRootNode(e, t, o) {
    const i = this._rootStats();
    return m`
      <div class="root-heading">
        <span class="node-icon root-icon"><ha-icon icon=${e.icon}></ha-icon></span>
        <button class="collapse-button" type="button" title=${this._t("expandCollapse")} @click=${(r) => this._toggleNode(r, e)}>
          <ha-icon icon=${this._collapsedIds.has(e.id) ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
        </button>
      </div>
      <div class="root-title">${e.name}</div>
      <div class="root-value">${le(e.value, this._mode, this._config.precision)}</div>
      <div class="root-subtitle">${this._t("currentConsumption")}</div>
      <div class=${`gauge ${o ? "" : "is-hidden"}`} style=${`--gauge:${Math.round(t * 100)}%`}>
        <span>${Math.round(t * 100)}%</span>
        <small>${this._t("solarAutonomy")}</small>
      </div>
      ${i.length ? m`
            <dl class="root-stats">
              ${i.map((r) => m`<div><dt>${r.label}</dt><dd>${r.value}</dd></div>`)}
            </dl>
          ` : _}
    `;
  }
  _rootStats() {
    return [
      this._entityStat(this._config.voltage_entity, this._t("voltage")),
      this._entityStat(this._config.frequency_entity, this._t("frequency")),
      this._entityStat(this._config.power_factor_entity, this._t("powerFactor"))
    ].filter((e) => !!e);
  }
  _entityStat(e, t) {
    var l;
    const o = e == null ? void 0 : e.trim();
    if (!o)
      return;
    const i = (l = this._hass) == null ? void 0 : l.states[o];
    if (!i)
      return;
    const r = String(i.state ?? "").trim();
    if (!r)
      return;
    const a = Number.parseFloat(r.replace(",", ".")), n = Number.isFinite(a) ? ut(a) : r, s = String(i.attributes.unit_of_measurement ?? "").trim();
    return {
      label: t,
      value: `${n} ${s}`.trim()
    };
  }
  _renderCompactNode(e) {
    const t = this._nodeStatus(e), o = this._visualScale();
    return m`
      <div class="node-main">
        <span class="node-icon"><ha-icon icon=${e.icon}></ha-icon></span>
        <div class="node-copy">
          <strong>${e.name}</strong>
          <span>${le(e.value, this._mode, this._config.precision)}</span>
        </div>
            ${e.children.length ? m`
              <button class="collapse-button" type="button" title=${this._t("expandCollapse")} @click=${(i) => this._toggleNode(i, e)}>
                <ha-icon icon=${this._collapsedIds.has(e.id) ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
              </button>
            ` : m`<span class="node-percent">${X(e.percentOfParent)}</span>`}
      </div>
      ${e.role === "source" ? m`
            <div class="source-meta">
              <strong>${X(e.capacity ? e.value / e.capacity : e.percentOfParent)}</strong>
              <span>${t}</span>
            </div>
            ${this._renderSparkline(e, Math.round(129 * o), Math.round(26 * o))}
          ` : _}
      ${e.role !== "source" && e.children.length ? m`<div class="container-share">${X(e.percentOfParent)} ${this._t("ofTotal")}</div>` : _}
    `;
  }
  _renderTooltip() {
    const e = this._tooltip;
    if (!e)
      return _;
    const t = this._tooltipWidth(), o = Math.round(162 * this._visualScale()), i = Math.round(44 * this._visualScale());
    return m`
      <aside
        class=${`tooltip ${e.loading ? "is-loading" : ""}`}
        style=${`left:${e.x}px;top:${e.y}px;width:${t}px;--tooltip-accent:${e.color};`}
        role="dialog"
        aria-label=${`${this._t("tooltipDetail")} ${e.name}`}
      >
        <header>
          <span class="tooltip-icon"><ha-icon icon=${e.icon}></ha-icon></span>
          <div>
            <strong>${e.name}</strong>
            <span class="tooltip-value">${e.valueLabel}</span>
          </div>
          <em>${X(e.parentPercent)}</em>
        </header>
        <p>
          <span class="dot"></span>
          ${X(e.parentPercent)} ${this._t("of")} ${e.parentName}
        </p>
        ${this._renderTooltipSparkline(e, o, i)}
        <footer>
          <ha-icon icon=${e.error ? "mdi:alert-circle-outline" : e.loading ? "mdi:clock-outline" : "mdi:chart-line"}></ha-icon>
          ${e.error ?? (e.loading ? this._t("loadingHaHistory") : this._tooltipHistoryLabel(e))}
        </footer>
      </aside>
    `;
  }
  _renderSparkline(e, t, o) {
    const i = Ri(e.history, t, o);
    return W`
      <svg class="sparkline" viewBox=${`0 0 ${t} ${o}`} aria-hidden="true">
        <path class="sparkline-area" d=${`${i} L ${t} ${o} L 0 ${o} Z`}></path>
        <path class="sparkline-line" d=${i}></path>
      </svg>
    `;
  }
  _renderTooltipSparkline(e, t, o) {
    const i = Di(e.history, t, o);
    return W`
      <svg class="sparkline" viewBox=${`0 0 ${t} ${o}`} aria-hidden="true">
        <path class="sparkline-area" d=${`${i} L ${t} ${o} L 0 ${o} Z`}></path>
        <path class="sparkline-line" d=${i}></path>
      </svg>
    `;
  }
  _toggleNode(e, t) {
    if (t.children.length === 0)
      return;
    e.stopPropagation();
    const o = this._isCurrentlyExpanded(t), i = new Set(this._expandedIds), r = new Set(this._collapsedIds);
    o ? (i.delete(t.id), r.add(t.id)) : (r.delete(t.id), i.add(t.id)), this._expandedIds = i, this._collapsedIds = r, this._saveBranchState();
  }
  _isCurrentlyExpanded(e) {
    return this._collapsedIds.has(e.id) ? !1 : this._expandedIds.has(e.id) ? !0 : e.depth < (this._config.default_expanded_depth ?? 2);
  }
  _queueTooltip(e, t = Ni) {
    window.clearTimeout(this._tooltipTimer), this._tooltipTimer = window.setTimeout(() => this._openTooltip(e), t);
  }
  _handleNodeClick(e, t) {
    var o;
    if (e.stopPropagation(), window.clearTimeout(this._tooltipTimer), ((o = this._tooltip) == null ? void 0 : o.nodeId) === t.id) {
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
    var a;
    const t = ++this._tooltipRequestId, o = e.entity, i = this._fallbackTooltipHistory(e), r = o ? this._cachedTooltipHistory(o) : void 0;
    this._tooltip = {
      nodeId: e.id,
      entityId: o,
      name: e.name,
      icon: e.icon,
      valueLabel: this._currentValueLabel(e),
      parentName: ((a = e.parent) == null ? void 0 : a.name) ?? this._t("balance"),
      parentPercent: e.parent && e.parent.value > 0 ? e.value / e.parent.value : e.percentOfParent,
      color: this._nodeAccent(e),
      ...this._tooltipPosition(e),
      history: r ?? i,
      loading: !!(o && !r),
      historySource: r ? "home-assistant" : "local"
    }, o && !r && this._loadTooltipHistory(o, t);
  }
  async _loadTooltipHistory(e, t) {
    var o, i;
    try {
      const r = await this._getTooltipHistory(e);
      if (this._tooltipRequestId !== t || ((o = this._tooltip) == null ? void 0 : o.entityId) !== e)
        return;
      this._tooltip = {
        ...this._tooltip,
        history: r.length ? r : this._tooltip.history,
        loading: !1,
        historySource: r.length ? "home-assistant" : "local",
        error: r.length ? void 0 : this._t("noHistorySamples")
      };
    } catch {
      if (this._tooltipRequestId !== t || ((i = this._tooltip) == null ? void 0 : i.entityId) !== e)
        return;
      this._tooltip = {
        ...this._tooltip,
        loading: !1,
        historySource: "local",
        error: this._t("historyLoadError")
      };
    }
  }
  _cachedTooltipHistory(e) {
    const t = this._tooltipHistoryCache.get(this._tooltipHistoryKey(e));
    if (!(!t || t.expiresAt <= Date.now()))
      return t.points;
  }
  async _getTooltipHistory(e) {
    const t = this._tooltipHistoryKey(e), o = this._tooltipHistoryCache.get(t), i = Date.now();
    if (o && o.expiresAt > i)
      return o.pending ?? o.points;
    const r = this._fetchTooltipHistory(e);
    this._tooltipHistoryCache.set(t, {
      expiresAt: i + lt,
      points: (o == null ? void 0 : o.points) ?? [],
      pending: r
    });
    const a = await r;
    return this._tooltipHistoryCache.set(t, {
      expiresAt: Date.now() + lt,
      points: a
    }), a;
  }
  async _fetchTooltipHistory(e) {
    var i, r;
    const t = /* @__PURE__ */ new Date(), o = new Date(t.getTime() - 60 * 6e4);
    if ((i = this._hass) != null && i.callWS)
      try {
        const a = await this._hass.callWS({
          type: "history/history_during_period",
          start_time: o.toISOString(),
          end_time: t.toISOString(),
          entity_ids: [e],
          significant_changes_only: !1,
          minimal_response: !1,
          no_attributes: !0
        }), n = ht(a, e);
        if (n.length)
          return n;
      } catch {
      }
    if ((r = this._hass) != null && r.callApi) {
      const a = new URLSearchParams({
        filter_entity_id: e,
        end_time: t.toISOString(),
        significant_changes_only: "false",
        minimal_response: "false",
        no_attributes: "true"
      }), n = `history/period/${encodeURIComponent(o.toISOString())}?${a.toString()}`, s = await this._hass.callApi("GET", n);
      return ht(s, e);
    }
    return [];
  }
  _tooltipHistoryKey(e) {
    return `${this._mode}:${e}`;
  }
  _fallbackTooltipHistory(e) {
    const o = Date.now(), i = e.history.length ? e.history : [e.value];
    return i.map((r, a) => ({
      time: o - 36e5 + (i.length === 1 ? 36e5 : a / (i.length - 1) * 36e5),
      value: r
    }));
  }
  _currentValueLabel(e) {
    var r;
    const t = e.entity ? (r = this._hass) == null ? void 0 : r.states[e.entity] : void 0, o = Number.parseFloat(String((t == null ? void 0 : t.state) ?? "").replace(",", ".")), i = String((t == null ? void 0 : t.attributes.unit_of_measurement) ?? e.unit);
    return Number.isFinite(o) ? `${ut(Math.abs(o))} ${i}`.trim() : le(e.value, this._mode, this._config.precision);
  }
  _tooltipPosition(e) {
    const t = this.renderRoot.querySelector(".graph-stage"), o = [...this.renderRoot.querySelectorAll(".flow-node")].find((p) => p.dataset.nodeId === e.id), i = this._tooltipWidth(), r = this._tooltipHeight(), a = this._visualScale();
    if (!t || !o)
      return {
        x: Math.max(9 * a, e.x + e.width + 11 * a),
        y: Math.max(9 * a, e.y + e.height / 2 - r / 2)
      };
    const n = t.getBoundingClientRect(), s = o.getBoundingClientRect(), l = 11 * a, c = 9 * a;
    let d = s.right - n.left + l, h = s.top - n.top + s.height / 2 - r / 2;
    return d + i > n.width - c && (d = s.left - n.left - i - l), d < c && (d = s.left - n.left + s.width / 2 - i / 2, h = s.bottom - n.top + l, h + r > n.height - c && (h = s.top - n.top - r - l)), {
      x: He(d, c, Math.max(c, n.width - i - c)),
      y: He(h, c, Math.max(c, n.height - r - c))
    };
  }
  _tooltipHistoryLabel(e) {
    return e.historySource === "home-assistant" ? this._t("historyFromHomeAssistant") : this._t("localHistoryUntilHa");
  }
  _rebuildGraph(e) {
    const t = et(this._config, this._hass, this._mode, this._historyCache);
    (e || this._hasMeaningfulGraphChange(t)) && (this._graph = t, this._lastValues = new Map(t.allNodes.map((o) => [o.id, o.value])));
  }
  _hasMeaningfulGraphChange(e) {
    return e.signature !== this._graph.signature || this._lastValues.size !== e.allNodes.length ? !0 : e.allNodes.some((t) => {
      const o = this._lastValues.get(t.id);
      return o === void 0 ? !0 : Math.abs(t.value - o) > Math.max(5e-3, Math.abs(o) * 5e-3);
    });
  }
  _saveBranchState() {
    try {
      sessionStorage.setItem(
        this._storageKey(),
        JSON.stringify({
          version: st,
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
      if (t.version !== st)
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
    return yi(e.value, t, this._mode, e.percent, this._config.line_width_base ?? 1.5) * this._visualScale();
  }
  _particleDuration(e) {
    const t = He(this._config.animation_speed ?? 1, 0.4, 3);
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
    const t = [...this._config.color_thresholds ?? []].sort((r, a) => a.above - r.above), o = this._mode === "power" ? e.value * 1e3 : e.value, i = t.find((r) => (!r.node_id || r.node_id === "__all__" || r.node_id === e.id) && o >= r.above);
    return i == null ? void 0 : i.color;
  }
  _nodeStatus(e) {
    return e.overflow ? this._t("overflowStatus") : e.direction === "reverse" ? e.role === "source" ? this._t("exporting") : this._t("reverseFlow") : e.value <= 1e-3 ? this._t("standby") : e.role === "source" ? this._t("supplying") : this._t("active");
  }
};
S.styles = xt`
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
      --nexus-scale: 1;
      letter-spacing: 0;
    }

    .nexus-shell {
      display: block;
      overflow: hidden;
      border: 1px solid rgba(139, 180, 216, 0.18);
      border-radius: calc(15px * var(--nexus-scale, 1));
      background:
        linear-gradient(135deg, rgba(21, 36, 54, 0.88), rgba(5, 15, 26, 0.96)),
        var(--card-background-color, #08121f);
      box-shadow: 0 calc(17px * var(--nexus-scale, 1)) calc(44px * var(--nexus-scale, 1)) rgba(0, 0, 0, 0.34);
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
      --nexus-title-size: calc(21px * var(--nexus-scale, 1));
      --nexus-primary-metric-size: calc(36px * var(--nexus-scale, 1));
      --nexus-source-padding: calc(14px * var(--nexus-scale, 1));
      --nexus-node-main-padding: 0 calc(14px * var(--nexus-scale, 1));
      --nexus-node-main-gap: calc(9px * var(--nexus-scale, 1));
      --nexus-node-icon-size: calc(26px * var(--nexus-scale, 1));
      --nexus-node-symbol-size: calc(16px * var(--nexus-scale, 1));
      --nexus-node-title-size: calc(11px * var(--nexus-scale, 1));
      --nexus-node-value-size: calc(11px * var(--nexus-scale, 1));
      --nexus-root-padding: calc(20px * var(--nexus-scale, 1)) calc(20px * var(--nexus-scale, 1)) calc(15px * var(--nexus-scale, 1));
      --nexus-root-icon-size: calc(36px * var(--nexus-scale, 1));
      --nexus-root-value-size: calc(27px * var(--nexus-scale, 1));
      --nexus-gauge-width: calc(102px * var(--nexus-scale, 1));
      --nexus-gauge-height: calc(62px * var(--nexus-scale, 1));
      padding: calc(18px * var(--nexus-scale, 1)) calc(22px * var(--nexus-scale, 1)) calc(14px * var(--nexus-scale, 1));
      border-radius: inherit;
      background:
        linear-gradient(90deg, rgba(64, 165, 255, 0.1), transparent 32%, rgba(73, 240, 191, 0.07)),
        rgba(4, 11, 19, 0.38);
      backdrop-filter: blur(calc(12px * var(--nexus-scale, 1)));
      overflow: hidden;
    }

    .nexus-card-frame.compact {
      --nexus-title-size: calc(15px * var(--nexus-scale, 1));
      --nexus-primary-metric-size: calc(26px * var(--nexus-scale, 1));
      --nexus-source-padding: calc(8px * var(--nexus-scale, 1));
      --nexus-node-main-padding: 0 calc(8px * var(--nexus-scale, 1));
      --nexus-node-main-gap: calc(6px * var(--nexus-scale, 1));
      --nexus-node-icon-size: calc(23px * var(--nexus-scale, 1));
      --nexus-node-symbol-size: calc(14px * var(--nexus-scale, 1));
      --nexus-node-title-size: calc(10px * var(--nexus-scale, 1));
      --nexus-node-value-size: calc(9px * var(--nexus-scale, 1));
      --nexus-root-padding: calc(12px * var(--nexus-scale, 1));
      --nexus-root-icon-size: calc(30px * var(--nexus-scale, 1));
      --nexus-root-value-size: calc(21px * var(--nexus-scale, 1));
      --nexus-gauge-width: calc(81px * var(--nexus-scale, 1));
      --nexus-gauge-height: calc(51px * var(--nexus-scale, 1));
      padding: calc(11px * var(--nexus-scale, 1)) calc(9px * var(--nexus-scale, 1)) calc(9px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact {
      --nexus-title-size: calc(14px * var(--nexus-scale, 1));
      --nexus-primary-metric-size: calc(23px * var(--nexus-scale, 1));
      --nexus-source-padding: calc(7px * var(--nexus-scale, 1)) calc(8px * var(--nexus-scale, 1));
      --nexus-node-main-padding: 0 calc(8px * var(--nexus-scale, 1));
      --nexus-node-main-gap: calc(6px * var(--nexus-scale, 1));
      --nexus-node-icon-size: calc(21px * var(--nexus-scale, 1));
      --nexus-node-symbol-size: calc(13px * var(--nexus-scale, 1));
      --nexus-node-title-size: calc(10px * var(--nexus-scale, 1));
      --nexus-node-value-size: calc(9px * var(--nexus-scale, 1));
      --nexus-root-padding: calc(11px * var(--nexus-scale, 1));
      --nexus-root-icon-size: calc(29px * var(--nexus-scale, 1));
      --nexus-root-value-size: calc(20px * var(--nexus-scale, 1));
      --nexus-gauge-width: calc(71px * var(--nexus-scale, 1));
      --nexus-gauge-height: calc(44px * var(--nexus-scale, 1));
      padding: calc(8px * var(--nexus-scale, 1));
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
      gap: calc(14px * var(--nexus-scale, 1));
      margin-bottom: calc(14px * var(--nexus-scale, 1));
    }

    .brand {
      display: flex;
      align-items: flex-start;
      gap: calc(12px * var(--nexus-scale, 1));
      min-width: 0;
    }

    .brand-icon {
      display: grid;
      width: calc(29px * var(--nexus-scale, 1));
      height: calc(29px * var(--nexus-scale, 1));
      place-items: center;
      color: #62c7ff;
      filter: drop-shadow(0 0 calc(9px * var(--nexus-scale, 1)) rgba(56, 165, 255, 0.42));
    }

    .brand-icon ha-icon {
      --mdc-icon-size: calc(26px * var(--nexus-scale, 1));
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
      gap: calc(5px * var(--nexus-scale, 1));
      margin: calc(14px * var(--nexus-scale, 1)) 0 0;
      color: var(--nexus-muted);
      font-size: calc(9px * var(--nexus-scale, 1));
      font-weight: 700;
      text-transform: uppercase;
    }

    .brand p strong {
      color: #7ff3ae;
      font-weight: 760;
    }

    .live-dot {
      width: calc(5px * var(--nexus-scale, 1));
      height: calc(5px * var(--nexus-scale, 1));
      border-radius: 999px;
      background: var(--nexus-green);
      box-shadow: 0 0 calc(11px * var(--nexus-scale, 1)) rgba(88, 238, 131, 0.85);
    }

    .summary-strip {
      display: flex;
      align-items: center;
      gap: calc(11px * var(--nexus-scale, 1));
    }

    button,
    select {
      font: inherit;
      letter-spacing: 0;
    }

    .health-pill {
      display: flex;
      align-items: center;
      min-height: calc(33px * var(--nexus-scale, 1));
      border: 1px solid var(--nexus-line);
      border-radius: calc(17px * var(--nexus-scale, 1));
      background: rgba(12, 22, 34, 0.55);
      color: var(--nexus-muted);
      backdrop-filter: blur(calc(12px * var(--nexus-scale, 1)));
    }

    .summary-strip {
      justify-content: space-between;
      margin-bottom: 0;
    }

    .primary-metric {
      display: grid;
      gap: calc(3px * var(--nexus-scale, 1));
    }

    .primary-metric span {
      color: var(--nexus-muted);
      font-size: calc(9px * var(--nexus-scale, 1));
      font-weight: 750;
      text-transform: uppercase;
    }

    .primary-metric strong {
      font-size: var(--nexus-primary-metric-size);
      line-height: 1;
      font-weight: 740;
    }

    .health-pill {
      gap: calc(6px * var(--nexus-scale, 1));
      padding: 0 calc(12px * var(--nexus-scale, 1));
      color: #68f292;
      font-size: calc(11px * var(--nexus-scale, 1));
      font-weight: 700;
    }

    .health-pill.warning {
      color: var(--nexus-yellow);
    }

    .health-pill ha-icon {
      --mdc-icon-size: calc(16px * var(--nexus-scale, 1));
    }

    .graph-stage {
      position: relative;
      z-index: 2;
      min-height: calc(390px * var(--nexus-scale, 1));
      margin-top: calc(2px * var(--nexus-scale, 1));
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
      stroke-dasharray: calc(4px * var(--nexus-scale, 1)) calc(14px * var(--nexus-scale, 1));
      animation: dash-flow 1.4s linear infinite;
    }

    .flow-edge.overflow .flow-halo {
      stroke: rgba(255, 98, 89, 0.2);
    }

    .particle {
      filter: drop-shadow(0 0 calc(8px * var(--nexus-scale, 1)) currentColor);
    }

    @keyframes dash-flow {
      to {
        stroke-dashoffset: -35;
      }
    }

    .flow-node {
      position: absolute;
      box-sizing: border-box;
      overflow: hidden;
      border: 1px solid rgba(158, 195, 226, 0.22);
      border-radius: calc(9px * var(--nexus-scale, 1));
      background:
        linear-gradient(180deg, rgba(40, 61, 82, 0.72), rgba(17, 31, 46, 0.72)),
        rgba(14, 26, 39, 0.76);
      color: #f7fbff;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 calc(11px * var(--nexus-scale, 1)) calc(24px * var(--nexus-scale, 1)) rgba(0, 0, 0, 0.24);
      backdrop-filter: blur(calc(9px * var(--nexus-scale, 1)));
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
      transform: translateY(calc(-1px * var(--nexus-scale, 1)));
      border-color: rgba(120, 190, 255, 0.56);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        0 calc(14px * var(--nexus-scale, 1)) calc(32px * var(--nexus-scale, 1)) rgba(0, 0, 0, 0.34);
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
        0 calc(14px * var(--nexus-scale, 1)) calc(29px * var(--nexus-scale, 1)) rgba(255, 98, 89, 0.12);
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
      grid-template-columns: var(--nexus-node-icon-size) minmax(0, 1fr) auto;
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
      border-radius: calc(8px * var(--nexus-scale, 1));
      color: var(--node-accent, #8bbcff);
      background: rgba(58, 167, 255, 0.1);
    }

    .node-icon ha-icon {
      --mdc-icon-size: var(--nexus-node-symbol-size);
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
      gap: calc(3px * var(--nexus-scale, 1));
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
      right: calc(14px * var(--nexus-scale, 1));
      bottom: calc(7px * var(--nexus-scale, 1));
      font-size: calc(9px * var(--nexus-scale, 1));
    }

    .collapse-button {
      display: grid;
      width: calc(23px * var(--nexus-scale, 1));
      height: calc(23px * var(--nexus-scale, 1));
      place-items: center;
      border: 0;
      border-radius: calc(8px * var(--nexus-scale, 1));
      color: rgba(255, 255, 255, 0.74);
      background: transparent;
      cursor: pointer;
    }

    .collapse-button:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    .collapse-button ha-icon {
      --mdc-icon-size: calc(15px * var(--nexus-scale, 1));
    }

    .source-meta {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: calc(8px * var(--nexus-scale, 1));
      margin: calc(6px * var(--nexus-scale, 1)) 0 calc(3px * var(--nexus-scale, 1)) calc(38px * var(--nexus-scale, 1));
      font-size: calc(10px * var(--nexus-scale, 1));
      color: var(--nexus-green);
    }

    .source-meta span {
      color: var(--nexus-muted);
    }

    .role-source .sparkline {
      position: relative;
      z-index: 1;
      margin-left: calc(38px * var(--nexus-scale, 1));
      width: calc(100% - calc(44px * var(--nexus-scale, 1)));
      height: calc(23px * var(--nexus-scale, 1));
    }

    .sparkline-line {
      fill: none;
      stroke: #58ee83;
      stroke-width: calc(1.5px * var(--nexus-scale, 1));
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .sparkline-area {
      fill: rgba(88, 238, 131, 0.12);
      stroke: none;
    }

    .is-root {
      padding: var(--nexus-root-padding);
      border-radius: calc(11px * var(--nexus-scale, 1));
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
      border-radius: calc(11px * var(--nexus-scale, 1));
      color: var(--nexus-cyan);
    }

    .root-icon ha-icon {
      --mdc-icon-size: calc(26px * var(--nexus-scale, 1));
    }

    .root-title {
      margin-top: calc(9px * var(--nexus-scale, 1));
      font-size: calc(14px * var(--nexus-scale, 1));
      font-weight: 740;
    }

    .root-value {
      margin-top: calc(12px * var(--nexus-scale, 1));
      font-size: var(--nexus-root-value-size);
      line-height: 1;
      font-weight: 740;
    }

    .root-subtitle {
      margin-top: calc(6px * var(--nexus-scale, 1));
      color: var(--nexus-muted);
      font-size: calc(11px * var(--nexus-scale, 1));
    }

    .gauge {
      position: relative;
      display: grid;
      width: var(--nexus-gauge-width);
      height: var(--nexus-gauge-height);
      place-items: center;
      margin: calc(17px * var(--nexus-scale, 1)) auto calc(9px * var(--nexus-scale, 1));
      border-radius: calc(114px * var(--nexus-scale, 1)) calc(114px * var(--nexus-scale, 1)) calc(12px * var(--nexus-scale, 1)) calc(12px * var(--nexus-scale, 1));
      background:
        radial-gradient(circle at 50% 85%, rgba(12, 24, 39, 1) 0 46%, transparent 47%),
        conic-gradient(from 230deg, var(--nexus-cyan) 0 var(--gauge), rgba(255, 255, 255, 0.14) var(--gauge) 74%, transparent 74%);
    }

    .gauge.is-hidden {
      display: none;
    }

    .gauge span {
      margin-top: calc(11px * var(--nexus-scale, 1));
      font-size: calc(22px * var(--nexus-scale, 1));
      font-weight: 760;
    }

    .gauge small {
      position: absolute;
      bottom: calc(6px * var(--nexus-scale, 1));
      color: var(--nexus-muted);
      font-size: calc(8px * var(--nexus-scale, 1));
    }

    .root-stats {
      display: grid;
      gap: calc(6px * var(--nexus-scale, 1));
      margin: 0;
      padding-top: calc(11px * var(--nexus-scale, 1));
      border-top: 1px solid rgba(255, 255, 255, 0.09);
    }

    .root-stats div {
      display: flex;
      justify-content: space-between;
      gap: calc(12px * var(--nexus-scale, 1));
      font-size: calc(10px * var(--nexus-scale, 1));
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
      padding: calc(11px * var(--nexus-scale, 1));
      border: 1px solid rgba(158, 195, 226, 0.24);
      border-radius: calc(9px * var(--nexus-scale, 1));
      background:
        linear-gradient(180deg, rgba(26, 42, 62, 0.88), rgba(11, 22, 36, 0.94)),
        rgba(10, 22, 34, 0.92);
      box-shadow: 0 calc(17px * var(--nexus-scale, 1)) calc(32px * var(--nexus-scale, 1)) rgba(0, 0, 0, 0.38);
      backdrop-filter: blur(calc(11px * var(--nexus-scale, 1)));
      pointer-events: none;
      --tooltip-accent: var(--nexus-red);
    }

    .tooltip header {
      display: flex;
      align-items: center;
      gap: calc(8px * var(--nexus-scale, 1));
      font-size: calc(11px * var(--nexus-scale, 1));
      font-weight: 750;
    }

    .tooltip-icon {
      display: grid;
      flex: 0 0 auto;
      width: calc(26px * var(--nexus-scale, 1));
      height: calc(26px * var(--nexus-scale, 1));
      place-items: center;
      border-radius: calc(8px * var(--nexus-scale, 1));
      color: var(--tooltip-accent);
      background: color-mix(in srgb, var(--tooltip-accent) 18%, transparent);
    }

    .tooltip-icon ha-icon {
      --mdc-icon-size: calc(14px * var(--nexus-scale, 1));
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
      margin-top: calc(3px * var(--nexus-scale, 1));
      font-size: calc(10px * var(--nexus-scale, 1));
    }

    .tooltip p {
      display: flex;
      align-items: center;
      gap: calc(6px * var(--nexus-scale, 1));
      margin: calc(8px * var(--nexus-scale, 1)) 0 calc(6px * var(--nexus-scale, 1));
      color: var(--nexus-muted);
      font-size: calc(10px * var(--nexus-scale, 1));
    }

    .tooltip .dot {
      width: calc(5px * var(--nexus-scale, 1));
      height: calc(5px * var(--nexus-scale, 1));
      border-radius: 999px;
      background: var(--tooltip-accent);
    }

    .tooltip .sparkline {
      width: 100%;
      height: calc(44px * var(--nexus-scale, 1));
      margin: calc(3px * var(--nexus-scale, 1)) 0 calc(8px * var(--nexus-scale, 1));
    }

    .tooltip .sparkline-line {
      stroke: var(--tooltip-accent);
      stroke-width: calc(1.8px * var(--nexus-scale, 1));
    }

    .tooltip .sparkline-area {
      fill: var(--tooltip-accent);
      fill-opacity: 0.13;
    }

    .tooltip footer {
      display: flex;
      align-items: center;
      gap: calc(6px * var(--nexus-scale, 1));
      color: var(--nexus-muted);
      font-size: calc(9px * var(--nexus-scale, 1));
    }

    .tooltip footer ha-icon {
      --mdc-icon-size: calc(12px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .topbar,
    .nexus-card-frame.compact .summary-strip,
    .nexus-card-frame.ultra-compact .topbar,
    .nexus-card-frame.ultra-compact .summary-strip {
      align-items: stretch;
      flex-direction: column;
    }

    .nexus-card-frame.compact .topbar,
    .nexus-card-frame.ultra-compact .topbar {
      gap: calc(9px * var(--nexus-scale, 1));
      margin-bottom: calc(11px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .brand,
    .nexus-card-frame.ultra-compact .brand {
      gap: calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .brand p,
    .nexus-card-frame.ultra-compact .brand p {
      margin-top: calc(6px * var(--nexus-scale, 1));
      font-size: calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .health-pill,
    .nexus-card-frame.ultra-compact .health-pill {
      align-self: flex-start;
      min-height: calc(29px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .graph-stage {
      min-height: calc(390px * var(--nexus-scale, 1));
      margin-top: calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact .graph-stage {
      min-height: calc(360px * var(--nexus-scale, 1));
      margin-top: calc(6px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .node-main,
    .nexus-card-frame.ultra-compact .node-main {
      grid-template-columns: var(--nexus-node-icon-size) minmax(0, 1fr) auto;
    }

    .nexus-card-frame.compact .flow-node.role-source .source-meta,
    .nexus-card-frame.compact .flow-node.role-source .sparkline,
    .nexus-card-frame.ultra-compact .flow-node.role-source .source-meta,
    .nexus-card-frame.ultra-compact .flow-node.role-source .sparkline {
      display: none;
    }

    .nexus-card-frame.compact .root-title,
    .nexus-card-frame.ultra-compact .root-title {
      font-size: calc(12px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .root-subtitle,
    .nexus-card-frame.ultra-compact .root-subtitle {
      font-size: calc(9px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .gauge {
      margin: calc(11px * var(--nexus-scale, 1)) auto calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact .gauge {
      margin: calc(8px * var(--nexus-scale, 1)) auto 0;
    }

    .nexus-card-frame.compact .gauge span {
      font-size: calc(17px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact .gauge span {
      margin-top: calc(8px * var(--nexus-scale, 1));
      font-size: calc(15px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .gauge small {
      font-size: calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact .gauge small {
      bottom: calc(5px * var(--nexus-scale, 1));
      font-size: calc(7px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .root-stats {
      gap: calc(5px * var(--nexus-scale, 1));
      padding-top: calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .root-stats div {
      font-size: calc(9px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact .root-stats {
      display: none;
    }
  `;
T([
  C()
], S.prototype, "_config", 2);
T([
  C()
], S.prototype, "_graph", 2);
T([
  C()
], S.prototype, "_mode", 2);
T([
  C()
], S.prototype, "_width", 2);
T([
  C()
], S.prototype, "_breakpoint", 2);
T([
  C()
], S.prototype, "_tooltip", 2);
T([
  C()
], S.prototype, "_expandedIds", 2);
T([
  C()
], S.prototype, "_collapsedIds", 2);
S = T([
  At("nexus-energy-card")
], S);
function Ri(e, t, o) {
  if (e.length === 0)
    return `M 0 ${o / 2} L ${t} ${o / 2}`;
  const i = Math.min(...e), r = Math.max(...e), a = Math.max(1e-3, r - i);
  return e.map((s, l) => {
    const c = e.length === 1 ? t : l / (e.length - 1) * t, d = o - (s - i) / a * (o - 8) - 4;
    return `${l === 0 ? "M" : "L"} ${c.toFixed(2)} ${d.toFixed(2)}`;
  }).join(" ");
}
function Di(e, t, o) {
  var h, p;
  if (e.length === 0)
    return `M 0 ${o / 2} L ${t} ${o / 2}`;
  const i = [...e].sort((u, x) => u.time - x.time), r = i.map((u) => u.value), a = Math.min(...r), n = Math.max(...r), s = Math.max(1e-3, n - a), l = ((h = i[0]) == null ? void 0 : h.time) ?? 0, c = ((p = i.at(-1)) == null ? void 0 : p.time) ?? l, d = Math.max(1, c - l);
  return i.map((u, x) => {
    const b = (u.time - l) / d * t, A = o - (u.value - a) / s * (o - 8) - 4;
    return `${x === 0 ? "M" : "L"} ${b.toFixed(2)} ${A.toFixed(2)}`;
  }).join(" ");
}
function ht(e, t) {
  const o = Li(e), i = o.find(
    (r) => r.some((a) => a.entity_id === t)
  ) ?? o[0] ?? [];
  return i.map((r, a) => Ui(r, a, i.length)).filter((r) => !!r).sort((r, a) => r.time - a.time);
}
function Li(e) {
  return Array.isArray(e) ? e.every(Array.isArray) ? e : [e] : [];
}
function Ui(e, t, o) {
  if (!e || typeof e != "object")
    return;
  const i = e, r = i.state ?? i.s, a = Number.parseFloat(String(r ?? "").replace(",", "."));
  return Number.isFinite(a) ? { time: Fi(i.last_changed ?? i.last_updated ?? i.lc ?? i.lu) ?? Date.now() - Math.max(0, o - t - 1) * 6e4, value: Math.abs(a) } : void 0;
}
function Fi(e) {
  if (typeof e == "string") {
    const t = Date.parse(e);
    return Number.isFinite(t) ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return e > 1e12 ? e : e * 1e3;
}
function ut(e) {
  return e >= 100 || Number.isInteger(e) ? Math.round(e).toString() : e >= 10 ? pt(e.toFixed(1)) : pt(e.toFixed(2));
}
function pt(e) {
  return e.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
function He(e, t, o) {
  return Math.min(o, Math.max(t, e));
}
var Wi = Object.defineProperty, Gi = Object.getOwnPropertyDescriptor, _e = (e, t, o, i) => {
  for (var r = i > 1 ? void 0 : i ? Gi(t, o) : t, a = e.length - 1, n; a >= 0; a--)
    (n = e[a]) && (r = (i ? n(t, o, r) : n(r)) || r);
  return i && r && Wi(t, o, r), r;
};
const H = "__source__", J = "__all__", he = {
  id: "home",
  name: "Casa",
  icon: "mdi:home-outline",
  children: []
};
let L = class extends j {
  constructor() {
    super(...arguments), this._config = oe, this._flatNodes = [], this._addThreshold = () => {
      const e = {
        id: `threshold-${Date.now().toString(36)}`,
        node_id: J,
        above: 2e3,
        color: "#ffb000"
      };
      this._patchConfig("color_thresholds", [...this._config.color_thresholds ?? [], e]);
    };
  }
  setConfig(e) {
    const t = this._expandedNodeId, o = Vi(e), i = {
      ...oe,
      ...o,
      thresholds: {
        ...oe.thresholds,
        ...o.thresholds
      },
      sources: o.sources ?? [],
      nodes: o.nodes ?? []
    }, r = Bi(i);
    this._config = i, this._flatNodes = r, this._expandedNodeId = t && r.some((a) => a.id === t) ? t : void 0;
  }
  set hass(e) {
    this._hass = e, this.requestUpdate();
  }
  render() {
    const e = this._filteredEntities(["power"]), t = this._filteredEntities(), o = this._mainNode();
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
        <datalist id="nexus-technical-entities">
          ${t.map((i) => m`<option value=${i.entity_id}>${i.label}</option>`)}
        </datalist>

        ${this._renderGeneral(o, e, t)}
        ${this._renderBuilder(o, e)}
        ${this._renderAppearance()}
        ${this._renderThresholds(o)}
      </div>
    `;
  }
  _renderGeneral(e, t, o) {
    return m`
      <section class="panel">
        <div class="panel-head">
          <h4>Configuracion general</h4>
        </div>
        <div class="grid general-grid">
          <label>
            Titulo de la tarjeta
            <input .value=${this._config.title ?? ""} @input=${(i) => this._patchConfig("title", Q(y(i)))} />
          </label>
          <label>
            Idioma de la interfaz
            <select
              .value=${this._config.language ?? "auto"}
              @change=${(i) => this._patchConfig("language", y(i))}
            >
              <option value="auto">Automático (Sistema)</option>
              ${Ct.map((i) => m`<option value=${i}>${co[i]}</option>`)}
            </select>
          </label>
          ${this._renderEntityField(
      "Entidad de la Casa",
      e.entity ?? e.power_entity ?? "",
      t,
      (i) => this._patchMain(this._entityPatch(i))
    )}
          ${this._renderEntityField(
      "Entidad de voltaje",
      this._config.voltage_entity ?? "",
      o,
      (i) => this._patchConfig("voltage_entity", Ee(i)),
      { listId: "nexus-technical-entities", note: "opcional" }
    )}
          ${this._renderEntityField(
      "Entidad de frecuencia",
      this._config.frequency_entity ?? "",
      o,
      (i) => this._patchConfig("frequency_entity", Ee(i)),
      { listId: "nexus-technical-entities", note: "opcional" }
    )}
          ${this._renderEntityField(
      "Entidad de factor de potencia",
      this._config.power_factor_entity ?? "",
      o,
      (i) => this._patchConfig("power_factor_entity", Ee(i)),
      { listId: "nexus-technical-entities", note: "opcional" }
    )}
          <label>
            Tolerancia de desbordamiento (%)
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              .value=${String(this._config.overflow_tolerance ?? 5)}
              @input=${(i) => this._patchConfig("overflow_tolerance", Zi(Number(y(i))))}
            />
          </label>
          <label>
            Nombre del nodo principal
            <input
              .value=${e.name ?? "Casa"}
              @input=${(i) => this._patchMain({ name: Q(y(i)) || "Casa" })}
            />
          </label>
          ${this._renderIconPicker(
      "Icono del nodo principal",
      e.icon ?? "mdi:home-outline",
      (i) => this._patchMain({ icon: i || "mdi:home-outline" })
    )}
        </div>
      </section>
    `;
  }
  _renderBuilder(e, t) {
    const o = this._flatNodes.length > 0;
    return m`
      <section class="panel">
        <div class="panel-head">
          <h4>Constructor del arbol</h4>
          ${o ? m`
                <div class="head-actions">
                  <button type="button" @click=${() => this._addNode(H)}>Fuente</button>
                  <button type="button" @click=${() => this._addNode(this._mainId())}>Nodo</button>
                </div>
              ` : _}
        </div>
        ${o ? m`<div class="node-list">${this._flatNodes.map((i) => this._renderNodeRow(i, e, t))}</div>` : m`
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
  _renderNodeRow(e, t, o) {
    const i = e.parentId === H, r = i ? 0 : this._depthOf(e), a = i ? "Raiz/Fuente" : e.parentId === this._mainId() ? t.name ?? "Casa" : this._nodeName(e.parentId), n = e.entity ?? e.power_entity ?? e.energy_entity ?? "Sin entidad", s = this._expandedNodeId === e.id;
    return m`
      <article class=${`node-row ${i ? "is-source" : ""}`} style=${`--depth:${r}`}>
        <div class="row-title">
          <button
            class="row-toggle"
            type="button"
            aria-expanded=${s}
            title=${s ? "Contraer" : "Editar"}
            @click=${() => this._toggleNode(e.id)}
          >
            <span class="row-icon"><ha-icon icon=${e.icon ?? (i ? "mdi:flash" : "mdi:power-plug-outline")}></ha-icon></span>
            <span class="row-summary">
              <strong>${e.name || "Nodo sin nombre"}</strong>
              <small>${n} - ${a}</small>
            </span>
            <ha-icon class="chevron" icon=${s ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
          </button>
          <button class="icon-button danger" type="button" title="Eliminar" @click=${() => this._removeNode(e.id)}>
            <ha-icon icon="mdi:trash-can-outline"></ha-icon>
          </button>
        </div>

        ${s ? m`
              <div class="node-form">
                <div class="grid node-grid">
                  ${this._renderEntityField(
      "Entidad",
      e.entity ?? e.power_entity ?? e.energy_entity ?? "",
      o,
      (l) => this._patchNode(e.id, this._entityPatch(l))
    )}
                  <label>
                    Nombre a mostrar
                    <input .value=${e.name} @input=${(l) => this._patchNode(e.id, { name: Q(y(l)) })} />
                  </label>
                  ${this._renderIconPicker(
      "Icono",
      e.icon ?? "",
      (l) => this._patchNode(e.id, { icon: l || void 0 })
    )}
                  <label>
                    Nodo padre
                    <select .value=${e.parentId} @change=${(l) => this._patchNode(e.id, { parentId: y(l) })}>
                      <option value=${H} ?selected=${e.parentId === H}>Raiz/Fuente</option>
                      <option value=${this._mainId()} ?selected=${e.parentId === this._mainId()}>${t.name ?? "Casa"}</option>
                      ${this._flatNodes.filter((l) => this._canUseAsParent(l, e)).map((l) => m`<option value=${l.id} ?selected=${e.parentId === l.id}>${l.name}</option>`)}
                    </select>
                  </label>
                  <label>
                    Direccion
                    <select
                      .value=${e.direction ?? "auto"}
                      @change=${(l) => this._patchNode(e.id, { direction: y(l) })}
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
                      @input=${(l) => this._patchNode(e.id, { capacity: qi(y(l)) })}
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
    const e = this._config.animation_speed ?? 1, t = e < 0.85 ? "Lento" : e > 1.25 ? "Rapido" : "Normal", o = $i(this._config.visual_scale);
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
                min="0.75"
                max="6"
                step="0.25"
                .value=${String(this._config.line_width_base ?? 1.5)}
                @input=${(i) => this._patchConfig("line_width_base", Number(y(i)))}
              />
              <output>${this._config.line_width_base ?? 1.5}px</output>
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
                @input=${(i) => this._patchConfig("animation_speed", Number(y(i)))}
              />
              <output>${t}</output>
            </div>
          </label>
          <label>
            Estilo del fondo
            <select
              .value=${this._config.background_style ?? "glass"}
              @change=${(i) => this._patchConfig("background_style", y(i))}
            >
              <option value="glass">Glassmorphism</option>
              <option value="transparent">Transparente</option>
              <option value="solid">Color solido</option>
            </select>
          </label>
          <label>
            Color base
            <input type="color" .value=${this._config.base_color ?? "#38a5ff"} @input=${(i) => this._patchConfig("base_color", y(i))} />
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
              @input=${(i) => this._patchConfig("default_expanded_depth", Number(y(i)))}
            />
          </label>
          <label>
            Escala global de la tarjeta
            <div class="range-row">
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                .value=${String(o)}
                @input=${(i) => this._patchConfig("visual_scale", Ai(y(i)))}
              />
              <output>${o}%</output>
            </div>
          </label>
        </div>
      </section>
    `;
  }
  _renderThresholds(e) {
    const t = this._config.color_thresholds ?? [], o = [{ id: this._mainId(), name: e.name ?? "Casa" }, ...this._flatNodes.map((i) => ({ id: i.id, name: i.name }))];
    return m`
      <section class="panel">
        <div class="panel-head">
          <h4>Umbrales de color</h4>
          <button type="button" @click=${this._addThreshold}>Anadir umbral</button>
        </div>
        <div class="threshold-list">
          ${t.length ? t.map(
      (i, r) => m`
                  <article class="threshold-row">
                    <label>
                      Nodo
                      <select
                        .value=${i.node_id ?? J}
                        @change=${(a) => this._patchThreshold(r, { node_id: y(a) })}
                      >
                        <option value=${J}>Todos</option>
                        ${o.map((a) => m`<option value=${a.id}>${a.name}</option>`)}
                      </select>
                    </label>
                    <label>
                      Por encima de
                      <input
                        type="number"
                        min="0"
                        step="10"
                        .value=${String(i.above)}
                        @input=${(a) => this._patchThreshold(r, { above: Number(y(a)) })}
                      />
                    </label>
                    <label>
                      Color
                      <input type="color" .value=${i.color} @input=${(a) => this._patchThreshold(r, { color: y(a) })} />
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
  _renderEntityField(e, t, o, i, r = {}) {
    const a = r.listId ?? "nexus-entities", n = r.note ?? "sensor power";
    return m`
      <label>
        ${e}
        <input
          list=${a}
          .value=${t}
          @input=${(s) => i(Q(y(s)))}
          placeholder="sensor..."
        />
        ${o.length ? _ : m`<span class="field-note">${n}</span>`}
      </label>
    `;
  }
  _renderIconPicker(e, t, o) {
    return m`
      <label>
        ${e}
        <ha-icon-picker
          .hass=${this._hass}
          .value=${t}
          @value-changed=${(i) => o(ft(i))}
          @change=${(i) => o(ft(i))}
        ></ha-icon-picker>
      </label>
    `;
  }
  _renderCheck(e, t, o) {
    return m`
      <label class="check-row">
        <input type="checkbox" .checked=${t} @change=${(i) => o(i.target.checked)} />
        <span>${e}</span>
      </label>
    `;
  }
  _filteredEntities(e) {
    var i;
    const t = e ? new Set(e) : void 0;
    return Object.values(((i = this._hass) == null ? void 0 : i.states) ?? {}).filter((r) => {
      const a = r.entity_id, n = String(r.attributes.device_class ?? "");
      return a.startsWith("sensor.") && (!t || t.has(n));
    }).map((r) => ({
      entity_id: r.entity_id,
      label: `${r.attributes.friendly_name ?? r.entity_id} (${r.attributes.unit_of_measurement ?? ""})`,
      deviceClass: String(r.attributes.device_class ?? "")
    })).sort((r, a) => r.label.localeCompare(a.label));
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
    this._flatNodes.find((i) => i.id === e) && (t.parentId && (t.parentId === e || this._isDescendant(t.parentId, e)) || (this._flatNodes = this._flatNodes.map((i) => i.id === e ? { ...i, ...t } : i), this._emitConfig()));
  }
  _addNode(e) {
    const t = e === H, o = ji(this._flatNodes, t ? "fuente" : "nodo");
    this._flatNodes = [
      ...this._flatNodes,
      {
        id: o,
        parentId: e,
        name: t ? "Nueva fuente" : "Nuevo nodo",
        icon: t ? "mdi:flash" : "mdi:power-plug-outline",
        direction: "auto"
      }
    ], this._expandedNodeId = o, this._emitConfig();
  }
  _removeNode(e) {
    const t = /* @__PURE__ */ new Set([e]);
    let o = !0;
    for (; o; ) {
      o = !1;
      for (const i of this._flatNodes)
        t.has(i.parentId) && !t.has(i.id) && (t.add(i.id), o = !0);
    }
    this._flatNodes = this._flatNodes.filter((i) => !t.has(i.id)), this._expandedNodeId && t.has(this._expandedNodeId) && (this._expandedNodeId = void 0), this._emitConfig();
  }
  _toggleNode(e) {
    this._expandedNodeId = this._expandedNodeId === e ? void 0 : e;
  }
  _patchThreshold(e, t) {
    var i;
    const o = [...this._config.color_thresholds ?? []];
    o[e] = {
      ...o[e],
      ...t,
      node_id: t.node_id === J ? J : t.node_id ?? ((i = o[e]) == null ? void 0 : i.node_id)
    }, this._patchConfig("color_thresholds", o);
  }
  _removeThreshold(e) {
    this._patchConfig(
      "color_thresholds",
      (this._config.color_thresholds ?? []).filter((t, o) => o !== e)
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
    return ((e = this._config.nodes) == null ? void 0 : e[0]) ?? he;
  }
  _mainId() {
    return this._mainNode().id ?? "home";
  }
  _nodeName(e) {
    var t;
    return ((t = this._flatNodes.find((o) => o.id === e)) == null ? void 0 : t.name) ?? e;
  }
  _canUseAsParent(e, t) {
    return e.id !== t.id && e.parentId !== H && !this._isDescendant(e.id, t.id);
  }
  _isDescendant(e, t) {
    let o = e;
    for (; o && o !== H && o !== this._mainId(); ) {
      if (o === t)
        return !0;
      const i = this._flatNodes.find((r) => r.id === o);
      o = (i == null ? void 0 : i.parentId) ?? "";
    }
    return !1;
  }
  _depthOf(e) {
    let t = 0, o = e.parentId;
    for (; o && o !== this._mainId() && o !== H; ) {
      const i = this._flatNodes.find((r) => r.id === o);
      if (!i)
        break;
      t += 1, o = i.parentId;
    }
    return t;
  }
  _emitConfig() {
    const e = this._mainNode(), t = e.id ?? "home", o = this._flatNodes.filter((n) => n.parentId === H).map((n) => zt(n)), i = Ot(this._flatNodes, t), r = i.length || this._hasConfiguredMain(e) ? [
      {
        ...e,
        id: t,
        children: i
      }
    ] : [], a = {
      ...this._config,
      mode: "power",
      sources: o,
      nodes: r
    };
    this._commitConfig(a);
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
    return !!(e.entity || e.power_entity || e.energy_entity || e.capacity !== void 0 || e.color || e.name && e.name !== he.name || e.icon && e.icon !== he.icon);
  }
};
L.styles = xt`
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
      --editor-field-bg: #111c29;
      --editor-field-bg-hover: #162535;
      --editor-option-bg: #101b28;
      --editor-option-bg-selected: #236fae;
      --editor-option-text: #eef5ff;
      --editor-option-muted: rgba(238, 245, 255, 0.56);
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
    select,
    ha-icon-picker {
      color-scheme: dark;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
    }

    input,
    select {
      min-height: 36px;
      border: 1px solid rgba(150, 180, 210, 0.24);
      border-radius: 8px;
      padding: 0 10px;
      color: var(--editor-option-text);
      background-color: var(--editor-field-bg);
      font: inherit;
      letter-spacing: 0;
      outline: 0;
    }

    ha-icon-picker {
      display: block;
      color: var(--editor-option-text);
      --mdc-theme-primary: var(--editor-accent);
      --mdc-text-field-fill-color: var(--editor-field-bg);
      --mdc-text-field-ink-color: var(--editor-option-text);
      --mdc-text-field-label-ink-color: var(--editor-muted);
      --mdc-text-field-outlined-idle-border-color: rgba(150, 180, 210, 0.24);
      --mdc-text-field-outlined-hover-border-color: rgba(150, 180, 210, 0.38);
      --mdc-text-field-outlined-disabled-border-color: rgba(150, 180, 210, 0.12);
      --mdc-select-fill-color: var(--editor-field-bg);
      --mdc-select-ink-color: var(--editor-option-text);
      --mdc-select-label-ink-color: var(--editor-muted);
      --mdc-menu-item-height: 36px;
      --paper-listbox-background-color: var(--editor-option-bg);
      --primary-text-color: var(--editor-option-text);
      --secondary-text-color: var(--editor-muted);
    }

    select {
      background-image:
        linear-gradient(45deg, transparent 50%, rgba(238, 245, 255, 0.78) 50%),
        linear-gradient(135deg, rgba(238, 245, 255, 0.78) 50%, transparent 50%);
      background-position:
        calc(100% - 16px) 50%,
        calc(100% - 11px) 50%;
      background-repeat: no-repeat;
      background-size:
        5px 5px,
        5px 5px;
      padding-right: 30px;
      appearance: none;
    }

    select:hover,
    input:hover {
      background-color: var(--editor-field-bg-hover);
    }

    input:focus,
    select:focus {
      border-color: rgba(90, 170, 255, 0.64);
    }

    select option,
    select optgroup {
      color: var(--editor-option-text);
      background-color: var(--editor-option-bg);
    }

    select option:checked {
      color: #ffffff;
      background-color: var(--editor-option-bg-selected);
    }

    select option:disabled {
      color: var(--editor-option-muted);
      background-color: var(--editor-option-bg);
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
], L.prototype, "_config", 2);
_e([
  C()
], L.prototype, "_flatNodes", 2);
_e([
  C()
], L.prototype, "_expandedNodeId", 2);
L = _e([
  At("nexus-energy-card-editor")
], L);
function Bi(e) {
  var a;
  const t = [], o = (a = e.nodes) == null ? void 0 : a[0], i = (o == null ? void 0 : o.id) ?? he.id ?? "home";
  for (const n of e.sources ?? [])
    t.push(gt(n, H, t.length));
  const r = (n, s) => {
    for (const l of n ?? []) {
      const c = gt(l, s, t.length);
      t.push(c), r(l.children, c.id);
    }
  };
  return r(o == null ? void 0 : o.children, i), t;
}
function gt(e, t, o) {
  const i = e.id ?? e.entity ?? `node-${o}`;
  return {
    id: i,
    parentId: t,
    name: e.name ?? i,
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
function Ot(e, t) {
  return e.filter((o) => o.parentId === t).map((o) => zt(o, Ot(e, o.id)));
}
function zt(e, t = []) {
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
function ji(e, t) {
  let o = e.length + 1, i = `${t}-${o}`;
  for (; e.some((r) => r.id === i); )
    o += 1, i = `${t}-${o}`;
  return i;
}
function Q(e) {
  return e.trim();
}
function Vi(e) {
  const t = { ...e };
  return delete t.height, t;
}
function qi(e) {
  const t = e.trim();
  if (!t)
    return;
  const o = Number(t);
  return Number.isFinite(o) ? o : void 0;
}
function Ee(e) {
  return e.trim() || void 0;
}
function Zi(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : 5;
}
function y(e) {
  return e.target.value;
}
function ft(e) {
  var i;
  const t = (i = e.detail) == null ? void 0 : i.value, o = e.target.value;
  return Q(String(t ?? o ?? ""));
}
const Yi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get NexusEnergyCardEditor() {
    return L;
  }
}, Symbol.toStringTag, { value: "Module" }));
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "nexus-energy-card",
  name: "Nexus Energy Card",
  description: "Advanced hierarchical energy and power flow map with collapsible nodes."
});
//# sourceMappingURL=nexus-energy-card.js.map

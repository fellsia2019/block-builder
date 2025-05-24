class y {
  constructor() {
  }
  getRender(e, o) {
    return this.createFallbackBlock(e, o);
  }
  createFallbackBlock(e, o) {
    var a;
    let t = this.decodeHTMLEntities(this.renderTemplate(o, e));
    const s = new DOMParser().parseFromString(t, "text/html");
    return ((a = s == null ? void 0 : s.body) == null ? void 0 : a.firstChild) || null;
  }
  decodeHTMLEntities(e) {
    const o = document.createElement("textarea");
    return o.innerHTML = e, o.value;
  }
  renderTemplate(e, o) {
    const r = new DOMParser().parseFromString(e, "text/html");
    return this.processForDirectives(r.body, o.props), this.processConditionalRendering(r.body, o.props), this.processTemplateExpressions(r.body, o.props), r.body.innerHTML;
  }
  processConditionalRendering(e, o) {
    e.querySelectorAll("[render-if]").forEach((r) => {
      const s = r.getAttribute("render-if");
      r.removeAttribute("render-if"), this.evaluateCondition(o, s) || r.remove();
    });
  }
  processTemplateExpressions(e, o) {
    const t = document.createTreeWalker(
      e,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      null
    );
    for (; t.nextNode(); ) {
      const r = t.currentNode;
      r.nodeType === Node.TEXT_NODE ? this.processTextNode(r, o) : r.nodeType === Node.ELEMENT_NODE && this.processElementAttributes(r, o);
    }
  }
  processTextNode(e, o) {
    const t = e.nodeValue.replace(
      /\[\[\s*([^\]]+?)\s*\]\]/g,
      (r, s) => this.evaluateExpression(s, o)
    );
    t !== e.nodeValue && (e.nodeValue = t);
  }
  evaluateExpression(e, o) {
    try {
      const t = {
        ...o,
        Math,
        Date,
        JSON
      }, r = new Function(
        ...Object.keys(t),
        `return ${e}`
      )(...Object.values(t));
      if (r == null)
        return "";
      if (typeof r == "object") {
        if (r instanceof HTMLElement) {
          const s = r.outerHTML, i = document.createElement("div");
          return i.innerHTML = s, i.innerHTML;
        }
        return JSON.stringify(r, null, 2);
      }
      return String(r);
    } catch (t) {
      return console.warn(`Error evaluating expression "${e}":`, t), "";
    }
  }
  processElementAttributes(e, o) {
    Array.from(e.attributes).forEach((t) => {
      t.value.includes("[[") && e.setAttribute(
        t.name,
        t.value.replace(
          /\[\[\s*([^\]]+?)\s*\]\]/g,
          (r, s) => this.getPropertyValue(o, s)
        )
      );
    });
  }
  getPropertyValue(e, o) {
    const t = o.split(".").reduce((r, s) => r == null ? void 0 : r[s], e);
    return t == null ? "" : typeof t == "object" ? JSON.stringify(t, null, 2) : String(t);
  }
  evaluateCondition(e, o) {
    if (o.startsWith("!"))
      return !this.getPropertyValue(e, o.substring(1));
    if (o.includes("===")) {
      const [r, s] = o.split("===").map((i) => i.trim());
      return this.getPropertyValue(e, r) === s;
    }
    const t = this.getPropertyValue(e, o);
    return ["number", "boolean"].includes(typeof t) ? Boolean(t) : !!t;
  }
  processForDirectives(e, o) {
    Array.from(e.querySelectorAll("[render-for]")).forEach((r) => {
      const s = r.getAttribute("render-for");
      r.removeAttribute("render-for");
      const { itemName: i, indexName: a, collectionPath: n } = this.parseForExpression(s);
      if (!i || !n) {
        console.warn(`Invalid render-for expression: ${s}`);
        return;
      }
      const l = this.getNestedProperty(o, n);
      if (!l) {
        r.remove();
        return;
      }
      this.renderCollection(
        r,
        l,
        i,
        a || "",
        o
      );
    });
  }
  // Метод для парсинга for
  parseForExpression(e) {
    const t = e.replace(/\s*,\s*/g, ",").trim().split(/\s+/).filter(Boolean);
    if (t.length === 3 && t[1] === "in") {
      const r = t[0].match(/^\((\w+),(\w+)\)$/);
      if (r)
        return {
          itemName: r[1],
          indexName: r[2],
          collectionPath: t[2]
        };
    }
    if (t.length === 3 && t[1] === "in")
      return {
        itemName: t[0],
        collectionPath: t[2]
      };
    throw new Error(`Invalid render-for expression: ${e}`);
  }
  renderCollection(e, o, t, r, s) {
    const i = e.parentNode, a = document.createDocumentFragment(), n = Array.isArray(o);
    Object.entries(o).forEach(([l, c], b) => {
      const m = e.cloneNode(!0), f = {
        ...s,
        [t]: c,
        ...r ? { [r]: n ? b : l } : {},
        $key: `${l}-${b}`,
        $index: b,
        $parent: s
      };
      this.processNode(m, f), a.appendChild(m);
    }), i.replaceChild(a, e);
  }
  processNode(e, o) {
    this.processElementAttributes(e, o), this.processConditionalRendering(e, o);
    const t = document.createTreeWalker(
      e,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      null
    );
    for (; t.nextNode(); ) {
      const r = t.currentNode;
      r.nodeType === Node.TEXT_NODE ? this.processTextNode(r, o) : r.nodeType === Node.ELEMENT_NODE && this.processNode(r, o);
    }
  }
  getNestedProperty(e, o) {
    return o.split(".").reduce((t, r) => {
      const s = r.match(/^(\w+)\[(\d+)\]$/);
      return s && Array.isArray(t == null ? void 0 : t[s[1]]) ? t[s[1]][Number(s[2])] : t == null ? void 0 : t[r];
    }, e);
  }
}
var d = /* @__PURE__ */ ((p) => (p.ADD = "add", p.EDIT = "edit", p.REMOVE = "remove", p.MOVE_NEXT = "move-next", p.MOVE_PREV = "move-prev", p))(d || {});
const _ = `
    <button class="bb-btn-control bb-border-box" title="[[type]]">
        <svg class="svg-icon bb-btn-control__svg"><use href="#bb-icon-[[type]]"></use></svg>
    </button>
`, C = `
    <svg
        id="__svg__icons__dom__"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:link="http://www.w3.org/1999/xlink"
        style="position: absolute; width: 0px; height: 0px;"
    >
        <symbol viewBox="0 0 12 7.7" id="bb-icon-chevron-down"><path d="M6 7.7c-.3 0-.5-.1-.7-.3l-5-5C-.1 2-.1 1.4.3 1s1-.4 1.4 0L6 5.2 10.3 1c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-5 5c-.2.2-.4.3-.7.3z" stroke="currentColor"></path></symbol>

        <symbol viewBox="0 0 94.926 94.926" id="bb-icon-cross">
            <path
                d="M55.931 47.463 94.306 9.09a2.118 2.118 0 0 0 0-2.994L88.833.62a2.123 2.123 0 0 0-2.996 0L47.463 38.994 9.089.62c-.795-.795-2.202-.794-2.995 0L.622 6.096a2.117 2.117 0 0 0 0 2.994l38.374 38.373L.622 85.836a2.117 2.117 0 0 0 0 2.994l5.473 5.476a2.123 2.123 0 0 0 2.995 0l38.374-38.374 38.374 38.374c.397.396.937.62 1.498.62s1.101-.224 1.498-.62l5.473-5.476a2.118 2.118 0 0 0 0-2.994L55.931 47.463z"
                fill="currentColor"
            ></path>
        </symbol>

        <symbol viewBox="0 0 38.695 38.695" id="bb-icon-search">
            <path
                d="m29.25 25.062 9.445 9.445-4.191 4.185-9.437-9.438c1.398-1.396 2.788-2.798 4.183-4.192zM22.125 20.929l4.567 4.574-1.185 1.184-4.574-4.566c.422-.372.817-.77 1.192-1.192zM5.254 15.753h5.996c.414 0 .754.336.754.75s-.336.754-.754.75H5.254a.75.75 0 0 1 0-1.5zm0-4.5h13.5c.414 0 .75.332.754.746a.752.752 0 0 1-.754.754h-13.5a.749.749 0 0 1-.75-.754c0-.414.336-.746.75-.746zm0-4.5h13.5a.749.749 0 0 1 .754.75.756.756 0 0 1-.754.75h-13.5a.75.75 0 0 1 0-1.5zm6.75-6.75C5.367.003 0 5.362 0 11.999s5.367 12.004 12.004 12.004S24 18.636 24 11.999 18.641.003 12.004.003z"
            ></path>
        </symbol>

        <symbol viewBox="0 0 16 16" id="bb-icon-add">
            <path d="M15.8125 8C15.8125 8.24864 15.7137 8.4871 15.5379 8.66291C15.3621 8.83873 15.1236 8.9375 14.875 8.9375H8.9375V14.875C8.9375 15.1236 8.83873 15.3621 8.66291 15.5379C8.4871 15.7137 8.24864 15.8125 8 15.8125C7.75136 15.8125 7.5129 15.7137 7.33709 15.5379C7.16127 15.3621 7.0625 15.1236 7.0625 14.875V8.9375H1.125C0.87636 8.9375 0.637903 8.83873 0.462087 8.66291C0.286272 8.4871 0.1875 8.24864 0.1875 8C0.1875 7.75136 0.286272 7.5129 0.462087 7.33709C0.637903 7.16127 0.87636 7.0625 1.125 7.0625H7.0625V1.125C7.0625 0.87636 7.16127 0.637903 7.33709 0.462087C7.5129 0.286272 7.75136 0.1875 8 0.1875C8.24864 0.1875 8.4871 0.286272 8.66291 0.462087C8.83873 0.637903 8.9375 0.87636 8.9375 1.125V7.0625H14.875C15.1236 7.0625 15.3621 7.16127 15.5379 7.33709C15.7137 7.5129 15.8125 7.75136 15.8125 8Z" fill="currentColor"/>
        </symbol>

        <symbol viewBox="0 0 16 18" id="bb-icon-remove">
            <path d="M0.844318 4.64998H1.18477L2.74816 15.6561C2.93801 16.9924 4.10472 18 5.46189 18H10.5381C11.8951 18 13.0618 16.9924 13.252 15.6561L14.8154 4.64998H15.1557C15.622 4.64998 16 4.27408 16 3.81045C16 3.34683 15.622 2.97093 15.1557 2.97093H14.0819H11.6234V2.93834C11.6234 1.31811 10.2978 0 8.66828 0H7.33192C5.70245 0 4.37681 1.31811 4.37681 2.93834V2.97093H1.91827H0.844318C0.378047 2.97093 0 3.34683 0 3.81045C0 4.27408 0.378045 4.64998 0.844318 4.64998ZM6.06544 2.93834C6.06544 2.24393 6.63355 1.67905 7.33192 1.67905H8.66828C9.36665 1.67905 9.93476 2.24393 9.93476 2.93834V2.97093H6.06544V2.93834ZM5.22113 4.64998H10.7791H13.11L11.5799 15.421C11.5069 15.934 11.059 16.321 10.5381 16.321H5.46189C4.94099 16.321 4.49307 15.9342 4.4203 15.4212L2.89018 4.64998L5.22113 4.64998Z" fill="currentColor"/>
        </symbol>

        <symbol viewBox="0 0 16 16" id="bb-icon-edit">
            <path d="M13.7587 8.06464C13.2987 8.06464 12.9257 8.44698 12.9257 8.91854V14.292H1.66605V2.75028H6.90824C7.36828 2.75028 7.74127 2.36794 7.74127 1.89638C7.74127 1.42482 7.36828 1.04248 6.90824 1.04248H0.833024C0.372991 1.04248 0 1.42482 0 1.89638V15.1459C0 15.6175 0.372991 15.9998 0.833024 15.9998H13.7587C14.2188 15.9998 14.5918 15.6175 14.5918 15.1459V8.91854C14.5918 8.44698 14.2188 8.06464 13.7587 8.06464Z" fill="currentColor"/>
            <path d="M15.3092 0.707188C14.3891 -0.235729 12.8924 -0.235729 11.9723 0.707188L10.8929 1.81365L6.3185 6.5027C6.21437 6.60955 6.13973 6.74265 6.10211 6.88869L5.32837 9.89475C5.25271 10.1886 5.33518 10.5015 5.54476 10.7164C5.70309 10.8786 5.91582 10.9665 6.13384 10.9665C6.20471 10.9665 6.2761 10.9572 6.34636 10.9383L9.27893 10.1451C9.42139 10.1066 9.55125 10.03 9.65548 9.92331L14.2299 5.23426L15.3093 4.12779C16.2292 3.18477 16.2291 1.65031 15.3092 0.707188ZM8.63636 8.55261L7.30416 8.91295L7.65569 7.54736L11.4819 3.62512L12.4627 4.63047L8.63636 8.55261ZM14.1312 2.92012L13.6409 3.42279L12.6601 2.41744L13.1505 1.91487C13.4207 1.6376 13.8606 1.63749 14.1312 1.91476C14.4015 2.19203 14.4015 2.64306 14.1312 2.92012Z" fill="currentColor"/>
        </symbol>

        <symbol viewBox="0 0 12 16" id="bb-icon-move-next">
            <path d="M5.46967 15.5303C5.76256 15.8232 6.23744 15.8232 6.53033 15.5303L11.3033 10.7574C11.5962 10.4645 11.5962 9.98959 11.3033 9.6967C11.0104 9.40381 10.5355 9.40381 10.2426 9.6967L6 13.9393L1.75736 9.6967C1.46447 9.40381 0.989593 9.40381 0.6967 9.6967C0.403806 9.98959 0.403806 10.4645 0.6967 10.7574L5.46967 15.5303ZM5.25 3.27835e-08L5.25 15L6.75 15L6.75 -3.27835e-08L5.25 3.27835e-08Z" fill="currentColor"/>
        </symbol>

        <svg viewBox="0 0 12 16" id="bb-icon-move-prev">
            <path d="M5.46967 0.469669C5.76256 0.176776 6.23744 0.176776 6.53033 0.469669L11.3033 5.24264C11.5962 5.53553 11.5962 6.01041 11.3033 6.3033C11.0104 6.59619 10.5355 6.59619 10.2426 6.3033L6 2.06066L1.75736 6.3033C1.46447 6.59619 0.989593 6.59619 0.6967 6.3033C0.403806 6.01041 0.403806 5.53553 0.6967 5.24264L5.46967 0.469669ZM5.25 16L5.25 0.999999L6.75 0.999999L6.75 16L5.25 16Z" fill="currentColor"/>
        </svg>
    </svg>
`, u = `
    <div class="bb-modal bb-border-box" data-bb-modal>
        <div class="bb-modal__inner">
            <button class="bb-modal__close" data-bb-modal-close>
                X
            </button>
            <div class="bb-modal__body">
                [[ body ]]
            </div>
        </div>
    </div>

`, L = `
    <div class="bb-window-add-block bb-border-box">
        <div class="bb-window-add-block__inner">
            <div class="bb-window-add-block__aside">
                <div render-for="(item, index) in items" class="bb-window-add-block__aside-item" data-item="[[item.type]]">
                    [[ index + 1 ]]. [[ item.name ]]
                </div>
            </div>

            <div render-if="0 > 1" class="bb-window-add-block__list">
                <div render-for="item in items" class="bb-window-add-block__item">
                    [[ item.name ]]
                </div>
            </div>
        </div>
    </div>
`, E = `
    <form class="bb-form">
        <div class="bb-form__inner">
            <div class="bb-form__header">
                <div class="bb-form__title">
                    [[ title ]]
                </div>
            </div>

            <div class="bb-form__body">
                <div render-for="(item, i) in fields" class="bb-form__field">
                    [[ item ]]
                </div>
            </div>

            <div class="bb-form__footer">
                <button>кнопка отправить</button>
            </div>
        </div>
    </form>

`, g = `
    <div class="bb-input">
        <div class="bb-input__inner">
            <label for="" class="bb-input__label">
                [[ label ]]
            </label>
            <input class="bb-input__input" value="[[ value ]]" placeholder="[[ placeholder ]]" />
        </div>
    </div>

`, T = `
    <div class="bb-textarea">
        <div class="bb-textarea__inner">
            <label for="" class="bb-textarea__label">
                [[ label ]]
            </label>
            <textarea class="bb-textarea__textarea" placeholder="[[ placeholder ]]">[[ value ]]</textarea>
        </div>
    </div>

`, v = `
    <div class="bb-fieldset">
        <div class="bb-fieldset__inner">
            <div render-for="(item, i) in fields" class="bb-fieldset__item">
                [[ item ]]
            </div>
        </div>

        <div class="bb-fieldset__footer">
            <button>
                Добавить +
            </button>
        </div>
    </div>
`;
class M extends y {
  constructor(e, o, t) {
    super(), this.blocksData = e, this.renderers = o, this.registeredBlocks = t;
  }
  renderOpt(e) {
    var s;
    e.innerHTML = "", this.blocksData.forEach((i) => {
      const a = this.renderers[i.type], n = this.createFallbackBlock(i, a), l = this.getRenderControls(i), c = this.getRenderControl(i, d.ADD);
      c == null || c.classList.add("bb-block-control-add"), n && (n.append(l), c && n.append(c), n.classList.add("bb-block"), n.setAttribute("data-bb-type-block", i.type), n.setAttribute("id", i.id), e.appendChild(n));
    });
    const t = new DOMParser().parseFromString(C, "text/html"), r = (s = t == null ? void 0 : t.body) == null ? void 0 : s.firstChild;
    r && document.body.append(r);
  }
  getRenderControls(e) {
    const o = document.createElement("div");
    return o.classList.add("bb-block-controls", "bb-border-box"), [d.EDIT, d.REMOVE, d.MOVE_PREV, d.MOVE_NEXT].forEach((t) => {
      const r = this.getRenderControl(e, t);
      r && o.append(r);
    }), o;
  }
  getRenderControl(e, o) {
    const t = this.getRender(
      {
        id: `control-${o}-${e.id}`,
        type: `control-${o}`,
        name: "",
        props: {
          type: o
        }
      },
      _
    );
    return t ? (t.setAttribute("data-type", o), t.addEventListener("click", (r) => {
      if (!(r != null && r.currentTarget) || !(r.currentTarget instanceof HTMLElement))
        return;
      const s = r.currentTarget.getAttribute("data-type");
      s && ([d.EDIT, d.ADD].includes(s) && this.renderModalFromControlType(s, r), s === d.REMOVE && console.log("сквозное сообщение что блок удален"), s === d.MOVE_PREV && console.log("MOVE_PREV"), s === d.MOVE_NEXT && console.log("MOVE_NEXT"));
    }), t) : null;
  }
  createFields(e) {
    let o = [];
    for (let t in e.form) {
      const r = e.form[t], s = this.createField(r, t);
      s && o.push(s);
    }
    return o;
  }
  createField(e, o) {
    if (e.typeField, e.typeField === "text") {
      const t = this.getRender(
        {
          id: `bb-field-${e.typeField}-${o}`,
          type: `bb-field-${e.type}`,
          props: {
            label: e.label || "Текст",
            placeholder: e.placeholder || "",
            value: ""
          }
        },
        g
      );
      if (t)
        return t;
    }
    if (e.typeField === "textarea") {
      const t = this.getRender(
        {
          id: `bb-field-${e.typeField}-${o}`,
          type: `bb-field-${e.type}`,
          props: {
            label: e.label || "Текст большой",
            placeholder: e.placeholder || "",
            value: ""
          }
        },
        T
      );
      if (t)
        return t;
    }
    if (e.typeField === "each-array") {
      if (!Object.hasOwn(e, "each"))
        return console.warn("Для типа each-array свойство each обязательно! Reference ", e), null;
      const t = this.createField(e.each, o), r = e.each.typeField === "each-object" ? t : this.getRender(
        {
          id: `bb-fieldset-${e.typeField}-${o}`,
          type: `bb-fieldset-${e.type}`,
          props: {
            fields: [t]
          }
        },
        v
      );
      if (r)
        return r;
    }
    if (e.typeField === "each-object") {
      if (!Object.hasOwn(e, "each"))
        return console.warn("Для типа each-object свойство each обязательно! Reference ", e), null;
      let t = [];
      for (let s in e.each) {
        const i = this.createField(e.each[s], s);
        i && t.push(i);
      }
      const r = this.getRender(
        {
          id: `bb-fieldset-${e.typeField}-${o}`,
          type: `bb-fieldset-${e.type}`,
          props: {
            fields: t
          }
        },
        v
      );
      if (r)
        return r;
    }
    return null;
  }
  renderModalFromControlType(e, o) {
    var i, a;
    let t = null;
    if (e === d.ADD && (t = this.getRender(
      {
        id: "bb-window-add",
        type: "bb-window-add",
        props: {
          items: Object.values(this.registeredBlocks)
        }
      },
      L
    )), e === d.EDIT) {
      const n = (a = (i = o == null ? void 0 : o.target) == null ? void 0 : i.closest("[data-bb-type-block]")) == null ? void 0 : a.getAttribute("data-bb-type-block"), l = n ? this.registeredBlocks[n] : null;
      let c = this.createFields(l);
      t = this.getRender(
        {
          id: "bb-form-edit",
          type: "bb-form-edit",
          props: {
            title: l == null ? void 0 : l.name,
            fields: c
          }
        },
        E
      );
    }
    const r = this.getRender(
      {
        id: `bb-modal-${e}`,
        type: `bb-modal-${e}`,
        name: "",
        props: {
          body: t
        }
      },
      u
    );
    this.createModal(r);
    const s = r == null ? void 0 : r.querySelectorAll("[data-item]");
    s == null || s.forEach((n) => {
      n.addEventListener("click", (l) => {
        if (!(l.currentTarget instanceof HTMLElement))
          return;
        const c = l.currentTarget.getAttribute("data-item"), b = c ? this.registeredBlocks[c] : null;
        let m = this.createFields(b);
        const f = this.getRender(
          {
            id: "bb-form-edit",
            type: "bb-form-edit",
            props: {
              title: b == null ? void 0 : b.name,
              fields: m
            }
          },
          E
        ), h = this.getRender(
          {
            id: `bb-modal-${e}`,
            type: `bb-modal-${e}`,
            name: "",
            props: {
              body: f
            }
          },
          u
        );
        console.log("click form", h), this.createModal(h);
      });
    });
  }
  getModalRender() {
    return this.getRender(
      {
        id: "bb-modal",
        type: "bb-modal",
        name: "",
        props: {
          body: { a: 123, test: "mnogo4len" }
        }
      },
      u
    );
  }
  createModal(e) {
    if (!e)
      return;
    const o = document.querySelector("[data-bb-modal]");
    o && o.remove(), e.addEventListener("click", (t) => {
      !t.target || !(t.target instanceof HTMLElement) || (t.target.hasAttribute("data-bb-modal-close") || t.target.hasAttribute("data-bb-modal")) && (e.remove(), document.body.classList.remove("bb-scrollbar-is-locked"));
    }), document.body.classList.add("bb-scrollbar-is-locked"), document.body.append(e);
  }
}
export {
  y as BaseBlockRenderer,
  M as OptBlockRenderer
};

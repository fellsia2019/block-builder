"use strict";var L=Object.defineProperty;var M=(l,e,t)=>e in l?L(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var h=(l,e,t)=>(M(l,typeof e!="symbol"?e+"":e,t),t);Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});class g{constructor(){}getRender(e,t){return this.createFallbackBlock(e,t)}createFallbackBlock(e,t){var n;let r=this.decodeHTMLEntities(this.renderTemplate(t,e));const s=new DOMParser().parseFromString(r,"text/html");return((n=s==null?void 0:s.body)==null?void 0:n.firstChild)||null}decodeHTMLEntities(e){const t=document.createElement("textarea");return t.innerHTML=e,t.value}renderTemplate(e,t){const o=new DOMParser().parseFromString(e,"text/html");return this.processForDirectives(o.body,t.props),this.processConditionalRendering(o.body,t.props),this.processTemplateExpressions(o.body,t.props),o.body.innerHTML}processConditionalRendering(e,t){e.querySelectorAll("[render-if]").forEach(o=>{const s=o.getAttribute("render-if");o.removeAttribute("render-if"),this.evaluateCondition(t,s)||o.remove()})}processTemplateExpressions(e,t){const r=document.createTreeWalker(e,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,null);for(;r.nextNode();){const o=r.currentNode;o.nodeType===Node.TEXT_NODE?this.processTextNode(o,t):o.nodeType===Node.ELEMENT_NODE&&this.processElementAttributes(o,t)}}processTextNode(e,t){const r=e.nodeValue.replace(/\[\[\s*([^\]]+?)\s*\]\]/g,(o,s)=>this.evaluateExpression(s,t));r!==e.nodeValue&&(e.nodeValue=r)}evaluateExpression(e,t){try{const r={...t,Math,Date,JSON},o=new Function(...Object.keys(r),`return ${e}`)(...Object.values(r));if(o==null)return"";if(typeof o=="object"){if(o instanceof HTMLElement){const s=o.outerHTML,i=document.createElement("div");return i.innerHTML=s,i.innerHTML}return JSON.stringify(o,null,2)}return String(o)}catch(r){return console.warn(`Error evaluating expression "${e}":`,r),""}}processElementAttributes(e,t){Array.from(e.attributes).forEach(r=>{r.value.includes("[[")&&e.setAttribute(r.name,r.value.replace(/\[\[\s*([^\]]+?)\s*\]\]/g,(o,s)=>this.getPropertyValue(t,s)))})}getPropertyValue(e,t){const r=t.split(".").reduce((o,s)=>o==null?void 0:o[s],e);return r==null?"":typeof r=="object"?JSON.stringify(r,null,2):String(r)}evaluateCondition(e,t){if(t.startsWith("!"))return!this.getPropertyValue(e,t.substring(1));if(t.includes("===")){const[o,s]=t.split("===").map(i=>i.trim());return this.getPropertyValue(e,o)===s}const r=this.getPropertyValue(e,t);return["number","boolean"].includes(typeof r)?Boolean(r):!!r}processForDirectives(e,t){Array.from(e.querySelectorAll("[render-for]")).forEach(o=>{const s=o.getAttribute("render-for");o.removeAttribute("render-for");const{itemName:i,indexName:n,collectionPath:a}=this.parseForExpression(s);if(!i||!a){console.warn(`Invalid render-for expression: ${s}`);return}const d=this.getNestedProperty(t,a);if(!d){o.remove();return}this.renderCollection(o,d,i,n||"",t)})}parseForExpression(e){const r=e.replace(/\s*,\s*/g,",").trim().split(/\s+/).filter(Boolean);if(r.length===3&&r[1]==="in"){const o=r[0].match(/^\((\w+),(\w+)\)$/);if(o)return{itemName:o[1],indexName:o[2],collectionPath:r[2]}}if(r.length===3&&r[1]==="in")return{itemName:r[0],collectionPath:r[2]};throw new Error(`Invalid render-for expression: ${e}`)}renderCollection(e,t,r,o,s){const i=e.parentNode,n=document.createDocumentFragment(),a=Array.isArray(t);Object.entries(t).forEach(([d,b],c)=>{const p=e.cloneNode(!0),m={...s,[r]:b,...o?{[o]:a?c:d}:{},$key:`${d}-${c}`,$index:c,$parent:s};this.processNode(p,m),n.appendChild(p)}),i.replaceChild(n,e)}processNode(e,t){this.processElementAttributes(e,t),this.processConditionalRendering(e,t);const r=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,null);for(;r.nextNode();){const o=r.currentNode;o.nodeType===Node.TEXT_NODE?this.processTextNode(o,t):o.nodeType===Node.ELEMENT_NODE&&this.processNode(o,t)}}getNestedProperty(e,t){return t.split(".").reduce((r,o)=>{const s=o.match(/^(\w+)\[(\d+)\]$/);return s&&Array.isArray(r==null?void 0:r[s[1]])?r[s[1]][Number(s[2])]:r==null?void 0:r[o]},e)}}var f=(l=>(l.ADD="add",l.EDIT="edit",l.REMOVE="remove",l.MOVE_NEXT="move-next",l.MOVE_PREV="move-prev",l))(f||{});const F=`
    <button class="bb-btn-control bb-border-box" title="[[ type ]]" data-bb-control data-type="[[ type ]]">
        <svg class="svg-icon bb-btn-control__svg"><use href="#bb-icon-[[ type ]]"></use></svg>
    </button>
`,w=`
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
`,_=`
    <div class="bb-modal bb-border-box" data-bb-modal>
        <div class="bb-modal__inner">
            <button class="bb-modal__close" data-bb-modal-close>
                <svg class="svg-icon bb-modal__close-icon"><use href="#bb-icon-cross"></use></svg>
            </button>
            <div class="bb-modal__body">
                [[ body ]]
            </div>
        </div>
    </div>

`,A=`
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
`,T=`
    <button class="bb-custom-button" data-theme="[[ btnTheme ]]" data-size="[[ btnSize ]]" data-bb-button>
        <div class="bb-custom-button__inner">
            <span>[[ btnText ]]</span>
            <svg render-if="btnIcon" class="svg-icon bb-custom-button__svg"><use href="#bb-icon-[[ btnIcon ]]"></use></svg>
        </div>
    </button>
`,y=`
    <form class="bb-form" data-bb-form>
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
                ${T}
            </div>
        </div>
    </form>
`,x=`
    <div class="bb-input bb-base-field" data-bb-field-key="[[ key ]]">
        <div class="bb-input__inner">
            <label for="bb-control-[[ id ]]" class="bb-input__label bb-base-field__label">
                [[ label ]]
            </label>
            <input id="bb-control-[[ id ]]" class="bb-input__input bb-base-field__field" value="[[ value ]]" placeholder="[[ placeholder ]]" />
        </div>
    </div>

`,O=`
    <div class="bb-textarea bb-base-field" data-bb-field-key="[[ key ]]">
        <div class="bb-textarea__inner">
            <label for="bb-control-[[ id ]]" class="bb-textarea__label bb-base-field__label">
                [[ label ]]
            </label>
            <textarea id="bb-control-[[ id ]]" class="bb-textarea__textarea bb-base-field__field" placeholder="[[ placeholder ]]">[[ value ]]</textarea>
        </div>
    </div>

`,v=`
    <div class="bb-fieldset" data-bb-field-key="[[ key ]]">
        <div render-if="label" class="bb-fieldset__label">
            [[ label ]]
        </div>
        <div class="bb-fieldset__inner">
            <div render-for="item in fields" class="bb-fieldset__item">
                [[ item ]]

                <button class="bb-fieldset__remove">
                    <svg class="svg-icon bb-fieldset__remove-icon"><use href="#bb-icon-cross"></use></svg>
                </button>
            </div>
        </div>

        <div class="bb-fieldset__footer">
            ${T}
        </div>
    </div>
`,E=`
    <div class="bb-group-field" data-bb-field-key="[[ key ]]">
        <div class="bb-group-field__inner">
            <div render-for="item in fields" class="bb-group-field__item">
                [[ item ]]
            </div>
        </div>
    </div>
`,k=`
    <div class="bb-opt-block" id="[[ id ]]" data-bb-type-block="[[ type ]]">
        <div class="bb-opt-block__inner">
            <div render-if="controlAddTop" class="bb-opt-block__control-add">
                [[ controlAddTop ]]
            </div>

            <div class="bb-opt-block__body">
                [[ userBlock ]]
                [[ controls ]]
            </div>

            <div class="bb-opt-block__control-add">
                [[ controlAddBottom ]]
            </div>
        </div>
    </div>
`;class N{constructor(e){h(this,"schema");h(this,"data");this.schema=e,this.data={}}update(e){this.data=e}getData(){return this.data}}class ${constructor(e){h(this,"schema");this.schema=e}parse(e){const t={};for(const[r,o]of Object.entries(this.schema))o.typeField==="each-array"?t[r]=this._parseArrayField(e,r,o):t[r]=this._parseSimpleField(e,r);return t}_parseSimpleField(e,t){const r=e.querySelector(`[data-bb-field-key="${t}"]`);if(!r)return"";const o=r.querySelector(".bb-base-field__field");return o?o.value:""}_parseArrayField(e,t,r){const o=e.querySelector(`[data-bb-field-key="${t}"]`);if(!o)return[];const s=o.querySelectorAll(".bb-fieldset__item"),i=[];return s.forEach(n=>{if(r.each.typeField==="each-object"){const a={};for(const[d,b]of Object.entries(r.each.each)){const c=n.querySelector(`[data-bb-field-key="${d}"]`);if(c){const p=c.querySelector(".bb-base-field__field");a[d]=p?p.value:""}}i.push(a)}else{const a=n.querySelector(".bb-base-field__field");a&&a.value&&i.push(a.value)}}),i}}class D{constructor(e,t){h(this,"model");h(this,"parser");h(this,"formElement");this.model=new N(t),this.parser=new $(t),this.formElement=e}getFormData(){const e=this.parser.parse(this.formElement);return this.model.update(e),this.model.getData()}}function S(l){return typeof l=="string"||Array.isArray(l)?!(l!=null&&l.length):typeof l=="object"?!Object.keys(l).some(Boolean):!l}class H extends g{constructor(e,t,r,o){super(),this.blocksData=e,this.renderers=t,this.manager=r,this.renderHTMLContainer=o,this.renderOptMain(),this.renderOptServices()}get registeredBlocks(){return this.manager.getRegisteredBlocks()}renderOptMain(){this.renderHTMLContainer.innerHTML="",this.blocksData.forEach((e,t)=>{const r=this.renderers[e.type],o=this.createFallbackBlock(e,r),s=this.getRenderControls(e),i=this.getRenderControl(e,f.ADD);if(i==null||i.classList.add("bb-block-control-add"),!o)return;const n=this.getRender({id:e.id,type:e.type,name:"",props:{controlAddTop:i&&t===0?i:null,controlAddBottom:i||null,controls:s,userBlock:o,id:e.id,type:e.type}},k);if(!n)return;this.renderHTMLContainer.append(n),n.querySelectorAll("[data-bb-control]").forEach(d=>{d.addEventListener("click",b=>{if(!(b!=null&&b.currentTarget)||!(b.currentTarget instanceof HTMLElement))return;const c=b.currentTarget.getAttribute("data-type");if(c){if([f.EDIT,f.ADD].includes(c)){this.renderModalFromControlType(c,b);const p=document.querySelector("[data-bb-modal]"),m=p==null?void 0:p.querySelector("[data-bb-form]");m==null||m.addEventListener("submit",u=>{u.preventDefault();const C=new D(m,e.form).getFormData();console.log("!!!!!!!!!!!!!!!",C)})}c===f.REMOVE&&(console.log("сквозное сообщение что блок удален"),this.removeBlockFromControl(b)),c===f.MOVE_PREV&&this.moveBlockFromControl(f.MOVE_PREV,b),c===f.MOVE_NEXT&&this.moveBlockFromControl(f.MOVE_NEXT,b)}})})})}renderOptServices(){var o;const t=new DOMParser().parseFromString(w,"text/html"),r=(o=t==null?void 0:t.body)==null?void 0:o.firstChild;r&&document.body.append(r)}getRenderControls(e){const t=document.createElement("div");return t.classList.add("bb-block-controls","bb-border-box"),[f.EDIT,f.REMOVE,f.MOVE_PREV,f.MOVE_NEXT].forEach(r=>{const o=this.getRenderControl(e,r);o&&t.append(o)}),t}getRenderControl(e,t){const r=this.getRender({id:`control-${t}-${e.id}`,type:`control-${t}`,name:"",props:{type:t}},F);return r||null}moveBlockFromControl(e,t){var s,i;const r=(i=(s=t==null?void 0:t.target)==null?void 0:s.closest("[data-bb-type-block]"))==null?void 0:i.getAttribute("id"),o=this.blocksData.findIndex(n=>n.id===r);!this.blocksData[o]||!r||(e===f.MOVE_PREV&&this.manager.movePrevBlock(o),e===f.MOVE_NEXT&&this.manager.moveNextBlock(o),this.updateDataFromManager(),setTimeout(()=>{this.scrollToBlock(r)},100))}scrollToBlock(e){var t;(t=document.getElementById(e))==null||t.scrollIntoView({behavior:"smooth"})}removeBlockFromControl(e){var r,o;const t=(o=(r=e==null?void 0:e.target)==null?void 0:r.closest("[data-bb-type-block]"))==null?void 0:o.getAttribute("id");t&&this.removeBlock(t)}removeBlock(e){this.manager.removeBlock(e),this.updateDataFromManager()}updateDataFromManager(){this.blocksData=this.manager.getBlocks(),this.renderOptMain()}createFields(e){let t=[];for(let r in e.form){const o=e.form[r],s=e.props[r],i=S(s)?null:s,n=this.createField(o,r,i);n&&t.push(n)}return t}createField(e,t,r){if(e.typeField,e.typeField==="text"){const o=this.getRender({id:`bb-field-${e.typeField}-${t}`,type:`bb-field-${e.type}`,props:{label:e.label||"Текст",placeholder:e.placeholder||"",value:r||"",id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,key:t}},x);if(o)return o}if(e.typeField==="textarea"){const o=this.getRender({id:`bb-field-${e.typeField}-${t}`,type:`bb-field-${e.type}`,props:{label:e.label||"Текст большой",placeholder:e.placeholder||"",value:r||"",id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,key:t}},O);if(o)return o}if(e.typeField==="each-array"){if(!Object.hasOwn(e,"each"))return console.warn("Для типа each-array свойство each обязательно! Reference ",e),null;const o=e.each.typeField==="each-object"?this.createField(e.each,t,r):this.createField(e.each,t);let s=[];Array.isArray(r)&&r.length&&e.each.typeField!=="each-object"&&r.forEach(n=>{s.push(this.createField(e.each,t,n))});const i=e.each.typeField==="each-object"?o:this.getRender({id:`bb-fieldset-${e.typeField}-${t}`,type:`bb-fieldset-${e.type}`,props:{fields:[...s,o],label:e.label||"",btnText:"Добавить",btnIcon:"add",btnTheme:"dark-outline",btnSize:"sm",key:t}},v);if(i)return i}if(e.typeField==="each-object"){if(!Object.hasOwn(e,"each"))return console.warn("Для типа each-object свойство each обязательно! Reference ",e),null;let o=[];for(let a in e.each){const d=this.createField(e.each[a],a);d&&o.push(d)}const s=this.getRender({id:`bb-fieldset-${e.typeField}-${t}`,type:`bb-fieldset-${e.type}`,props:{fields:o,key:t}},E);let i=[];Array.isArray(r)&&r.forEach(a=>{let d=[];for(let c in a){const p=a[c],m=this.createField(e.each[c],c,p);m&&d.push(m)}const b=this.getRender({id:`bb-fieldset-${e.typeField}-${t}`,type:`bb-fieldset-${e.type}`,props:{fields:d,key:t}},E);i.push(b)});const n=this.getRender({id:`bb-fieldset-${e.typeField}-${t}`,type:`bb-fieldset-${e.type}`,props:{fields:[...i,s],label:e.label||"",btnText:"Добавить",btnIcon:"add",btnTheme:"dark-outline",btnSize:"sm",key:t}},v);if(n)return n}return null}renderModalFromControlType(e,t){var i,n;let r=null;if(e===f.ADD&&(r=this.getRender({id:"bb-window-add",type:"bb-window-add",props:{items:Object.values(this.registeredBlocks)}},A)),e===f.EDIT){const a=(n=(i=t==null?void 0:t.target)==null?void 0:i.closest("[data-bb-type-block]"))==null?void 0:n.getAttribute("id"),d=this.blocksData.find(p=>p.id===a);let b=this.createFields(d);r=this.getRender({id:"bb-form-edit",type:"bb-form-edit",props:{title:d==null?void 0:d.name,fields:b,btnText:"Сохранить"}},y)}const o=this.getRender({id:`bb-modal-${e}`,type:`bb-modal-${e}`,name:"",props:{body:r}},_);this.createModal(o);const s=o==null?void 0:o.querySelectorAll("[data-item]");s==null||s.forEach(a=>{a.addEventListener("click",d=>{if(!(d.currentTarget instanceof HTMLElement))return;const b=d.currentTarget.getAttribute("data-item"),c=b?this.registeredBlocks[b]:null;let p=this.createFields(c);const m=this.getRender({id:`bb-form-${e}`,type:`bb-form-${e}`,props:{title:c==null?void 0:c.name,fields:p}},y),u=this.getRender({id:`bb-modal-${e}`,type:`bb-modal-${e}`,name:"",props:{body:m}},_);this.createModal(u)})})}createModal(e){if(!e)return;const t=document.querySelector("[data-bb-modal]");t&&t.remove(),e.addEventListener("click",r=>{!r.target||!(r.target instanceof HTMLElement)||(r.target.hasAttribute("data-bb-modal-close")||r.target.hasAttribute("data-bb-modal"))&&(e.remove(),document.body.classList.remove("bb-scrollbar-is-locked"))}),document.body.classList.add("bb-scrollbar-is-locked"),document.body.append(e)}}exports.BaseBlockRenderer=g;exports.OptBlockRenderer=H;

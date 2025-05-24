"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});class E{constructor(){}getRender(e,r){return this.createFallbackBlock(e,r)}createFallbackBlock(e,r){var n;let t=this.decodeHTMLEntities(this.renderTemplate(r,e));const s=new DOMParser().parseFromString(t,"text/html");return((n=s==null?void 0:s.body)==null?void 0:n.firstChild)||null}decodeHTMLEntities(e){const r=document.createElement("textarea");return r.innerHTML=e,r.value}renderTemplate(e,r){const o=new DOMParser().parseFromString(e,"text/html");return this.processForDirectives(o.body,r.props),this.processConditionalRendering(o.body,r.props),this.processTemplateExpressions(o.body,r.props),o.body.innerHTML}processConditionalRendering(e,r){e.querySelectorAll("[render-if]").forEach(o=>{const s=o.getAttribute("render-if");o.removeAttribute("render-if"),this.evaluateCondition(r,s)||o.remove()})}processTemplateExpressions(e,r){const t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,null);for(;t.nextNode();){const o=t.currentNode;o.nodeType===Node.TEXT_NODE?this.processTextNode(o,r):o.nodeType===Node.ELEMENT_NODE&&this.processElementAttributes(o,r)}}processTextNode(e,r){const t=e.nodeValue.replace(/\[\[\s*([^\]]+?)\s*\]\]/g,(o,s)=>this.evaluateExpression(s,r));t!==e.nodeValue&&(e.nodeValue=t)}evaluateExpression(e,r){try{const t={...r,Math,Date,JSON},o=new Function(...Object.keys(t),`return ${e}`)(...Object.values(t));if(o==null)return"";if(typeof o=="object"){if(o instanceof HTMLElement){const s=o.outerHTML,i=document.createElement("div");return i.innerHTML=s,i.innerHTML}return JSON.stringify(o,null,2)}return String(o)}catch(t){return console.warn(`Error evaluating expression "${e}":`,t),""}}processElementAttributes(e,r){Array.from(e.attributes).forEach(t=>{t.value.includes("[[")&&e.setAttribute(t.name,t.value.replace(/\[\[\s*([^\]]+?)\s*\]\]/g,(o,s)=>this.getPropertyValue(r,s)))})}getPropertyValue(e,r){const t=r.split(".").reduce((o,s)=>o==null?void 0:o[s],e);return t==null?"":typeof t=="object"?JSON.stringify(t,null,2):String(t)}evaluateCondition(e,r){if(r.startsWith("!"))return!this.getPropertyValue(e,r.substring(1));if(r.includes("===")){const[o,s]=r.split("===").map(i=>i.trim());return this.getPropertyValue(e,o)===s}const t=this.getPropertyValue(e,r);return["number","boolean"].includes(typeof t)?Boolean(t):!!t}processForDirectives(e,r){Array.from(e.querySelectorAll("[render-for]")).forEach(o=>{const s=o.getAttribute("render-for");o.removeAttribute("render-for");const{itemName:i,indexName:n,collectionPath:p}=this.parseForExpression(s);if(!i||!p){console.warn(`Invalid render-for expression: ${s}`);return}const l=this.getNestedProperty(r,p);if(!l){o.remove();return}this.renderCollection(o,l,i,n||"",r)})}parseForExpression(e){const t=e.replace(/\s*,\s*/g,",").trim().split(/\s+/).filter(Boolean);if(t.length===3&&t[1]==="in"){const o=t[0].match(/^\((\w+),(\w+)\)$/);if(o)return{itemName:o[1],indexName:o[2],collectionPath:t[2]}}if(t.length===3&&t[1]==="in")return{itemName:t[0],collectionPath:t[2]};throw new Error(`Invalid render-for expression: ${e}`)}renderCollection(e,r,t,o,s){const i=e.parentNode,n=document.createDocumentFragment(),p=Array.isArray(r);Object.entries(r).forEach(([l,a],d)=>{const m=e.cloneNode(!0),f={...s,[t]:a,...o?{[o]:p?d:l}:{},$key:`${l}-${d}`,$index:d,$parent:s};this.processNode(m,f),n.appendChild(m)}),i.replaceChild(n,e)}processNode(e,r){this.processElementAttributes(e,r),this.processConditionalRendering(e,r);const t=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,null);for(;t.nextNode();){const o=t.currentNode;o.nodeType===Node.TEXT_NODE?this.processTextNode(o,r):o.nodeType===Node.ELEMENT_NODE&&this.processNode(o,r)}}getNestedProperty(e,r){return r.split(".").reduce((t,o)=>{const s=o.match(/^(\w+)\[(\d+)\]$/);return s&&Array.isArray(t==null?void 0:t[s[1]])?t[s[1]][Number(s[2])]:t==null?void 0:t[o]},e)}}var b=(c=>(c.ADD="add",c.EDIT="edit",c.REMOVE="remove",c.MOVE_NEXT="move-next",c.MOVE_PREV="move-prev",c))(b||{});const T=`
    <button class="bb-btn-control bb-border-box" title="[[ type ]]" data-bb-control data-type="[[ type ]]">
        <svg class="svg-icon bb-btn-control__svg"><use href="#bb-icon-[[ type ]]"></use></svg>
    </button>
`,C=`
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
`,h=`
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

`,L=`
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
`,g=`
    <button class="bb-custom-button" data-theme="[[ btnTheme ]]" data-size="[[ btnSize ]]">
        <div class="bb-custom-button__inner">
            <span>[[ btnText ]]</span>
            <svg render-if="btnIcon" class="svg-icon bb-custom-button__svg"><use href="#bb-icon-[[ btnIcon ]]"></use></svg>
        </div>
    </button>
`,u=`
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
                ${g}
            </div>
        </div>
    </form>
`,M=`
    <div class="bb-input bb-base-field">
        <div class="bb-input__inner">
            <label for="bb-control-[[ id ]]" class="bb-input__label bb-base-field__label">
                [[ label ]]
            </label>
            <input id="bb-control-[[ id ]]" class="bb-input__input bb-base-field__field" value="[[ value ]]" placeholder="[[ placeholder ]]" />
        </div>
    </div>

`,w=`
    <div class="bb-textarea bb-base-field">
        <div class="bb-textarea__inner">
            <label for="bb-control-[[ id ]]" class="bb-textarea__label bb-base-field__label">
                [[ label ]]
            </label>
            <textarea id="bb-control-[[ id ]]" class="bb-textarea__textarea bb-base-field__field" placeholder="[[ placeholder ]]">[[ value ]]</textarea>
        </div>
    </div>

`,_=`
    <div class="bb-fieldset">
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
            ${g}
        </div>
    </div>
`,v=`
    <div class="bb-group-field">
        <div class="bb-group-field__inner">
            <div render-for="item in fields" class="bb-group-field__item">
                [[ item ]]
            </div>
        </div>
    </div>
`,x=`
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
`;function A(c){return typeof c=="string"||Array.isArray(c)?!(c!=null&&c.length):typeof c=="object"?!Object.keys(c).some(Boolean):!c}class F extends E{constructor(e,r,t,o){super(),this.blocksData=e,this.renderers=r,this.manager=t,this.renderHTMLContainer=o,this.renderOptMain(),this.renderOptServices()}get registeredBlocks(){return this.manager.getRegisteredBlocks()}renderOptMain(){this.renderHTMLContainer.innerHTML="",this.blocksData.forEach((e,r)=>{const t=this.renderers[e.type],o=this.createFallbackBlock(e,t),s=this.getRenderControls(e),i=this.getRenderControl(e,b.ADD);if(i==null||i.classList.add("bb-block-control-add"),!o)return;const n=this.getRender({id:e.id,type:e.type,name:"",props:{controlAddTop:i&&r===0?i:null,controlAddBottom:i||null,controls:s,userBlock:o,id:e.id,type:e.type}},x);if(!n)return;this.renderHTMLContainer.appendChild(n),this.renderHTMLContainer.querySelectorAll("[data-bb-control]").forEach(l=>{l.addEventListener("click",a=>{if(!(a!=null&&a.currentTarget)||!(a.currentTarget instanceof HTMLElement))return;const d=a.currentTarget.getAttribute("data-type");d&&([b.EDIT,b.ADD].includes(d)&&this.renderModalFromControlType(d,a),d===b.REMOVE&&(console.log("сквозное сообщение что блок удален"),this.removeBlockFromControl(a)),d===b.MOVE_PREV&&this.moveBlockFromControl(b.MOVE_PREV,a),d===b.MOVE_NEXT&&this.moveBlockFromControl(b.MOVE_NEXT,a))})})})}renderOptServices(){var o;const r=new DOMParser().parseFromString(C,"text/html"),t=(o=r==null?void 0:r.body)==null?void 0:o.firstChild;t&&document.body.append(t)}getRenderControls(e){const r=document.createElement("div");return r.classList.add("bb-block-controls","bb-border-box"),[b.EDIT,b.REMOVE,b.MOVE_PREV,b.MOVE_NEXT].forEach(t=>{const o=this.getRenderControl(e,t);o&&r.append(o)}),r}getRenderControl(e,r){const t=this.getRender({id:`control-${r}-${e.id}`,type:`control-${r}`,name:"",props:{type:r}},T);return t||null}moveBlockFromControl(e,r){var s,i;const t=(i=(s=r==null?void 0:r.target)==null?void 0:s.closest("[data-bb-type-block]"))==null?void 0:i.getAttribute("id"),o=this.blocksData.findIndex(n=>n.id===t);!this.blocksData[o]||!t||(e===b.MOVE_PREV&&this.manager.movePrevBlock(o),e===b.MOVE_NEXT&&this.manager.moveNextBlock(o),this.updateDataFromManager(),setTimeout(()=>{this.scrollToBlock(t)},100))}scrollToBlock(e){var r;(r=document.getElementById(e))==null||r.scrollIntoView({behavior:"smooth"})}removeBlockFromControl(e){var t,o;const r=(o=(t=e==null?void 0:e.target)==null?void 0:t.closest("[data-bb-type-block]"))==null?void 0:o.getAttribute("id");r&&this.removeBlock(r)}removeBlock(e){this.manager.removeBlock(e),this.updateDataFromManager()}updateDataFromManager(){this.blocksData=this.manager.getBlocks(),this.renderOptMain()}createFields(e){let r=[];for(let t in e.form){const o=e.form[t],s=e.props[t],i=A(s)?null:s,n=this.createField(o,t,i);n&&r.push(n)}return r}createField(e,r,t){if(e.typeField,e.typeField==="text"){console.log("WWWWWWWWWWWWWWWWWWWWWWWWW",e);const o=this.getRender({id:`bb-field-${e.typeField}-${r}`,type:`bb-field-${e.type}`,props:{label:e.label||"Текст",placeholder:e.placeholder||"",value:t||"",id:`${Date.now()}-${Math.random().toString(16).slice(2)}`}},M);if(o)return o}if(e.typeField==="textarea"){const o=this.getRender({id:`bb-field-${e.typeField}-${r}`,type:`bb-field-${e.type}`,props:{label:e.label||"Текст большой",placeholder:e.placeholder||"",value:t||"",id:`${Date.now()}-${Math.random().toString(16).slice(2)}`}},w);if(o)return o}if(e.typeField==="each-array"){if(!Object.hasOwn(e,"each"))return console.warn("Для типа each-array свойство each обязательно! Reference ",e),null;const o=e.each.typeField==="each-object"?this.createField(e.each,r,t):this.createField(e.each,r);let s=[];Array.isArray(t)&&t.length&&e.each.typeField!=="each-object"&&t.forEach(n=>{s.push(this.createField(e.each,r,n))}),console.log("value.label",e.label);const i=e.each.typeField==="each-object"?o:this.getRender({id:`bb-fieldset-${e.typeField}-${r}`,type:`bb-fieldset-${e.type}`,props:{fields:[...s,o],label:e.label||"",btnText:"Добавить",btnIcon:"add",btnTheme:"dark-outline",btnSize:"sm"}},_);if(i)return i}if(e.typeField==="each-object"){if(!Object.hasOwn(e,"each"))return console.warn("Для типа each-object свойство each обязательно! Reference ",e),null;let o=[];for(let p in e.each){const l=this.createField(e.each[p],p);l&&o.push(l)}const s=this.getRender({id:`bb-fieldset-${e.typeField}-${r}`,type:`bb-fieldset-${e.type}`,props:{fields:o}},v);let i=[];Array.isArray(t)&&t.forEach(p=>{let l=[];for(let d in p){const m=p[d],f=this.createField(e.each[d],d,m);f&&l.push(f)}const a=this.getRender({id:`bb-fieldset-${e.typeField}-${r}`,type:`bb-fieldset-${e.type}`,props:{fields:l}},v);i.push(a)});const n=this.getRender({id:`bb-fieldset-${e.typeField}-${r}`,type:`bb-fieldset-${e.type}`,props:{fields:[...i,s],label:e.label||"",btnText:"Добавить",btnIcon:"add",btnTheme:"dark-outline",btnSize:"sm"}},_);if(n)return n}return null}renderModalFromControlType(e,r){var i,n;let t=null;if(e===b.ADD&&(t=this.getRender({id:"bb-window-add",type:"bb-window-add",props:{items:Object.values(this.registeredBlocks)}},L)),e===b.EDIT){const p=(n=(i=r==null?void 0:r.target)==null?void 0:i.closest("[data-bb-type-block]"))==null?void 0:n.getAttribute("id"),l=this.blocksData.find(m=>m.id===p);let a=this.createFields(l);t=this.getRender({id:"bb-form-edit",type:"bb-form-edit",props:{title:l==null?void 0:l.name,fields:a,btnText:"Сохранить"}},u)}const o=this.getRender({id:`bb-modal-${e}`,type:`bb-modal-${e}`,name:"",props:{body:t}},h);this.createModal(o);const s=o==null?void 0:o.querySelectorAll("[data-item]");s==null||s.forEach(p=>{p.addEventListener("click",l=>{if(!(l.currentTarget instanceof HTMLElement))return;const a=l.currentTarget.getAttribute("data-item"),d=a?this.registeredBlocks[a]:null;let m=this.createFields(d);const f=this.getRender({id:"bb-form-edit",type:"bb-form-edit",props:{title:d==null?void 0:d.name,fields:m}},u),y=this.getRender({id:`bb-modal-${e}`,type:`bb-modal-${e}`,name:"",props:{body:f}},h);this.createModal(y)})})}createModal(e){if(!e)return;const r=document.querySelector("[data-bb-modal]");r&&r.remove(),e.addEventListener("click",t=>{!t.target||!(t.target instanceof HTMLElement)||(t.target.hasAttribute("data-bb-modal-close")||t.target.hasAttribute("data-bb-modal"))&&(e.remove(),document.body.classList.remove("bb-scrollbar-is-locked"))}),document.body.classList.add("bb-scrollbar-is-locked"),document.body.append(e)}}exports.BaseBlockRenderer=E;exports.OptBlockRenderer=F;

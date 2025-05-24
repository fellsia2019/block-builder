export const CUSTOM_BUTTON_TEMPLATE = `
    <button class="bb-custom-button" data-theme="[[ btnTheme ]]" data-size="[[ btnSize ]]">
        <div class="bb-custom-button__inner">
            <span>[[ btnText ]]</span>
            <svg render-if="btnIcon" class="svg-icon bb-custom-button__svg"><use href="#bb-icon-[[ btnIcon ]]"></use></svg>
        </div>
    </button>
`
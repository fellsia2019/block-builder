export const MODAL_TEMPLATE = `
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

`
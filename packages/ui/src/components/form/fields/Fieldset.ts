import { CUSTOM_BUTTON_TEMPLATE } from '../../controls/btn/CustomButton'

export const FIELDSET_TEMPLATE = `
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
            ${CUSTOM_BUTTON_TEMPLATE}
        </div>
    </div>
`
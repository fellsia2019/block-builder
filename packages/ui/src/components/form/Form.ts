import { CUSTOM_BUTTON_TEMPLATE } from '../controls/btn/CustomButton'

export const FORM_TEMPLATE = `
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
                ${CUSTOM_BUTTON_TEMPLATE}
            </div>
        </div>
    </form>
`
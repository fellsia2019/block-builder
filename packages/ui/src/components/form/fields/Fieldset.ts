export const FIELDSET_TEMPLATE = `
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
`
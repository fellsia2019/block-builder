export const GROUP_FIELD_TEMPLATE = `
    <div class="bb-group-field">
        <div class="bb-group-field__inner">
            <div render-for="item in fields" class="bb-group-field__item">
                [[ item ]]
            </div>
        </div>
    </div>
`
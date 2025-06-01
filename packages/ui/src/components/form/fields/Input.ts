export const INPUT_TEMPLATE = `
    <div class="bb-input bb-base-field" data-bb-field-key="[[ key ]]">
        <div class="bb-input__inner">
            <label for="bb-control-[[ id ]]" class="bb-input__label bb-base-field__label">
                [[ label ]]
            </label>
            <input id="bb-control-[[ id ]]" class="bb-input__input bb-base-field__field" value="[[ value ]]" placeholder="[[ placeholder ]]" />
        </div>
    </div>

`
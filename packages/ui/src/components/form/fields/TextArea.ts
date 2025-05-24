export const TEXT_AREA_TEMPLATE = `
    <div class="bb-textarea bb-base-field">
        <div class="bb-textarea__inner">
            <label for="bb-control-[[ id ]]" class="bb-textarea__label bb-base-field__label">
                [[ label ]]
            </label>
            <textarea id="bb-control-[[ id ]]" class="bb-textarea__textarea bb-base-field__field" placeholder="[[ placeholder ]]">[[ value ]]</textarea>
        </div>
    </div>

`
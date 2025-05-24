export const BASE_BLOCK_TEMPLATE = `
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
`
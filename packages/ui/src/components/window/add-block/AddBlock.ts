export const ADD_BLOCK_TEMPLATE = `
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
`
// @ts-ignore - когда опубликую пакет убрать игнор флаг
import type { OptBlockModel } from '@block-builder/core';
import { type BlockRendererMap, BlockControlTypes } from './types'

// key - string as type block
// value - string as HTMLString template
import { BaseBlockRenderer } from './BaseBlockRenderer'

import { BTN_CONTROL_TEMPLATE } from './components/controls/btn/BtnControl'
import { ICONS_TEMPLATE } from './components/common/icons'
import { MODAL_TEMPLATE } from './components/modal/Modal'
import { ADD_BLOCK_TEMPLATE } from './components/window/add-block/AddBlock'
import { FORM_TEMPLATE } from './components/form/Form'
import { INPUT_TEMPLATE } from './components/form/fields/Input'
import { TEXT_AREA_TEMPLATE } from './components/form/fields/TextArea'
import { FIELDSET_TEMPLATE } from './components/form/fields/Fieldset'

export class OptBlockRenderer extends BaseBlockRenderer {
    constructor(
        private blocksData: Array<OptBlockModel>,
        private renderers: BlockRendererMap,
        private registeredBlocks: Record<string, OptBlockModel>
    ) {
        super();
    }

    renderOpt(container: HTMLElement) {
        container.innerHTML = '';
        this.blocksData.forEach((block: OptBlockModel) => {
            const renderBoilerplate = this.renderers[block.type]
            // рендер ui самого блока
            const element: HTMLElement | null = this.createFallbackBlock(block, renderBoilerplate);

            // ---start рендер контроллов над блоками
            // основные контролы - редактирование, удаление, перемещение
            const controls = this.getRenderControls(block)

            // контрол добавления блока
            const controllAdd = this.getRenderControl(block, BlockControlTypes.ADD)
            controllAdd?.classList.add('bb-block-control-add')
            // ---end рендер контроллов над блоками

            if (!element) {
                return
            }

            element.append(controls);
            if (controllAdd) {
                element.append(controllAdd);
            }

            element.classList.add('bb-block')
            element.setAttribute('data-bb-type-block', block.type)
            element.setAttribute('id', block.id)

            container.appendChild(element);
        });

        // ---start рендер спрайт иконки
        const parser = new DOMParser();
        const doc = parser.parseFromString(ICONS_TEMPLATE, 'text/html');
        const resultHTMLElement = doc?.body?.firstChild

        if (resultHTMLElement) {
            document.body.append(resultHTMLElement)
        }
        // ---end рендер спрайт иконки
    }

    getRenderControls(block: OptBlockModel): HTMLElement {
        const controls = document.createElement('div')
        controls.classList.add('bb-block-controls', 'bb-border-box');

        [BlockControlTypes.EDIT, BlockControlTypes.REMOVE, BlockControlTypes.MOVE_PREV, BlockControlTypes.MOVE_NEXT].forEach(type => {
            const control = this.getRenderControl(block, type)

            if (!control) {
                return
            }

            controls.append(control)
        })

        return controls
    }

    getRenderControl(block: OptBlockModel, type: BlockControlTypes): HTMLElement | null {
        const control = this.getRender(
            {
                id: `control-${type}-${block.id}`,
                type: `control-${type}`,
                name: '',
                props: {
                    type
                }
            },
            BTN_CONTROL_TEMPLATE
        )

        if (!control) {
            return null
        }

        control.setAttribute('data-type', type)

        control.addEventListener('click', (e: Event) => {
            if (!e?.currentTarget || !(e.currentTarget instanceof HTMLElement)) {
                return
            }

            const type: string | null = e.currentTarget.getAttribute('data-type')

            if (!type) {
                return
            }

            if ([BlockControlTypes.EDIT, BlockControlTypes.ADD].includes(type as BlockControlTypes)) {
                this.renderModalFromControlType(type as (BlockControlTypes.ADD | BlockControlTypes.EDIT), e)
            }
            if (type === BlockControlTypes.REMOVE) {
                console.log('сквозное сообщение что блок удален')
            }

            if (type === BlockControlTypes.MOVE_PREV) {
                console.log('MOVE_PREV')
            }
            if (type === BlockControlTypes.MOVE_NEXT) {
                console.log('MOVE_NEXT')
            }
        })

        return control
    }

    createFields(registerBlock: OptBlockModel) {
        let fields: Array<HTMLElement> = []

        for (let key in registerBlock.form) {
            const value = registerBlock.form[key]

            const field: HTMLElement | null = this.createField(value, key)

            if (field) {
                fields.push(field)
            }
        }

        return fields
    }

    createField(value, key: string) {
        if (value.typeField === 'image') {
            // рендерим блок с загрузкой изображения
            // пока пропускаем
        }
        if (value.typeField === 'text') {
            // рендерим блок с инпутом
            const field: HTMLElement | null = this.getRender(
                {
                    id: `bb-field-${value.typeField}-${key}`,
                    type: `bb-field-${value.type}`,
                    props: {
                        label: value.label || 'Текст',
                        placeholder: value.placeholder || '',
                        value: '',
                    }

                },
                INPUT_TEMPLATE
            )

            if (field) {
                return field
            }
        }
        if (value.typeField === 'textarea') {
            // рендерим блок текстовый блок (textarea, потом мб подключу какой-то визуальный редактор)
            const field: HTMLElement | null = this.getRender(
                {
                    id: `bb-field-${value.typeField}-${key}`,
                    type: `bb-field-${value.type}`,
                    props: {
                        label:value.label || 'Текст большой',
                        placeholder: value.placeholder || '',
                        value: '',
                    }

                },
                TEXT_AREA_TEMPLATE
            )

            if (field) {
                return field
            }
        }
        if (value.typeField === 'each-array') {
            if (!(Object.hasOwn(value, 'each'))) {
                console.warn('Для типа each-array свойство each обязательно! Reference ', value)
                return null
            }

            const field = this.createField(value.each, key)
            const fieldset: HTMLElement | null = value.each.typeField === 'each-object'
                ? field 
                : this.getRender(
                    {
                        id: `bb-fieldset-${value.typeField}-${key}`,
                        type: `bb-fieldset-${value.type}`,
                        props: {
                            fields: [field]
                        }

                    },
                    FIELDSET_TEMPLATE
                )

            if (fieldset) {
                return fieldset
            }
        }
        if (value.typeField === 'each-object') {
            if (!(Object.hasOwn(value, 'each'))) {
                console.warn('Для типа each-object свойство each обязательно! Reference ', value)
                return null
            }

            let fields: Array<HTMLElement> = []
            
            for (let eachKey in value.each) {
                const field = this.createField(value.each[eachKey], eachKey)
                if (field) {
                    fields.push(field)
                }
            }

            const field: HTMLElement | null = this.getRender(
                {
                    id: `bb-fieldset-${value.typeField}-${key}`,
                    type: `bb-fieldset-${value.type}`,
                    props: {
                        fields
                    }

                },
                FIELDSET_TEMPLATE
            )

            if (field) {
                return field
            }
        }

        return null
    }

    renderModalFromControlType(type: BlockControlTypes.ADD | BlockControlTypes.EDIT, e: Event) {
        let body: any = null

        if (type === BlockControlTypes.ADD) {
            const template = this.getRender(
                {
                    id: 'bb-window-add',
                    type: 'bb-window-add',
                    props: {
                        items: Object.values(this.registeredBlocks)
                    }
                },
                ADD_BLOCK_TEMPLATE
            )

            body = template
        }

        if (type === BlockControlTypes.EDIT) {
            const typeBlock = (e?.target as HTMLElement)?.closest('[data-bb-type-block]')?.getAttribute('data-bb-type-block')
            const registerBlock: OptBlockModel | null = typeBlock ? this.registeredBlocks[typeBlock] : null

            let fields = this.createFields(registerBlock)

            // рендерим форму
            const form = this.getRender(
                {
                    id: 'bb-form-edit',
                    type: 'bb-form-edit',
                    props: {
                        title: registerBlock?.name,
                        fields
                    }
                },
                FORM_TEMPLATE
            )

            body = form
        }

        const modalHTMLElement: HTMLElement | null = this.getRender(
            {
                id: `bb-modal-${type}`,
                type: `bb-modal-${type}`,
                name: '',
                props: {
                    body: body
                }
            },
            MODAL_TEMPLATE
        )

        this.createModal(modalHTMLElement)

        const items = modalHTMLElement?.querySelectorAll('[data-item]')
        items?.forEach(item => {
            item.addEventListener('click', (e: Event) => {

                if (!(e.currentTarget instanceof HTMLElement)) {
                    return
                }

                const typeBlock = e.currentTarget.getAttribute('data-item');
                const registerBlock: OptBlockModel | null = typeBlock ? this.registeredBlocks[typeBlock] : null

                let fields = this.createFields(registerBlock)

                // рендерим форму
                const form = this.getRender(
                    {
                        id: 'bb-form-edit',
                        type: 'bb-form-edit',
                        props: {
                            title: registerBlock?.name,
                            fields
                        }
                    },
                    FORM_TEMPLATE
                )

                const modalHTMLElement: HTMLElement | null = this.getRender(
                    {
                        id: `bb-modal-${type}`,
                        type: `bb-modal-${type}`,
                        name: '',
                        props: {
                            body: form
                        }
                    },
                    MODAL_TEMPLATE
                )

                console.log('click form', modalHTMLElement)

                this.createModal(modalHTMLElement)
            })

        });
    }

    getModalRender(): HTMLElement | null {
        const modalHTMLElement: HTMLElement | null = this.getRender(
            {
                id: 'bb-modal',
                type: 'bb-modal',
                name: '',
                props: {
                    body: { a: 123, test: 'mnogo4len' }
                }
            },
            MODAL_TEMPLATE
        )

        return modalHTMLElement
    }

    createModal(modal: HTMLElement | null) {
        if (!modal) {
            return
        }

        const existModal = document.querySelector('[data-bb-modal]')
        if (existModal) {
            existModal.remove()
        }

        modal.addEventListener('click', (e: Event) => {
            if (!e.target || !(e.target instanceof HTMLElement)) {
                return
            }

            // закрытие модалки
            if (e.target.hasAttribute('data-bb-modal-close') || e.target.hasAttribute('data-bb-modal')) {
                modal.remove()
                document.body.classList.remove('bb-scrollbar-is-locked')
            }
        })

        document.body.classList.add('bb-scrollbar-is-locked')
        document.body.append(modal)
    }
}
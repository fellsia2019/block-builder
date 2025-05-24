// @ts-ignore - когда опубликую пакет убрать игнор флаг
import { type OptBlockModel, BlockManager } from '@block-builder/core';
import { type BlockRendererMap, BlockControlTypes } from './types'


import { BaseBlockRenderer } from './BaseBlockRenderer'
import { BTN_CONTROL_TEMPLATE } from './components/controls/btn/BtnControl'
import { ICONS_TEMPLATE } from './components/common/icons'
import { MODAL_TEMPLATE } from './components/modal/Modal'
import { ADD_BLOCK_TEMPLATE } from './components/window/add-block/AddBlock'
import { FORM_TEMPLATE } from './components/form/Form'
import { INPUT_TEMPLATE } from './components/form/fields/Input'
import { TEXT_AREA_TEMPLATE } from './components/form/fields/TextArea'
import { FIELDSET_TEMPLATE } from './components/form/fields/Fieldset'
import { GROUP_FIELD_TEMPLATE } from './components/form/fields/GroupField.ts'
import { BASE_BLOCK_TEMPLATE } from './components/blocks/OptBlock'


// вынести в утилсы
function isEmpty(value: any) {
  return typeof value === 'string' || Array.isArray(value)
    ? !value?.length
    : typeof value === 'object'
      ? !Object.keys(value).some(Boolean)
      : !value
}

export class OptBlockRenderer extends BaseBlockRenderer {

    constructor(
        private blocksData: Array<OptBlockModel>,
        private renderers: BlockRendererMap,
        private manager: BlockManager,
        private renderHTMLContainer: HTMLElement
    ) {
        super();
        this.renderOptMain()
        this.renderOptServices()
    }

    get registeredBlocks(): Record<string, OptBlockModel> {
        return this.manager.getRegisteredBlocks()
    }

    renderOptMain() {
        this.renderHTMLContainer.innerHTML = '';

        this.blocksData.forEach((block: OptBlockModel, index: number) => {
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

            const blockNode = this.getRender(
                {
                    id: block.id,
                    type: block.type,
                    name: '',
                    props: {
                        controlAddTop: controllAdd && index === 0 ? controllAdd : null,
                        controlAddBottom: controllAdd ? controllAdd : null,
                        controls,
                        userBlock: element,
                        id: block.id,
                        type: block.type,
                    }
                },
                BASE_BLOCK_TEMPLATE
            )

            if (!blockNode) {
                return
            }

            this.renderHTMLContainer.appendChild(blockNode);


            // events
            const controlsNodes = this.renderHTMLContainer.querySelectorAll('[data-bb-control]')
            controlsNodes.forEach(control => {
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
                        this.removeBlockFromControl(e)
                    }
    
                    if (type === BlockControlTypes.MOVE_PREV) {
                        this.moveBlockFromControl(BlockControlTypes.MOVE_PREV, e)
                    }
                    if (type === BlockControlTypes.MOVE_NEXT) {
                        this.moveBlockFromControl(BlockControlTypes.MOVE_NEXT, e)
                    }
                })
            })
        });
    }

    renderOptServices() {
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

        return control
    }

    moveBlockFromControl(direction: BlockControlTypes.MOVE_PREV | BlockControlTypes.MOVE_NEXT, e: Event) {
        const id = (e?.target as HTMLElement)?.closest('[data-bb-type-block]')?.getAttribute('id')
        const index = this.blocksData.findIndex(block => block.id === id)

        if (!this.blocksData[index] || !id) {
            return
        }

        if (direction === BlockControlTypes.MOVE_PREV) {
            this.manager.movePrevBlock(index)
        } 
        if (direction === BlockControlTypes.MOVE_NEXT) {
            this.manager.moveNextBlock(index)
        }

        this.updateDataFromManager()

        setTimeout(() => {
            this.scrollToBlock(id)
        }, 100);
    }

    scrollToBlock(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    removeBlockFromControl(e: Event) {
        const id = (e?.target as HTMLElement)?.closest('[data-bb-type-block]')?.getAttribute('id')
        if (!id) {
            return
        }
        this.removeBlock(id)
    }

    removeBlock(id: string) {
        this.manager.removeBlock(id)
        this.updateDataFromManager()
    }
 
    updateDataFromManager() {
        this.blocksData = this.manager.getBlocks()
        this.renderOptMain()
    }

    createFields(registerBlock: OptBlockModel) {
        let fields: Array<HTMLElement> = []

        for (let key in registerBlock.form) {
            const value = registerBlock.form[key]

            const propsValue = registerBlock.props[key]
            const mergeValues = !isEmpty(propsValue) ? propsValue : null
            const field: HTMLElement | null = this.createField(value, key, mergeValues)

            if (field) {
                fields.push(field)
            }
        }

        return fields
    }

    createField(value, key: string, mergeValue?: any): HTMLElement | null {
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
                        value: mergeValue || '',
                        id: `${Date.now()}-${Math.random().toString(16).slice(2)}` // вынести в утилс, такой же генератор айди есть в BlockManager
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
                        value: mergeValue || '',
                        id: `${Date.now()}-${Math.random().toString(16).slice(2)}` // вынести в утилс, такой же генератор айди есть в BlockManager
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

            const field = value.each.typeField === 'each-object'
                ? this.createField(value.each, key, mergeValue)
                : this.createField(value.each, key)

            let fieldsFromMegeValue: Array<HTMLElement | null> = []
            if (Array.isArray(mergeValue) && mergeValue.length && (value.each.typeField !== 'each-object')) {
                mergeValue.forEach((item: any) => {
                    fieldsFromMegeValue.push(
                        this.createField(value.each, key, item)
                    )
                })
            }

            const fieldset: HTMLElement | null = value.each.typeField === 'each-object'
                ? field 
                : this.getRender(
                    {
                        id: `bb-fieldset-${value.typeField}-${key}`,
                        type: `bb-fieldset-${value.type}`,
                        props: {
                            fields: [...fieldsFromMegeValue, field],
                            label: value.label || '',
                            btnText: 'Добавить',
                            btnIcon: 'add',
                            btnTheme: 'dark-outline',
                            btnSize: 'sm'
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

            const groupItem = this.getRender(
                {
                    id: `bb-fieldset-${value.typeField}-${key}`,
                    type: `bb-fieldset-${value.type}`,
                    props: {
                        fields,
                    }

                },
                GROUP_FIELD_TEMPLATE
            )

            
            let fieldsFromMegeValue: Array<HTMLElement | null> = []
            if (Array.isArray(mergeValue)) {
                mergeValue.forEach(item => {
                    let fields: Array<HTMLElement> = []

                    for (let key in item) {
                        const v = item[key]

                        const field = this.createField(value.each[key], key, v)
                        if (field) {
                            fields.push(field)
                        }
                    }

                    const groupItem = this.getRender(
                        {
                            id: `bb-fieldset-${value.typeField}-${key}`,
                            type: `bb-fieldset-${value.type}`,
                            props: {
                                fields
                            }

                        },
                        GROUP_FIELD_TEMPLATE
                    )

                    fieldsFromMegeValue.push(groupItem)
                })
            }

            const field: HTMLElement | null = this.getRender(
                {
                    id: `bb-fieldset-${value.typeField}-${key}`,
                    type: `bb-fieldset-${value.type}`,
                    props: {
                        fields: [...fieldsFromMegeValue, groupItem],
                        label: value.label || '',
                        btnText: 'Добавить',
                        btnIcon: 'add',
                        btnTheme: 'dark-outline',
                        btnSize: 'sm'
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
            const id = (e?.target as HTMLElement)?.closest('[data-bb-type-block]')?.getAttribute('id')
            const block = this.blocksData.find(item => item.id === id)

            let fields = this.createFields(block)

            // рендерим форму
            const form = this.getRender(
                {
                    id: 'bb-form-edit',
                    type: 'bb-form-edit',
                    props: {
                        title: block?.name,
                        fields,
                        btnText: 'Сохранить'
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

                this.createModal(modalHTMLElement)
            })

        });
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
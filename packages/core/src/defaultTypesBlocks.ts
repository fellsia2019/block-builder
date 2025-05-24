import { type OptBlockModel, BlockModelFormItemTypeField } from './types';

export enum DEFAULT_TYPES {
    BB_TEXT_BLOCK = 'bb-text-block',
    BB_TEXT_IMG_BLOCK = 'bb-text-img-block'
}

export const defaultTypesBlocks: Record<DEFAULT_TYPES, OptBlockModel> = {
    [DEFAULT_TYPES['BB_TEXT_BLOCK']]: {
        id: '',
        type: DEFAULT_TYPES['BB_TEXT_BLOCK'],
        name: 'Текстовый блок',
        props: { text: '' },
        form: {
            text: {
                typeField: BlockModelFormItemTypeField.TEXT,
                placeholder: ''
            }
        }
    },
    [DEFAULT_TYPES['BB_TEXT_IMG_BLOCK']]: {
        id: '',
        type: DEFAULT_TYPES['BB_TEXT_IMG_BLOCK'],
        name: 'Текст с изображением',
        props: { text: '', img: '' },
        form: {
            text: {
                typeField: BlockModelFormItemTypeField.TEXT,
                placeholder: ''
            },
            img: {
                typeField: BlockModelFormItemTypeField.IMAGE,
                placeholder: ''
            }
        }
    }
}
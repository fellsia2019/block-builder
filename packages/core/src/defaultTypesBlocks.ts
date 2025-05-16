import type { BlockModel } from './types';

export enum DEFAULT_TYPES {
    BB_TEXT_BLOCK = 'bb-text-block',
    BB_TEXT_IMG_BLOCK = 'bb-text-img-block'
}

export const defaultTypesBlocks: Record<DEFAULT_TYPES, BlockModel> = {
    [DEFAULT_TYPES['BB_TEXT_BLOCK']]: {
        id: '',
        type: DEFAULT_TYPES['BB_TEXT_BLOCK'],
        name: 'Текстовый блок',
        props: { text: '' }
    },
    [DEFAULT_TYPES['BB_TEXT_IMG_BLOCK']]: {
        id: '',
        type: DEFAULT_TYPES['BB_TEXT_IMG_BLOCK'],
        name: 'Текст с изображением',
        props: { text: '', img: '' }
    }
}
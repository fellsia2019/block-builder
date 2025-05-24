export type BlockRendererMap = Record<string, string>;

export enum BlockControlTypes {
    ADD = 'add',
    EDIT = 'edit',
    REMOVE = 'remove',
    MOVE_NEXT = 'move-next',
    MOVE_PREV = 'move-prev'
}

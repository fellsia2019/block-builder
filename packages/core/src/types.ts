/**
 * Базовый тип блока.
 * @property {string} id – Уникальный идентификатор (генерируется на клиенте).
 * @property {string} type – Тип блока ('text', 'image', 'slider').
 * @property {Record<string, unknown>} props – Динамические свойства блока.
 */
export enum BlockModelFormItemTypeField {
  TEXT = 'text',
  IMAGE = 'image',
  EACH_ARRAY = 'each-array',
  EACH_OBJECT = 'each-object'
}
type BlockModelFormItem = {
  typeField: BlockModelFormItemTypeField;
  validation?: unknown; // только в планах, не mvp
  placeholder: any;
  each?: Record<string, BlockModelFormItem> | BlockModelFormItem;
}

export type BaseBlockModel = {
  id: string;
  type: string;
  name: string;
  props: Record<string, unknown>;
};

export type OptBlockModel = BaseBlockModel & {
  form: Record<string, BlockModelFormItem>
}

/**
 * Опции для BlockManager.
 * @property {string} [saveEndpoint] – URL для сохранения данных (опционально).
 */
export type BlockManagerOptions = {
  saveEndpoint?: string;
  useDefaultTypesBlocks?: boolean;
};
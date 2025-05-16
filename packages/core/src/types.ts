/**
 * Базовый тип блока.
 * @property {string} id – Уникальный идентификатор (генерируется на клиенте).
 * @property {string} type – Тип блока ('text', 'image', 'slider').
 * @property {Record<string, unknown>} props – Динамические свойства блока.
 */
export type BlockModel = {
  id: string;
  type: string;
  name: string;
  props: Record<string, unknown>;
};

/**
 * Опции для BlockManager.
 * @property {string} [saveEndpoint] – URL для сохранения данных (опционально).
 */
export type BlockManagerOptions = {
  saveEndpoint?: string;
  useDefaultTypesBlocks?: boolean;
};
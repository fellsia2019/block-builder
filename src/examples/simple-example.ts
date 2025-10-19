/**
 * Простой пример использования Naberika с чистой архитектурой
 */

import { 
  BlockManagementUseCase,
  MemoryBlockRepositoryImpl,
  CreateBlockDto
} from '../index';

// Создание use case (единственный вход в ядро)
const blockRepository = new MemoryBlockRepositoryImpl();
const blockManagement = new BlockManagementUseCase(blockRepository);

/**
 * Демонстрация чистой архитектуры
 */
export async function demonstrateCleanArchitecture() {
  console.log('🏗️ Демонстрация чистой архитектуры Naberika');
  
  try {
    // 1. Создание блока через Use Case
    const createDto: CreateBlockDto = {
      type: 'text',
      settings: { fontSize: 16, color: '#333' },
      props: { content: 'Hello Clean Architecture!' },
      template: '<div style="font-size: {{ settings.fontSize }}px; color: {{ settings.color }};">{{ props.content }}</div>',
      position: { x: 100, y: 100 },
      size: { width: 300, height: 50 }
    };

    const block = await blockManagement.createBlock(createDto);
    console.log('✅ Блок создан:', block.id);

    // 2. Обновление блока
    const updatedBlock = await blockManagement.updateBlock(block.id, {
      settings: { fontSize: 24, color: '#ff0000' },
      props: { content: 'Updated content!' }
    });
    console.log('✅ Блок обновлен:', updatedBlock?.id);

    // 3. Перемещение блока
    const movedBlock = await blockManagement.moveBlock(block.id, { x: 200, y: 200 });
    console.log('✅ Блок перемещен:', movedBlock?.position);

    // 4. Получение всех блоков
    const allBlocks = await blockManagement.getAllBlocks();
    console.log('📋 Всего блоков:', allBlocks.length);

    console.log('🎉 Демонстрация завершена!');
    console.log('✅ UI → Use Case → Port → Infrastructure');
    console.log('✅ Чистая архитектура работает!');

  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

// Экспорт для использования
export { blockManagement };

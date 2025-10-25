import { StyleManager } from '../StyleManager';

// Мокируем импорт стилей
jest.mock('../../styles/styles', () => ({
  __esModule: true,
  default: '.block-builder { color: red; }'
}));

describe('StyleManager', () => {
  let styleManager: StyleManager;

  beforeEach(() => {
    styleManager = new StyleManager();
    // Очищаем DOM перед каждым тестом
    document.head.innerHTML = '';
  });

  afterEach(() => {
    // Очищаем после теста
    styleManager.removeAllStyles();
  });

  describe('injectStyles', () => {
    test('должен добавить стили в head', () => {
      styleManager.injectStyles();

      const styleElement = document.getElementById('block-builder-styles');
      
      expect(styleElement).toBeTruthy();
      expect(styleElement?.tagName).toBe('STYLE');
      expect(styleElement?.textContent).toBeTruthy();
    });

    test('должен добавить стили только один раз', () => {
      styleManager.injectStyles();
      styleManager.injectStyles();
      styleManager.injectStyles();

      const styleElements = document.querySelectorAll('#block-builder-styles');
      
      expect(styleElements.length).toBe(1);
    });

    test('должен установить флаг stylesInjected', () => {
      expect(styleManager.areStylesInjected()).toBe(false);

      styleManager.injectStyles();

      expect(styleManager.areStylesInjected()).toBe(true);
    });
  });

  describe('removeAllStyles', () => {
    test('должен удалить стили из head', () => {
      styleManager.injectStyles();
      expect(document.getElementById('block-builder-styles')).toBeTruthy();

      styleManager.removeAllStyles();

      expect(document.getElementById('block-builder-styles')).toBeNull();
    });

    test('должен сбросить флаг stylesInjected', () => {
      styleManager.injectStyles();
      expect(styleManager.areStylesInjected()).toBe(true);

      styleManager.removeAllStyles();

      expect(styleManager.areStylesInjected()).toBe(false);
    });

    test('должен работать если стили не были добавлены', () => {
      expect(() => {
        styleManager.removeAllStyles();
      }).not.toThrow();
    });

    test('должен позволить переинъектировать стили после удаления', () => {
      styleManager.injectStyles();
      styleManager.removeAllStyles();
      styleManager.injectStyles();

      const styleElement = document.getElementById('block-builder-styles');
      
      expect(styleElement).toBeTruthy();
      expect(styleManager.areStylesInjected()).toBe(true);
    });
  });

  describe('areStylesInjected', () => {
    test('должен вернуть false по умолчанию', () => {
      expect(styleManager.areStylesInjected()).toBe(false);
    });

    test('должен вернуть true после инъекции', () => {
      styleManager.injectStyles();

      expect(styleManager.areStylesInjected()).toBe(true);
    });

    test('должен вернуть false после удаления', () => {
      styleManager.injectStyles();
      styleManager.removeAllStyles();

      expect(styleManager.areStylesInjected()).toBe(false);
    });
  });

  describe('Интеграция', () => {
    test('должен корректно работать при множественных вызовах', () => {
      // Первая инъекция
      styleManager.injectStyles();
      expect(styleManager.areStylesInjected()).toBe(true);
      expect(document.getElementById('block-builder-styles')).toBeTruthy();

      // Попытка повторной инъекции
      styleManager.injectStyles();
      expect(document.querySelectorAll('#block-builder-styles').length).toBe(1);

      // Удаление
      styleManager.removeAllStyles();
      expect(styleManager.areStylesInjected()).toBe(false);
      expect(document.getElementById('block-builder-styles')).toBeNull();

      // Новая инъекция
      styleManager.injectStyles();
      expect(styleManager.areStylesInjected()).toBe(true);
      expect(document.getElementById('block-builder-styles')).toBeTruthy();
    });
  });
});


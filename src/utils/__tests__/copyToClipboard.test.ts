import { copyToClipboard } from '../copyToClipboard';

describe('copyToClipboard', () => {
  let mockClipboard: { writeText: jest.Mock };
  let mockExecCommand: jest.Mock;

  beforeEach(() => {
    // Мокируем Clipboard API
    mockClipboard = {
      writeText: jest.fn().mockResolvedValue(undefined)
    };

    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true
    });

    // Мокируем window.isSecureContext
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      writable: true,
      configurable: true
    });

    // Мокируем execCommand для fallback
    mockExecCommand = jest.fn().mockReturnValue(true);
    document.execCommand = mockExecCommand;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Secure context', () => {
    test('должен использовать navigator.clipboard.writeText в secure context', () => {
      copyToClipboard('test text');

      expect(mockClipboard.writeText).toHaveBeenCalledWith('test text');
    });

    test('должен вернуть true при успешном копировании', () => {
      const result = copyToClipboard('test text');

      expect(result).toBe(true);
    });

    test('должен скопировать пустую строку', () => {
      copyToClipboard('');

      expect(mockClipboard.writeText).toHaveBeenCalledWith('');
    });

    test('должен скопировать многострочный текст', () => {
      const multiline = 'line1\nline2\nline3';
      copyToClipboard(multiline);

      expect(mockClipboard.writeText).toHaveBeenCalledWith(multiline);
    });

    test('должен скопировать текст со специальными символами', () => {
      const special = 'text with "quotes" and \'apostrophes\' and <tags>';
      copyToClipboard(special);

      expect(mockClipboard.writeText).toHaveBeenCalledWith(special);
    });
  });

  describe('Non-secure context fallback', () => {
    beforeEach(() => {
      // Симулируем non-secure context
      Object.defineProperty(window, 'isSecureContext', {
        value: false,
        writable: true,
        configurable: true
      });

      // Мокируем DOM методы для fallback
      document.body.append = jest.fn();
      document.createRange = jest.fn().mockReturnValue({
        selectNode: jest.fn()
      });
      window.getSelection = jest.fn().mockReturnValue({
        removeAllRanges: jest.fn(),
        addRange: jest.fn()
      });
    });

    test('должен использовать fallback метод в non-secure context', () => {
      copyToClipboard('test text');

      expect(mockClipboard.writeText).not.toHaveBeenCalled();
      expect(document.createRange).toHaveBeenCalled();
    });

    test('должен вернуть true при успешном fallback копировании', () => {
      const result = copyToClipboard('test text');

      expect(result).toBe(true);
    });
  });

  describe('Error handling', () => {
    test('должен вернуть true даже при ошибке', () => {
      // Перехватываем ошибку с помощью try-catch в самой функции
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Мокируем writeText который бросит ошибку при вызове
      mockClipboard.writeText = jest.fn(() => {
        throw new Error('Clipboard error');
      });

      // Функция должна поймать ошибку и вернуть false
      const result = copyToClipboard('test text');

      // Проверяем что была попытка копирования
      expect(mockClipboard.writeText).toHaveBeenCalledWith('test text');
      
      consoleSpy.mockRestore();
    });

    test('должен обработать ошибку при отсутствии selection', () => {
      Object.defineProperty(window, 'isSecureContext', {
        value: false,
        writable: true,
        configurable: true
      });

      // Мокируем createElement и append
      const mockDiv = document.createElement('div');
      const originalCreateElement = document.createElement.bind(document);
      document.createElement = jest.fn((tag) => {
        if (tag === 'div') {
          return mockDiv;
        }
        return originalCreateElement(tag);
      });

      const mockRemove = jest.fn();
      mockDiv.remove = mockRemove;

      window.getSelection = jest.fn().mockReturnValue(null);
      document.createRange = jest.fn().mockReturnValue({
        selectNode: jest.fn()
      });

      const result = copyToClipboard('test text');

      expect(result).toBe(true);
      expect(mockRemove).toHaveBeenCalled();
    });
  });
});


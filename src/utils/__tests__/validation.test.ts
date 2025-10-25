import { JavaScriptValidator } from '../validation';
import { TValidationRule, IFormData } from '../../core/types';

describe('JavaScriptValidator', () => {
  describe('validate - required', () => {
    test('должен пройти валидацию для непустого значения', async () => {
      const data: IFormData = { name: 'John' };
      const rules: TValidationRule[] = [
        { type: 'required', field: 'name', message: 'Name is required' }
      ];

      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('должен вернуть ошибку для пустой строки', async () => {
      const data: IFormData = { name: '' };
      const rules: TValidationRule[] = [
        { type: 'required', field: 'name', message: 'Name is required' }
      ];

      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toContain('Name is required');
    });

    test('должен вернуть ошибку для null', async () => {
      const data: IFormData = { name: null };
      const rules: TValidationRule[] = [
        { type: 'required', field: 'name', message: 'Name is required' }
      ];

      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toContain('Name is required');
    });

    test('должен вернуть ошибку для undefined', async () => {
      const data: IFormData = { name: undefined };
      const rules: TValidationRule[] = [
        { type: 'required', field: 'name', message: 'Name is required' }
      ];

      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toContain('Name is required');
    });
  });

  describe('validate - email', () => {
    const rules: TValidationRule[] = [
      { type: 'email', field: 'email', message: 'Invalid email' }
    ];

    test('должен пройти валидацию для корректного email', async () => {
      const data: IFormData = { email: 'test@example.com' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен вернуть ошибку для некорректного email', async () => {
      const data: IFormData = { email: 'invalid-email' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toContain('Invalid email');
    });

    test('должен пройти валидацию для пустого значения', async () => {
      const data: IFormData = { email: '' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен вернуть ошибку для email без @', async () => {
      const data: IFormData = { email: 'test.example.com' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
    });

    test('должен вернуть ошибку для email без домена', async () => {
      const data: IFormData = { email: 'test@' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
    });
  });

  describe('validate - url', () => {
    const rules: TValidationRule[] = [
      { type: 'url', field: 'website', message: 'Invalid URL' }
    ];

    test('должен пройти валидацию для корректного URL', async () => {
      const data: IFormData = { website: 'https://example.com' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен пройти валидацию для URL с http', async () => {
      const data: IFormData = { website: 'http://example.com' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен вернуть ошибку для некорректного URL', async () => {
      const data: IFormData = { website: 'not-a-url' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.website).toContain('Invalid URL');
    });

    test('должен пройти валидацию для пустого значения', async () => {
      const data: IFormData = { website: '' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });
  });

  describe('validate - min', () => {
    const rules: TValidationRule[] = [
      { type: 'min', field: 'age', value: 18, message: 'Age must be at least 18' }
    ];

    test('должен пройти валидацию для значения выше минимума', async () => {
      const data: IFormData = { age: 25 };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен пройти валидацию для значения равного минимуму', async () => {
      const data: IFormData = { age: 18 };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен вернуть ошибку для значения ниже минимума', async () => {
      const data: IFormData = { age: 17 };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.age).toContain('Age must be at least 18');
    });

    test('должен пройти валидацию для пустого значения', async () => {
      const data: IFormData = { age: '' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });
  });

  describe('validate - max', () => {
    const rules: TValidationRule[] = [
      { type: 'max', field: 'age', value: 100, message: 'Age must be at most 100' }
    ];

    test('должен пройти валидацию для значения ниже максимума', async () => {
      const data: IFormData = { age: 50 };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен пройти валидацию для значения равного максимуму', async () => {
      const data: IFormData = { age: 100 };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен вернуть ошибку для значения выше максимума', async () => {
      const data: IFormData = { age: 101 };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.age).toContain('Age must be at most 100');
    });
  });

  describe('validate - minLength', () => {
    const rules: TValidationRule[] = [
      { type: 'minLength', field: 'password', value: 8, message: 'Password must be at least 8 characters' }
    ];

    test('должен пройти валидацию для строки длиннее минимума', async () => {
      const data: IFormData = { password: 'password123' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен пройти валидацию для строки равной минимуму', async () => {
      const data: IFormData = { password: '12345678' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен вернуть ошибку для строки короче минимума', async () => {
      const data: IFormData = { password: '1234567' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.password).toContain('Password must be at least 8 characters');
    });
  });

  describe('validate - maxLength', () => {
    const rules: TValidationRule[] = [
      { type: 'maxLength', field: 'username', value: 20, message: 'Username must be at most 20 characters' }
    ];

    test('должен пройти валидацию для строки короче максимума', async () => {
      const data: IFormData = { username: 'john' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен пройти валидацию для строки равной максимуму', async () => {
      const data: IFormData = { username: '12345678901234567890' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен вернуть ошибку для строки длиннее максимума', async () => {
      const data: IFormData = { username: '123456789012345678901' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.username).toContain('Username must be at most 20 characters');
    });
  });

  describe('validate - pattern', () => {
    const rules: TValidationRule[] = [
      { type: 'pattern', field: 'phone', value: /^\d{10}$/, message: 'Phone must be 10 digits' }
    ];

    test('должен пройти валидацию для соответствующей строки', async () => {
      const data: IFormData = { phone: '1234567890' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен вернуть ошибку для несоответствующей строки', async () => {
      const data: IFormData = { phone: '123' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toContain('Phone must be 10 digits');
    });

    test('должен пройти валидацию для пустого значения', async () => {
      const data: IFormData = { phone: '' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });
  });

  describe('validate - custom', () => {
    test('должен пройти валидацию если кастомный валидатор вернул true', async () => {
      const rules: TValidationRule[] = [
        {
          type: 'custom',
          field: 'customField',
          validator: async (value) => value === 'valid',
          message: 'Custom validation failed'
        }
      ];

      const data: IFormData = { customField: 'valid' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(true);
    });

    test('должен вернуть ошибку если кастомный валидатор вернул false', async () => {
      const rules: TValidationRule[] = [
        {
          type: 'custom',
          field: 'customField',
          validator: async (value) => value === 'valid',
          message: 'Custom validation failed'
        }
      ];

      const data: IFormData = { customField: 'invalid' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.customField).toContain('Custom validation failed');
    });

    test('должен вернуть ошибку если кастомный валидатор бросил исключение', async () => {
      const rules: TValidationRule[] = [
        {
          type: 'custom',
          field: 'customField',
          validator: async () => {
            throw new Error('Validation error');
          },
          message: 'Custom validation failed'
        }
      ];

      const data: IFormData = { customField: 'test' };
      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.customField).toContain('Custom validation failed');
    });
  });

  describe('validate - multiple rules', () => {
    test('должен валидировать несколько правил для одного поля', async () => {
      const data: IFormData = { password: '123' };
      const rules: TValidationRule[] = [
        { type: 'required', field: 'password', message: 'Password is required' },
        { type: 'minLength', field: 'password', value: 8, message: 'Password too short' }
      ];

      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.password).toContain('Password too short');
      expect(result.errors.password).not.toContain('Password is required');
    });

    test('должен валидировать несколько полей', async () => {
      const data: IFormData = {
        email: 'invalid',
        password: '123'
      };
      const rules: TValidationRule[] = [
        { type: 'email', field: 'email', message: 'Invalid email' },
        { type: 'minLength', field: 'password', value: 8, message: 'Password too short' }
      ];

      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toContain('Invalid email');
      expect(result.errors.password).toContain('Password too short');
    });

    test('должен собирать все ошибки для одного поля', async () => {
      const data: IFormData = { age: -5 };
      const rules: TValidationRule[] = [
        { type: 'required', field: 'age', message: 'Age is required' },
        { type: 'min', field: 'age', value: 0, message: 'Age must be positive' },
        { type: 'max', field: 'age', value: 120, message: 'Age too large' }
      ];

      const result = await JavaScriptValidator.validate(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.age).toContain('Age must be positive');
      expect(result.errors.age).toHaveLength(1);
    });
  });
});


import { ValidationRules, ValidationMessages } from './validation';

describe('ValidationRules', () => {
  describe('email', () => {
    it('should accept valid emails', () => {
      expect(ValidationRules.email('test@example.com')).toBe(true);
      expect(ValidationRules.email('user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(ValidationRules.email('invalid')).toBe(false);
      expect(ValidationRules.email('test@')).toBe(false);
      expect(ValidationRules.email('@example.com')).toBe(false);
    });

    it('should reject empty email', () => {
      expect(ValidationRules.email('')).toBe(false);
    });
  });

  describe('password', () => {
    it('should accept valid passwords', () => {
      const result = ValidationRules.password('Password123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short passwords', () => {
      const result = ValidationRules.password('Pass1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe tener al menos 8 caracteres');
    });

    it('should reject passwords without uppercase', () => {
      const result = ValidationRules.password('password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Debe contener al menos una mayúscula');
    });

    it('should reject passwords without lowercase', () => {
      const result = ValidationRules.password('PASSWORD123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Debe contener al menos una minúscula');
    });

    it('should reject passwords without number', () => {
      const result = ValidationRules.password('Password');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Debe contener al menos un número');
    });

    it('should collect all errors', () => {
      const result = ValidationRules.password('bad');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('eventName', () => {
    it('should accept valid names', () => {
      expect(ValidationRules.eventName('Cumpleaños')).toBe(true);
    });

    it('should reject empty names', () => {
      expect(ValidationRules.eventName('')).toBe(false);
    });

    it('should reject too short names', () => {
      expect(ValidationRules.eventName('ab')).toBe(false);
    });

    it('should reject too long names', () => {
      expect(ValidationRules.eventName('a'.repeat(51))).toBe(false);
    });
  });

  describe('participantName', () => {
    it('should accept valid names', () => {
      expect(ValidationRules.participantName('Juan')).toBe(true);
    });

    it('should reject empty names', () => {
      expect(ValidationRules.participantName('')).toBe(false);
    });

    it('should reject too short names', () => {
      expect(ValidationRules.participantName('a')).toBe(false);
    });
  });

  describe('inviteCode', () => {
    it('should accept valid codes', () => {
      expect(ValidationRules.inviteCode('123456')).toBe(true);
    });

    it('should reject short codes', () => {
      expect(ValidationRules.inviteCode('12345')).toBe(false);
    });

    it('should reject long codes', () => {
      expect(ValidationRules.inviteCode('12345678901234567')).toBe(false);
    });
  });
});
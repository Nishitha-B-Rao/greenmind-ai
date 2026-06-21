import { AssessmentSchema, ChatMessageSchema, ReceiptUploadSchema } from '@/lib/validations';

describe('API Validation Schemas', () => {
  describe('AssessmentSchema', () => {
    it('should validate a correct assessment payload', () => {
      const validPayload = {
        diet: 'Meat heavy',
        transport: 'Car (Gasoline)',
        electricity: 'Grid power',
        shopping: 'Weekly fast fashion',
        household: '3 people'
      };
      const result = AssessmentSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should fail if missing required fields', () => {
      const invalidPayload = { diet: 'Meat heavy' };
      const result = AssessmentSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('ChatMessageSchema', () => {
    it('should validate a correct chat message', () => {
      const validPayload = {
        message: 'How do I reduce meat consumption?',
        history: [{ role: 'user', content: 'Hi' }, { role: 'assistant', content: 'Hello!' }]
      };
      const result = ChatMessageSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should fail if message is empty', () => {
      const result = ChatMessageSchema.safeParse({ message: '', history: [] });
      expect(result.success).toBe(false);
    });
  });

  describe('ReceiptUploadSchema', () => {
    it('should validate a correct image payload', () => {
      const result = ReceiptUploadSchema.safeParse({ imageBase64: 'base64encodeddata...', mimeType: 'image/jpeg' });
      expect(result.success).toBe(true);
    });

    it('should fail if mime type is invalid', () => {
      const result = ReceiptUploadSchema.safeParse({ imageBase64: 'data', mimeType: 'application/pdf' });
      expect(result.success).toBe(false);
    });
  });
});

export const MAX_MESSAGE_LENGTH = 4_000;

export function createMessage(payload, createId = () => crypto.randomUUID()) {
  const { contactId, text } = payload ?? {};
  const normalizedContactId = typeof contactId === 'string' ? contactId.trim() : '';
  const normalizedText = typeof text === 'string' ? text.trim() : '';

  if (!normalizedContactId || !normalizedText) {
    return { error: 'A contact and message are required.' };
  }

  if (normalizedText.length > MAX_MESSAGE_LENGTH) {
    return { error: `Messages cannot exceed ${MAX_MESSAGE_LENGTH} characters.` };
  }

  return {
    message: {
      id: createId(),
      contactId: normalizedContactId,
      text: normalizedText,
      createdAt: new Date().toISOString(),
    },
  };
}

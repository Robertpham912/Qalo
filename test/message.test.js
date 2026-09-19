import assert from 'node:assert/strict';
import test from 'node:test';
import { MAX_MESSAGE_LENGTH, createMessage } from '../server/message.js';

test('normalizes a valid message payload', () => {
  const result = createMessage({ contactId: '  linh  ', text: '  Xin chào  ' }, () => 'message-1');
  assert.deepEqual(result.message.id, 'message-1');
  assert.equal(result.message.contactId, 'linh');
  assert.equal(result.message.text, 'Xin chào');
  assert.match(result.message.createdAt, /^\d{4}-\d{2}-\d{2}T/);
});

test('rejects missing fields and oversized messages', () => {
  assert.equal(createMessage({ contactId: '', text: 'Hi' }).error, 'A contact and message are required.');
  assert.equal(createMessage({ contactId: 'linh', text: 'x'.repeat(MAX_MESSAGE_LENGTH + 1) }).error, `Messages cannot exceed ${MAX_MESSAGE_LENGTH} characters.`);
});

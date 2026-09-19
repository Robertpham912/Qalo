import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const messages = [];
const port = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', messageCount: messages.length });
});

app.post('/api/messages', (request, response) => {
  const { contactId, text } = request.body ?? {};
  const trimmedText = typeof text === 'string' ? text.trim() : '';

  if (typeof contactId !== 'string' || !contactId.trim() || !trimmedText) {
    return response.status(400).json({ error: 'A contact and message are required.' });
  }

  const message = {
    id: crypto.randomUUID(),
    contactId: contactId.trim(),
    text: trimmedText,
    createdAt: new Date().toISOString(),
  };
  messages.push(message);
  return response.status(201).json(message);
});

app.use(express.static(join(__dirname, '../dist')));
app.get(/.*/, (_request, response) => response.sendFile(join(__dirname, '../dist/index.html')));

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({ error: 'Invalid JSON body.' });
  }
  return response.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(port, () => console.log(`Qalo chat server ready on port ${port}`));

import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createMessage } from './message.js';

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
  const result = createMessage(request.body);
  if (result.error) {
    return response.status(400).json({ error: result.error });
  }

  messages.push(result.message);
  return response.status(201).json(result.message);
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

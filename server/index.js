import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const app = express(); const __dirname = dirname(fileURLToPath(import.meta.url)); const messages = [];
app.use(express.json({ limit: '16kb' }));
app.post('/api/messages', (req,res) => { const { contactId, text } = req.body || {}; if(typeof contactId !== 'string' || typeof text !== 'string' || !text.trim()) return res.status(400).json({error:'A contact and message are required.'}); const message={id:crypto.randomUUID(),contactId,text:text.trim(),createdAt:new Date().toISOString()}; messages.push(message); res.status(201).json(message); });
app.get('/api/health',(_,res)=>res.json({status:'ok',messageCount:messages.length}));
app.use(express.static(join(__dirname,'../dist'))); app.get(/.*/,(req,res)=>res.sendFile(join(__dirname,'../dist/index.html')));
app.listen(process.env.PORT || 3000,()=>console.log('Qalo chat server ready'));

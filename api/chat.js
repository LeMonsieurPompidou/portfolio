import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
    // CORS: echo origin if present so we can safely set credentials
    const requestOrigin = req.headers.origin || req.headers.referer || '*';
    if (requestOrigin && requestOrigin !== '*') {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    } else {
        res.setHeader('Access-Control-Allow-Credentials', 'false');
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error('Missing GEMINI_API_KEY');
            return res.status(500).json({ error: 'API key not configured on Vercel' });
        }

        // Ensure we have a parsed JSON body. Vercel may or may not populate req.body depending on runtime.
        let body = req.body;
        if (!body || Object.keys(body).length === 0) {
            const contentType = (req.headers['content-type'] || '').toLowerCase();
            if (contentType.includes('application/json')) {
                try {
                    const raw = await new Promise((resolve, reject) => {
                        let data = '';
                        req.on('data', chunk => { data += chunk; });
                        req.on('end', () => resolve(data));
                        req.on('error', err => reject(err));
                    });
                    body = raw ? JSON.parse(raw) : {};
                } catch (parseErr) {
                    console.warn('Failed to parse raw JSON body:', parseErr);
                    body = {};
                }
            } else {
                body = {};
            }
        }

        const { context, message } = body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const fullPrompt = context 
            ? `${context}\n\nUser question: ${message}` 
            : message;

        console.info('Calling Google generative API with prompt length:', fullPrompt.length);
        const response = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: fullPrompt
        });

        // Extract text from the response
        let text = '';
        try {
            if (response && response.text) {
                text = response.text;
            } else if (typeof response === 'string') {
                text = response;
            } else {
                text = JSON.stringify(response);
            }
        } catch (ex) {
            console.warn('Could not extract text from response object, falling back to JSON', ex);
            try { text = JSON.stringify(response); } catch (e) { text = String(response); }
        }

        if (!text) {
            console.warn('Response text is empty');
            return res.status(500).json({ error: 'Empty response from Google API' });
        }

        return res.status(200).json({ reply: text });

    } catch (error) {
        console.error('Chat API Error full:', error);

        if (error && error.response) {
            try {
                const resp = error.response;
                // Log status if present
                if (resp.status) console.error('Google API response status:', resp.status, resp.statusText || '');
                // Try to log headers (may be a Headers object)
                try {
                    if (resp.headers) {
                        if (typeof resp.headers.get === 'function') {
                            console.error('Google API response content-type:', resp.headers.get('content-type'));
                        } else {
                            console.error('Google API response headers:', resp.headers);
                        }
                    }
                } catch (hdrErr) {
                    console.error('Failed to read response headers:', hdrErr);
                }
                const body = typeof resp.text === 'function' ? await resp.text() : JSON.stringify(resp);
                console.error('Google API response body:', body);
            } catch (readErr) {
                console.error('Failed to read error response body:', readErr);
            }
        }

        const msg = error && error.message ? error.message : '';
        if (msg.includes('403') || msg.toLowerCase().includes('permission')) {
            return res.status(403).json({ 
                error: 'Google API Forbidden', 
                message: 'Check if your API key is restricted or if your region is supported.' 
            });
        }

        return res.status(500).json({ error: 'Internal server error', details: msg });
    }
}
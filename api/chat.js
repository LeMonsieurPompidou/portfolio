import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
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

        const { context, message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const fullPrompt = context 
            ? `${context}\n\nUser question: ${message}` 
            : message;

        console.info('Calling Google generative API with prompt length:', fullPrompt.length);
        const result = await model.generateContent(fullPrompt);

        // Inspect result and try to extract text safely
        let text = '';
        try {
            const response = await result.response;
            if (response && typeof response.text === 'function') {
                text = await response.text();
            } else if (result && typeof result.toString === 'function') {
                text = result.toString();
            } else {
                text = JSON.stringify(result);
            }
        } catch (ex) {
            console.warn('Could not extract text from result object, falling back to JSON', ex);
            try { text = JSON.stringify(result); } catch (e) { text = String(result); }
        }

        return res.status(200).json({ reply: text });

    } catch (error) {
        console.error('Chat API Error full:', error);

        if (error && error.response) {
            try {
                const resp = error.response;
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
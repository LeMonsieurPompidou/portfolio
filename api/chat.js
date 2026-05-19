import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Detects if the user message or context contains French language patterns
 * @param {string} message - The user message
 * @param {string} context - The conversation context
 * @returns {boolean} - True if French is detected
 */
function isFrenchMessage(message = '', context = '') {
    const frenchPatterns = /\b(je|tu|il|elle|nous|vous|ils|elles|le|la|les|un|une|des|de|du|et|ou|mais|car|donc|si|non|oui|merci|s'il|plaît|bonjour|bonsoir|ça|cela|celui|celle|où|quoi|comment|pourquoi|quel|quelle|combien|pas|plus|moins|très|aussi|bien|mal|bon|mauvais|grand|petit|nouveau|ancien|dernier|premier|autre|même|seul|tout|aucun)\b/gi;
    
    const combined = `${message} ${context}`;
    const matches = combined.match(frenchPatterns) || [];
    return matches.length > 2; // Threshold: 3+ French words detected
}

export default async function handler(req, res) {
    const requestOrigin = req.headers.origin || req.headers.referer || '*';
    res.setHeader('Access-Control-Allow-Credentials', requestOrigin !== '*' ? 'true' : 'false');
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured on Vercel' });
        }

        const { context, message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const fullPrompt = context 
            ? `${context}\n\nUser question: ${message}` 
            : message;

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
            const result = await model.generateContent(fullPrompt);
            
            // Safely extract text from response
            const responseObj = await result?.response;
            const text = responseObj?.text?.();
            
            if (!text || typeof text !== 'string') {
                throw new Error('Empty or invalid response from Gemini API');
            }

            return res.status(200).json({ reply: text });

        } catch (apiError) {
            console.error('Gemini API call failed:', apiError.message || String(apiError));
            
            // Detect language and provide appropriate fallback
            const isFrench = isFrenchMessage(message, context);
            const fallbackMessage = isFrench
                ? 'Désolé, ma connexion avec mes modules cérébraux a connu un léger timeout. Pouvez-vous reformuler votre question ?'
                : 'Sorry, my neural modules experienced a brief connection timeout. Could you please rephrase your question?';
            
            return res.status(200).json({ reply: fallbackMessage });
        }

    } catch (error) {
        console.error('Chat API configuration error:', error.message || String(error));
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
/**
 * Vercel Serverless Function: Portfolio AI Chat
 * Handles chat requests and forwards them to Google Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
            message: 'Only POST requests are supported'
        });
    }

    try {
        // Validate API key is configured
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY environment variable is not set');
            return res.status(500).json({
                error: 'Configuration error',
                message: 'AI service is not properly configured'
            });
        }

        // Extract context and message from request body
        const { context, message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Request body must include a "message" field'
            });
        }

        const userMessage = message.trim();
        if (userMessage.length === 0) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Message cannot be empty'
            });
        }

        // Initialize the Gemini model
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Build the full prompt with system context
        let fullPrompt = userMessage;
        if (context && typeof context === 'string' && context.trim().length > 0) {
            fullPrompt = `${context}\n\nUser question: ${userMessage}`;
        }

        // Call the Gemini API
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            return res.status(500).json({
                error: 'Empty response',
                message: 'AI returned an empty response'
            });
        }

        // Return the reply as JSON
        return res.status(200).json({
            reply: text,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Chat API error:', error.message);

        // Handle specific error types
        if (error.message && error.message.includes('API key')) {
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Invalid or expired API key'
            });
        }

        if (error.message && error.message.includes('quota')) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: 'API quota exceeded, please try again later'
            });
        }

        // Generic error response
        return res.status(500).json({
            error: 'Internal server error',
            message: 'An error occurred while processing your request'
        });
    }
}


import { GoogleGenAI, Type } from "@google/genai";
import type { Handler, HandlerEvent } from "@netlify/functions";

// This schema is used on the backend to structure the Gemini API call
const verseSchema = {
  type: Type.OBJECT,
  properties: {
    reference: {
      type: Type.STRING,
      description: "The reference of the verse or verse range (e.g., 'Surah Al-Baqarah, 2:285-286')."
    },
    arabic: {
      type: Type.STRING,
      description: "The full verse(s) in its original Arabic script."
    },
    translation: {
      type: Type.STRING,
      description: "The English translation of the verse(s)."
    }
  },
  required: ['reference', 'arabic', 'translation'],
};

const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // Ensure the API key is set in the Netlify environment variables
  if (!process.env.API_KEY) {
    console.error('API_KEY environment variable not set.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error: API key is missing.' }),
    };
  }

  // Initialize the Gemini client within the handler
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const body = JSON.parse(event.body || '{}');
    const { action, query } = body;

    let geminiResponse;
    let isRandomVerse = false;

    switch (action) {
      case 'getPrayerVerses':
        if (!query) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Query is required for finding prayer verses.' }) };
        }
        geminiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Find 1-3 longer Quranic passages or verse compilations that are impactful for prayer related to the following topic: "${query}". These should be suitable for extended recitation during prayer. For each passage, provide the combined Arabic text, translation, and a reference that covers the entire range of verses (e.g., 'Surah Al-Imran, 3:190-194').`,
          config: {
            systemInstruction: "You are an expert Islamic scholar. Provide accurate Quranic verses, including the Arabic text, an eloquent English translation, and the precise reference (Surah name, chapter:verse number range).",
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: verseSchema },
          },
        });
        break;

      case 'getRandomVerse':
        isRandomVerse = true;
        geminiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: "Provide one random, beautiful, and impactful passage from the Quran, consisting of about 5-8 verses, that offers wisdom, comfort, or inspiration. For the passage, provide the combined Arabic text, translation, and a reference that covers the entire range of verses (e.g., 'Surah Al-Baqarah, 2:285-286').",
          config: {
            systemInstruction: "You are an expert Islamic scholar. Provide one accurate Quranic verse or passage, including the Arabic text, an eloquent English translation, and the precise reference (Surah name, chapter:verse number range).",
            responseMimeType: "application/json",
            // Request an array with one item for better reliability from the model
            responseSchema: { type: Type.ARRAY, items: verseSchema },
          },
        });
        break;

      default:
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action specified.' }) };
    }
    
    // Validate that the Gemini API returned valid JSON before sending it to the client.
    let content;
    try {
      content = JSON.parse(geminiResponse.text);
    } catch (e) {
      console.error('Failed to parse JSON from Gemini response:', geminiResponse.text, e);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'AI service returned malformed data.' }),
      };
    }
    
    // If it was a random verse, extract the single verse from the array
    if (isRandomVerse) {
        if (Array.isArray(content) && content.length > 0) {
            content = content[0];
        } else {
            console.error('Expected an array with one verse, but got:', content);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'AI service returned unexpected data format for random verse.' }),
            };
        }
    }


    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    };

  } catch (error) {
    console.error("Error in Netlify function calling Gemini API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while communicating with the AI service.' }),
    };
  }
};

export { handler };

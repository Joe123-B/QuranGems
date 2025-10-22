import { GoogleGenAI, Type } from "@google/genai";
import type { Verse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set. Please ensure it is configured.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the structure we expect from the Gemini API
const verseSchema = {
  type: Type.OBJECT,
  properties: {
    reference: {
      type: Type.STRING,
      description: "The reference of the verse or verse range (e.g., 'Surah Al-Baqarah, 2:255-257')."
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

/**
 * Fetches relevant Quranic verses for a given topic or feeling.
 * @param query - The user's search query (e.g., 'patience', 'gratitude').
 * @returns A promise that resolves to an array of Verse objects.
 */
export const getPrayerVerses = async (query: string): Promise<Verse[]> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find 1-3 longer Quranic passages or verse compilations that are impactful for prayer related to the following topic: "${query}". These should be suitable for extended recitation during prayer. For each passage, provide the combined Arabic text, translation, and a reference that covers the entire range of verses (e.g., 'Surah Al-Imran, 3:190-194').`,
        config: {
            systemInstruction: "You are an expert Islamic scholar. Provide accurate Quranic passages, including the combined Arabic text, an eloquent English translation, and the precise reference (Surah name, chapter:verse number range).",
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: verseSchema,
            },
        },
    });

    const verses = JSON.parse(response.text);
    if (!Array.isArray(verses)) {
        console.error("AI response was not an array:", verses);
        throw new Error("AI response is not in the expected array format.");
    }
    return verses;

  } catch (error) {
    console.error("Error fetching prayer verses from Gemini API:", error);
    // Re-throw the error so the UI can catch it and display a message to the user.
    throw new Error("Failed to fetch verses. The AI service may be temporarily unavailable.");
  }
};

const themes = [
  'patience and perseverance',
  'gratitude and thankfulness',
  'mercy and forgiveness',
  'the signs of God in nature',
  'the stories of the prophets',
  'the importance of charity',
  'the Day of Judgment',
  'the beauty of creation',
  'seeking knowledge',
  'justice and fairness',
  'humility',
  'the relationship between God and humanity',
  'the struggle against evil',
  'the rewards of the righteous',
];

/**
 * Fetches a random, inspiring passage from the Quran.
 * @returns A promise that resolves to a Verse object.
 */
export const getRandomVerse = async (): Promise<Verse> => {
    try {
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide one random, beautiful, and impactful passage from the Quran about "${randomTheme}". The passage should consist of about 2-5 verses that offer wisdom or comfort. Avoid common passages like Ayat al-Kursi or Surah Al-Fatihah. For the passage, provide the combined Arabic text, translation, and a reference that covers the entire range of verses (e.g., 'Surah Al-Baqarah, 2:285-286').`,
            config: {
                systemInstruction: "You are an expert Islamic scholar. Provide one accurate, less common Quranic passage, including the combined Arabic text, an eloquent English translation, and the precise reference (Surah name, chapter:verse number range).",
                responseMimeType: "application/json",
                responseSchema: verseSchema,
            },
        });

        const verse = JSON.parse(response.text);
        if (!verse || typeof verse.reference !== 'string' || typeof verse.arabic !== 'string' || typeof verse.translation !== 'string') {
            console.error("AI response did not match verse schema:", verse);
            throw new Error("AI response is not in the expected format.");
        }

        return verse;

    } catch (error) {
        console.error("Error fetching random verse from Gemini API:", error);
        // Re-throw the error so the UI can catch it and display a message to the user.
        throw new Error("Failed to fetch random verse. The AI service may be temporarily unavailable.");
    }
};
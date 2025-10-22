import type { Verse } from '../types';

// The endpoint for our Netlify function.
// Netlify automatically proxies requests from here to the function.
const API_ENDPOINT = '/api/gemini';

/**
 * A helper function to make API calls to our secure Netlify function.
 * @param action - The specific action for the backend to perform (e.g., 'getRandomVerse').
 * @param payload - Any data to send along with the request (e.g., a user query).
 * @returns The JSON response from the backend function.
 */
const makeApiCall = async (action: string, payload?: any): Promise<any> => {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...payload }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch from the API.' }));
        throw new Error(errorData.error || 'An unknown API error occurred.');
    }

    return response.json();
};


export const getPrayerVerses = async (query: string): Promise<Verse[]> => {
  try {
    const verses: Verse[] = await makeApiCall('getPrayerVerses', { query });
    return verses;
  } catch (error) {
    console.error("Error fetching prayer verses:", error);
    // Re-throw the error so the UI can catch it and display a message.
    throw error;
  }
};

export const getRandomVerse = async (): Promise<Verse> => {
  try {
    const verse: Verse = await makeApiCall('getRandomVerse');
    return verse;
  } catch (error) {
    console.error("Error fetching random verse:", error);
    // Re-throw the error so the UI can catch it and display a message.
    throw error;
  }
};

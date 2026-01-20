import axios from 'axios';

// Microsoft Translator API Configuration
const TRANSLATOR_KEY = import.meta.env.VITE_MICROSOFT_TRANSLATOR_KEY || '';
const TRANSLATOR_ENDPOINT = 'https://api.cognitive.microsofttranslator.com';
const TRANSLATOR_REGION = import.meta.env.VITE_MICROSOFT_TRANSLATOR_REGION || 'global';

interface TranslateOptions {
    text: string | string[];
    targetLanguage: string;
    sourceLanguage?: string;
}

interface TranslationResponse {
    translations: Array<{
        text: string;
        to: string;
    }>;
}

// Translation cache to avoid repeated API calls
const translationCache = new Map<string, string>();

/**
 * Translate text using Microsoft Translator API
 */
export const translateText = async ({
    text,
    targetLanguage,
    sourceLanguage = 'en'
}: TranslateOptions): Promise<string | string[]> => {
    try {
        // If target is same as source, return original
        if (targetLanguage === sourceLanguage) {
            return text;
        }

        const textsToTranslate = Array.isArray(text) ? text : [text];

        // Check cache first
        if (!Array.isArray(text)) {
            const cacheKey = `${text}_${targetLanguage}`;
            if (translationCache.has(cacheKey)) {
                return translationCache.get(cacheKey)!;
            }
        }

        // Prepare request body
        const body = textsToTranslate.map(t => ({ text: t }));

        const response = await axios.post<TranslationResponse[]>(
            `${TRANSLATOR_ENDPOINT}/translate`,
            body,
            {
                params: {
                    'api-version': '3.0',
                    from: sourceLanguage,
                    to: targetLanguage
                },
                headers: {
                    'Ocp-Apim-Subscription-Key': TRANSLATOR_KEY,
                    'Ocp-Apim-Subscription-Region': TRANSLATOR_REGION,
                    'Content-Type': 'application/json'
                }
            }
        );

        const translations = response.data.map(item => item.translations[0].text);

        // Cache single translations
        if (!Array.isArray(text) && translations.length > 0) {
            const cacheKey = `${text}_${targetLanguage}`;
            translationCache.set(cacheKey, translations[0]);
        }

        return Array.isArray(text) ? translations : translations[0];
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original text if translation fails
    }
};

/**
 * Translate with caching
 */
export const translateWithCache = async (
    text: string,
    targetLanguage: string
): Promise<string> => {
    const cacheKey = `${text}_${targetLanguage}`;

    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
    }

    const translated = await translateText({
        text,
        targetLanguage
    }) as string;

    return translated;
};

/**
 * Detect language of text
 */
export const detectLanguage = async (text: string): Promise<string> => {
    try {
        const response = await axios.post(
            `${TRANSLATOR_ENDPOINT}/detect`,
            [{ text }],
            {
                params: {
                    'api-version': '3.0'
                },
                headers: {
                    'Ocp-Apim-Subscription-Key': TRANSLATOR_KEY,
                    'Ocp-Apim-Subscription-Region': TRANSLATOR_REGION,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data[0].language;
    } catch (error) {
        console.error('Language detection error:', error);
        return 'en';
    }
};

/**
 * Get list of supported languages
 */
export const getSupportedLanguages = async () => {
    try {
        const response = await axios.get(
            `${TRANSLATOR_ENDPOINT}/languages`,
            {
                params: {
                    'api-version': '3.0'
                }
            }
        );

        return response.data.translation;
    } catch (error) {
        console.error('Error fetching supported languages:', error);
        return {};
    }
};

/**
 * Clear translation cache
 */
export const clearTranslationCache = () => {
    translationCache.clear();
};

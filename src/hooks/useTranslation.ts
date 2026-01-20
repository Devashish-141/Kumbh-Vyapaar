import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateWithCache } from '@/lib/translateService';

/**
 * Hook to translate a single text string
 */
export function useTranslation(text: string): string {
    const { selectedLanguage } = useLanguage();
    const [translatedText, setTranslatedText] = useState(text);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // If English or empty text, return original
        if (selectedLanguage === 'en' || !text) {
            setTranslatedText(text);
            return;
        }

        const translate = async () => {
            setIsLoading(true);
            try {
                const result = await translateWithCache(text, selectedLanguage);
                setTranslatedText(result);
            } catch (error) {
                console.error('Translation failed:', error);
                setTranslatedText(text); // Fallback to original
            } finally {
                setIsLoading(false);
            }
        };

        translate();
    }, [text, selectedLanguage]);

    return translatedText;
}

/**
 * Hook to translate multiple texts at once
 */
export function useTranslations(texts: Record<string, string>): {
    translations: Record<string, string>;
    isLoading: boolean;
} {
    const { selectedLanguage } = useLanguage();
    const [translations, setTranslations] = useState(texts);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // If English, return original
        if (selectedLanguage === 'en') {
            setTranslations(texts);
            return;
        }

        const translateAll = async () => {
            setIsLoading(true);
            try {
                const keys = Object.keys(texts);
                const values = Object.values(texts);

                // Translate all texts in parallel
                const translatedValues = await Promise.all(
                    values.map(text => translateWithCache(text, selectedLanguage))
                );

                const newTranslations: Record<string, string> = {};
                keys.forEach((key, index) => {
                    newTranslations[key] = translatedValues[index];
                });

                setTranslations(newTranslations);
            } catch (error) {
                console.error('Batch translation failed:', error);
                setTranslations(texts); // Fallback to original
            } finally {
                setIsLoading(false);
            }
        };

        translateAll();
    }, [JSON.stringify(texts), selectedLanguage]);

    return { translations, isLoading };
}

/**
 * Hook for translating with loading state
 */
export function useTranslationWithLoading(text: string): {
    translatedText: string;
    isLoading: boolean;
} {
    const { selectedLanguage } = useLanguage();
    const [translatedText, setTranslatedText] = useState(text);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedLanguage === 'en' || !text) {
            setTranslatedText(text);
            setIsLoading(false);
            return;
        }

        const translate = async () => {
            setIsLoading(true);
            try {
                const result = await translateWithCache(text, selectedLanguage);
                setTranslatedText(result);
            } catch (error) {
                console.error('Translation failed:', error);
                setTranslatedText(text);
            } finally {
                setIsLoading(false);
            }
        };

        translate();
    }, [text, selectedLanguage]);

    return { translatedText, isLoading };
}

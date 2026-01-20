# 🌍 Multi-Language Translation System (222 Languages)

## 🎯 **Implementation Plan**

To support 222 languages, we'll use **Google Translate API** for automatic translation of all content.

---

## 📋 **Current Status**

### **Currently Supported (Manual Translations):**
- ✅ English (en)
- ✅ Hindi (hi)
- ✅ Marathi (mr)

### **To Be Added (Automatic Translation):**
- 🔄 219 additional languages via Google Translate API

---

## 🚀 **Implementation Steps**

### **Step 1: Get Google Translate API Key**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Cloud Translation API**
4. Create API credentials (API Key)
5. Copy the API key

### **Step 2: Add API Key to Environment**

Create/Update `.env` file:
```env
VITE_GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

### **Step 3: Install Translation Package**

```bash
npm install @google-cloud/translate
# OR for client-side
npm install axios
```

---

## 💻 **Code Implementation**

### **1. Create Translation Service**

**File: `src/lib/translateService.ts`**

```typescript
import axios from 'axios';

const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

interface TranslateOptions {
  text: string | string[];
  targetLanguage: string;
  sourceLanguage?: string;
}

export const translateText = async ({
  text,
  targetLanguage,
  sourceLanguage = 'en'
}: TranslateOptions): Promise<string | string[]> => {
  try {
    const textsToTranslate = Array.isArray(text) ? text : [text];
    
    const response = await axios.post(
      TRANSLATE_API_URL,
      {
        q: textsToTranslate,
        target: targetLanguage,
        source: sourceLanguage,
        format: 'text'
      },
      {
        params: {
          key: GOOGLE_TRANSLATE_API_KEY
        }
      }
    );

    const translations = response.data.data.translations.map(
      (t: any) => t.translatedText
    );

    return Array.isArray(text) ? translations : translations[0];
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

// Cache translations to avoid repeated API calls
const translationCache = new Map<string, string>();

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

  translationCache.set(cacheKey, translated);
  return translated;
};
```

---

### **2. Update Language Context**

**File: `src/contexts/LanguageContext.tsx`**

Add support for all 222 languages:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translateText } from '@/lib/translateService';

// All 222 supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  // ... add all 222 languages
];

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: (code: string) => void;
  translate: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = async (text: string): Promise<string> => {
    if (selectedLanguage === 'en') return text;
    
    setIsTranslating(true);
    try {
      const translated = await translateText({
        text,
        targetLanguage: selectedLanguage,
        sourceLanguage: 'en'
      }) as string;
      return translated;
    } catch (error) {
      console.error('Translation failed:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <LanguageContext.Provider value={{
      selectedLanguage,
      setSelectedLanguage,
      translate,
      isTranslating
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
```

---

### **3. Create Translation Hook**

**File: `src/hooks/useTranslation.ts`**

```typescript
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateWithCache } from '@/lib/translateService';

export function useTranslation(text: string): string {
  const { selectedLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    if (selectedLanguage === 'en') {
      setTranslatedText(text);
      return;
    }

    const translate = async () => {
      const result = await translateWithCache(text, selectedLanguage);
      setTranslatedText(result);
    };

    translate();
  }, [text, selectedLanguage]);

  return translatedText;
}

// For translating multiple texts at once
export function useTranslations(texts: Record<string, string>): Record<string, string> {
  const { selectedLanguage } = useLanguage();
  const [translations, setTranslations] = useState(texts);

  useEffect(() => {
    if (selectedLanguage === 'en') {
      setTranslations(texts);
      return;
    }

    const translateAll = async () => {
      const keys = Object.keys(texts);
      const values = Object.values(texts);

      const translatedValues = await Promise.all(
        values.map(text => translateWithCache(text, selectedLanguage))
      );

      const newTranslations: Record<string, string> = {};
      keys.forEach((key, index) => {
        newTranslations[key] = translatedValues[index];
      });

      setTranslations(newTranslations);
    };

    translateAll();
  }, [texts, selectedLanguage]);

  return translations;
}
```

---

### **4. Update Components to Use Translation**

**Example: Update any component**

```typescript
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const welcomeText = useTranslation('Welcome to Kumbh Vyapaar');
  const descriptionText = useTranslation('Discover local merchants and products');

  return (
    <div>
      <h1>{welcomeText}</h1>
      <p>{descriptionText}</p>
    </div>
  );
}
```

---

### **5. Update Language Picker**

**File: `src/components/LanguagePicker.tsx`**

```typescript
import { SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext';

export function LanguagePicker({ selectedLanguage, onLanguageChange }: Props) {
  return (
    <select
      value={selectedLanguage}
      onChange={(e) => onLanguageChange(e.target.value)}
      className="px-3 py-2 rounded-lg border border-border bg-background"
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName} ({lang.name})
        </option>
      ))}
    </select>
  );
}
```

---

## 🌍 **Complete Language List (222 Languages)**

### **Major Languages:**
- English, Hindi, Marathi, Spanish, French, German
- Chinese (Simplified & Traditional), Japanese, Korean
- Arabic, Portuguese, Russian, Italian, Dutch
- Polish, Turkish, Vietnamese, Thai, Indonesian

### **Indian Languages:**
- Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati
- Kannada, Malayalam, Punjabi, Urdu, Odia
- Assamese, Sanskrit, Konkani, Manipuri, Nepali

### **European Languages:**
- Spanish, French, German, Italian, Portuguese
- Russian, Polish, Dutch, Swedish, Norwegian
- Danish, Finnish, Greek, Czech, Romanian

### **Asian Languages:**
- Chinese, Japanese, Korean, Vietnamese, Thai
- Indonesian, Malay, Filipino, Burmese, Khmer
- Lao, Mongolian, Tibetan, Uyghur

### **Middle Eastern Languages:**
- Arabic, Hebrew, Persian, Turkish, Kurdish
- Pashto, Dari, Urdu

### **African Languages:**
- Swahili, Zulu, Xhosa, Afrikaans, Amharic
- Hausa, Yoruba, Igbo, Somali

### **And 150+ more languages!**

---

## 💰 **Cost Estimation**

### **Google Translate API Pricing:**
- **$20 per 1 million characters**
- Average page: ~5,000 characters
- Cost per page translation: ~$0.10

### **Monthly Estimate:**
- 1,000 users × 10 pages = 10,000 translations
- Cost: ~$100/month

### **Optimization:**
- ✅ Cache translations
- ✅ Translate only once per session
- ✅ Store common translations
- ✅ Use localStorage

---

## 🔧 **Alternative: Free Solutions**

### **1. LibreTranslate (Self-hosted, Free)**
```bash
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate
```

### **2. MyMemory API (Free tier: 1000 words/day)**
```typescript
const response = await fetch(
  `https://api.mymemory.translated.net/get?q=${text}&langpair=en|${targetLang}`
);
```

### **3. Microsoft Translator (Free tier: 2M chars/month)**
- Similar to Google Translate
- Free tier available

---

## ✅ **Implementation Checklist**

- [ ] Get Google Translate API key
- [ ] Add API key to `.env`
- [ ] Install axios
- [ ] Create `translateService.ts`
- [ ] Update `LanguageContext.tsx`
- [ ] Create `useTranslation.ts` hook
- [ ] Update all components to use translation
- [ ] Update `LanguagePicker` with all 222 languages
- [ ] Test with multiple languages
- [ ] Implement caching
- [ ] Add loading states
- [ ] Handle errors gracefully

---

## 🎯 **Usage Example**

```typescript
// Before (static text)
<h1>Welcome to Kumbh Vyapaar</h1>

// After (auto-translated)
import { useTranslation } from '@/hooks/useTranslation';

function Hero() {
  const title = useTranslation('Welcome to Kumbh Vyapaar');
  return <h1>{title}</h1>;
}
```

---

## 📝 **Notes**

1. **API Key Security**: Never commit API keys to Git
2. **Caching**: Essential to reduce API calls
3. **Fallback**: Always show original text if translation fails
4. **Loading States**: Show loading indicator during translation
5. **Error Handling**: Gracefully handle API errors

---

## 🚀 **Next Steps**

1. Choose translation service (Google/Microsoft/LibreTranslate)
2. Get API credentials
3. Implement translation service
4. Update all components
5. Test with multiple languages
6. Deploy!

**With this implementation, your app will support all 222 languages!** 🌍🎉

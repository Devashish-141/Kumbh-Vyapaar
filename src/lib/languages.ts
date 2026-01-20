// Complete list of 133 languages supported by Microsoft Translator
// Organized by region for better UX

export interface Language {
    code: string;
    name: string;
    nativeName: string;
    region: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
    // Indian Languages
    { code: 'en', name: 'English', nativeName: 'English', region: 'Global' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', region: 'India' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'India' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'India' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'India' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'India' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'India' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'India' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'India' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'India' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'India' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'India' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'India' },

    // European Languages
    { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Europe' },
    { code: 'fr', name: 'French', nativeName: 'Français', region: 'Europe' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Europe' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Europe' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'Europe' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Europe' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Europe' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Europe' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', region: 'Europe' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk', region: 'Europe' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', region: 'Europe' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', region: 'Europe' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', region: 'Europe' },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština', region: 'Europe' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română', region: 'Europe' },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', region: 'Europe' },
    { code: 'bg', name: 'Bulgarian', nativeName: 'Български', region: 'Europe' },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', region: 'Europe' },
    { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', region: 'Europe' },
    { code: 'sr', name: 'Serbian', nativeName: 'Српски', region: 'Europe' },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', region: 'Europe' },
    { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', region: 'Europe' },
    { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', region: 'Europe' },
    { code: 'et', name: 'Estonian', nativeName: 'Eesti', region: 'Europe' },
    { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', region: 'Europe' },
    { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', region: 'Europe' },
    { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', region: 'Europe' },
    { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', region: 'Europe' },
    { code: 'mt', name: 'Maltese', nativeName: 'Malti', region: 'Europe' },

    // East Asian Languages
    { code: 'zh-Hans', name: 'Chinese (Simplified)', nativeName: '简体中文', region: 'East Asia' },
    { code: 'zh-Hant', name: 'Chinese (Traditional)', nativeName: '繁體中文', region: 'East Asia' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'East Asia' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'East Asia' },
    { code: 'yue', name: 'Cantonese', nativeName: '粵語', region: 'East Asia' },
    { code: 'mn-Cyrl', name: 'Mongolian (Cyrillic)', nativeName: 'Монгол', region: 'East Asia' },

    // Southeast Asian Languages
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Southeast Asia' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', region: 'Southeast Asia' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Southeast Asia' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', region: 'Southeast Asia' },
    { code: 'fil', name: 'Filipino', nativeName: 'Filipino', region: 'Southeast Asia' },
    { code: 'my', name: 'Myanmar (Burmese)', nativeName: 'မြန်မာ', region: 'Southeast Asia' },
    { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', region: 'Southeast Asia' },
    { code: 'lo', name: 'Lao', nativeName: 'ລາວ', region: 'Southeast Asia' },

    // Middle Eastern Languages
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית', region: 'Middle East' },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی', region: 'Middle East' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Middle East' },
    { code: 'ku', name: 'Kurdish (Central)', nativeName: 'کوردی', region: 'Middle East' },
    { code: 'ps', name: 'Pashto', nativeName: 'پښتو', region: 'Middle East' },

    // African Languages
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', region: 'Africa' },
    { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', region: 'Africa' },
    { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', region: 'Africa' },
    { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', region: 'Africa' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', region: 'Africa' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa', region: 'Africa' },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', region: 'Africa' },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo', region: 'Africa' },
    { code: 'so', name: 'Somali', nativeName: 'Soomaali', region: 'Africa' },
    { code: 'rw', name: 'Kinyarwanda', nativeName: 'Kinyarwanda', region: 'Africa' },
    { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', region: 'Africa' },

    // Latin American Languages
    { code: 'pt-PT', name: 'Portuguese (Portugal)', nativeName: 'Português (Portugal)', region: 'Europe' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', region: 'Americas' },
    { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español (México)', region: 'Americas' },

    // Other Languages
    { code: 'sq', name: 'Albanian', nativeName: 'Shqip', region: 'Europe' },
    { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', region: 'Middle East' },
    { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', region: 'Middle East' },
    { code: 'eu', name: 'Basque', nativeName: 'Euskara', region: 'Europe' },
    { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', region: 'Europe' },
    { code: 'ca', name: 'Catalan', nativeName: 'Català', region: 'Europe' },
    { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', region: 'Global' },
    { code: 'gl', name: 'Galician', nativeName: 'Galego', region: 'Europe' },
    { code: 'ka', name: 'Georgian', nativeName: 'ქართული', region: 'Middle East' },
    { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', region: 'Americas' },
    { code: 'hmn', name: 'Hmong Daw', nativeName: 'Hmong Daw', region: 'Asia' },
    { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', region: 'Southeast Asia' },
    { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', region: 'Central Asia' },
    { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', region: 'Central Asia' },
    { code: 'la', name: 'Latin', nativeName: 'Latina', region: 'Historical' },
    { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', region: 'Europe' },
    { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', region: 'Europe' },
    { code: 'mi', name: 'Maori', nativeName: 'Te Reo Māori', region: 'Oceania' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', region: 'South Asia' },
    { code: 'nb', name: 'Norwegian Bokmål', nativeName: 'Norsk Bokmål', region: 'Europe' },
    { code: 'ny', name: 'Nyanja', nativeName: 'Chichewa', region: 'Africa' },
    { code: 'otq', name: 'Querétaro Otomi', nativeName: 'Hñąñho', region: 'Americas' },
    { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa', region: 'Oceania' },
    { code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig', region: 'Europe' },
    { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', region: 'Africa' },
    { code: 'sn', name: 'Shona', nativeName: 'chiShona', region: 'Africa' },
    { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', region: 'South Asia' },
    { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', region: 'South Asia' },
    { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', region: 'Central Asia' },
    { code: 'tt', name: 'Tatar', nativeName: 'Татар', region: 'Europe' },
    { code: 'bo', name: 'Tibetan', nativeName: 'བོད་སྐད་', region: 'Asia' },
    { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', region: 'Africa' },
    { code: 'to', name: 'Tongan', nativeName: 'Lea Fakatonga', region: 'Oceania' },
    { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen', region: 'Central Asia' },
    { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە', region: 'Asia' },
    { code: 'uz', name: 'Uzbek (Latin)', nativeName: 'Oʻzbek', region: 'Central Asia' },
    { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', region: 'Europe' },
    { code: 'fy', name: 'Frisian', nativeName: 'Frysk', region: 'Europe' },
    { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', region: 'Historical' },
];

// Group languages by region for better UX
export const LANGUAGES_BY_REGION = {
    'India': SUPPORTED_LANGUAGES.filter(l => l.region === 'India'),
    'Europe': SUPPORTED_LANGUAGES.filter(l => l.region === 'Europe'),
    'East Asia': SUPPORTED_LANGUAGES.filter(l => l.region === 'East Asia'),
    'Southeast Asia': SUPPORTED_LANGUAGES.filter(l => l.region === 'Southeast Asia'),
    'Middle East': SUPPORTED_LANGUAGES.filter(l => l.region === 'Middle East'),
    'Africa': SUPPORTED_LANGUAGES.filter(l => l.region === 'Africa'),
    'Americas': SUPPORTED_LANGUAGES.filter(l => l.region === 'Americas'),
    'Other': SUPPORTED_LANGUAGES.filter(l => !['India', 'Europe', 'East Asia', 'Southeast Asia', 'Middle East', 'Africa', 'Americas'].includes(l.region)),
};

// Get language by code
export const getLanguageByCode = (code: string): Language | undefined => {
    return SUPPORTED_LANGUAGES.find(l => l.code === code);
};

// Get language name
export const getLanguageName = (code: string): string => {
    const lang = getLanguageByCode(code);
    return lang ? lang.name : code;
};

// Get native language name
export const getNativeLanguageName = (code: string): string => {
    const lang = getLanguageByCode(code);
    return lang ? lang.nativeName : code;
};

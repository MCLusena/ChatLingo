import axios from 'axios';
import config from '../config';

export const translate = async (text, languageTo) => {
  try {
    const apiKey = config.apiKey;

    const detectLanguageUrl = `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`;
    const detectLanguageResponse = await axios.post(detectLanguageUrl, {
      q: text,
    });
    const detectedLanguage = detectLanguageResponse.data.data.detections[0][0].language;
    const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    if (detectedLanguage === languageTo) {
      return text;
    }
    const translationResponse = await axios.post(translateUrl, {
      q: text,
      source: detectedLanguage,
      target: languageTo,
      format: 'text',
    });

    return translationResponse.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation Error:", error);
    throw error;
  }
};
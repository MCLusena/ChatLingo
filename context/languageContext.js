// context/LanguageSelectorContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './authContext';

// Create Context
const LanguageSelectorContext = createContext();

// Context Provider
export const LanguageSelectorProvider = ({ children }) => {
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language
    const { user } = useAuth();
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const apiKey = config.apiKey;
                const url = `https://translation.googleapis.com/language/translate/v2/languages?key=${apiKey}&target=en`;
                const response = await axios.get(url);
                const availableLanguages = response.data.data.languages;
                const formattedLanguages = availableLanguages.map(lang => ({
                    id: lang.language,
                    name: lang.name,
                }));
                setLanguages(formattedLanguages);
                if (user) {
                    loadUserLanguage(user.uid);
                }
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        };
        fetchLanguages();
    }, []);

    const saveUserLanguage = async (language) => {
        if (user.userId == undefined) return;
        try {
            console.log('user.uid:', user.userId);
            await setDoc(doc(db, 'users', user.userId), { language }, { merge: true });
            setSelectedLanguage(language);
        } catch (error) {
            console.error('Error saving user language:', error);
        }
    };

    const loadUserLanguage = async (userId) => {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.language != undefined) {
                    setSelectedLanguage(data.language);
                }
            }
        } catch (error) {
            console.error('Error loading user language:', error);
        }
    };

    return (
        <LanguageSelectorContext.Provider value={{ languages, selectedLanguage, setSelectedLanguage: (lang) => saveUserLanguage(lang) }}>
            {children}
        </LanguageSelectorContext.Provider>
    );
};

// Custom Hook for using Context
export const useLanguageSelector = () => useContext(LanguageSelectorContext);

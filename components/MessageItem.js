import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { translate } from "../utils/translate";
import { useLanguageSelector } from '../context/languageContext';
export default function MessageItem({ message, currentUser }) {
    const [translatedText, setTranslatedText] = useState(message?.text);
    const { selectedLanguage } = useLanguageSelector();
    useEffect(() => {
        if (selectedLanguage == 'disabled') {
            setTranslatedText(message?.text);
            return;
        }
        const translateMessage = async () => {
            try {
                if (message?.text) {
                    const translation = await translate(message?.text, selectedLanguage); // Translate to French (fr)
                    setTranslatedText(translation);
                }
            } catch (error) {
                console.error("Error translating message:", error);
                setTranslatedText(message?.text);
            }
        };
        translateMessage();
    }, [message?.text, selectedLanguage]);

    if (currentUser?.userId === message?.userId) {
        return (
            <View className="flex-row justify-end mb-3 mr-3">
                <View style={{ width: wp(80) }}>
                    <View className="flex self-end p-3 rounded-2xl bg-white border border-neutral-200">
                        <Text style={{ fontSize: hp(1.9) }}>
                            {translatedText}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
    else {
        return (
            <View style={{ width: wp(80) }} className="ml-3 mb-3">
                <View className="flex self-start p-3 px-4 rounded-2xl bg-indigo-100 border border-indigo-200">
                    <Text style={{ fontSize: hp(1.9) }}>
                        {translatedText}
                    </Text>
                </View>
            </View>
        );
    }
}

import { View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { blurhash, formatDate, getRoomId } from '../utils/common';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { translate } from '../utils/translate';
import { useLanguageSelector } from '../context/languageContext';

export default function ChatItem({ item, router, noBorder, currentUser }) {
    const [lastMessage, setLastMessage] = useState(undefined);
    const [translatedText, setTranslatedText] = useState('');
    const { selectedLanguage,enabled } = useLanguageSelector();
    useEffect(() => {
        let roomId = getRoomId(currentUser?.userId, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => doc.data());
            setLastMessage(allMessages[0] ? allMessages[0] : null);
        });

        return unsub;
    }, []);

    useEffect(() => {
        const translateLastMessage = async () => {
            if (lastMessage) {
                
                if (currentUser?.userId !== lastMessage?.userId) {
                    const messageText = lastMessage?.text || 'Say Hi';
                    const translated = await translateMessage(messageText,selectedLanguage);
                    setTranslatedText(translated);
                } else {
                    const messageText = `You: ${lastMessage?.text}`;
                    const translated = await translateMessage(messageText,selectedLanguage);
                    setTranslatedText(translated);
                }
            } else {
                const translated = await translateMessage('Say Hi',selectedLanguage);
                setTranslatedText(`${translated} 👋`);
            }
        };

        translateLastMessage();
    }, [lastMessage, currentUser,selectedLanguage]);
    
    useEffect(() => {
    },[translatedText]);
    // Translate the message
    const translateMessage = async (message,lang) => {
        if(lang == 'disabled') return message;
        try {
            if (message) {
                const translation = await translate(message, lang); 
                return translation;
            }
        } catch (error) {
            console.error("Error translating message:", error);
            return message;
        }
    };

    const openChatRoom = () => {
        router.push({ pathname: '/chatRoom', params: item });
    };

    const renderTime = () => {
        if (lastMessage) {
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        }
        return null;
    };

    return (
        <TouchableOpacity onPress={openChatRoom}>
            <View className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${noBorder ? '' : 'border-b border-b-neutral-200'}`}>
                <Image
                    style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
                    source={item?.profileUrl}
                    placeholder={{ blurhash }}
                    transition={500}
                />

                {/* name and last message */}
                <View className="flex-1 gap-1">
                    <View className="flex-row justify-between">
                        <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-800">
                            {item?.username}
                        </Text>
                        <Text style={{ fontSize: hp(1.6) }} className="font-medium text-neutral-500">
                            {renderTime()}
                        </Text>
                    </View>
                    <Text style={{ fontSize: hp(1.6) }} className="font-medium text-neutral-500">
                        {translatedText ? translatedText : 'Loading...'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

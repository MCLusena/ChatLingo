import { View, Text, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common';
import { useAuth } from '../context/authContext';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { MenuItem } from './CustomMenuItems';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useLanguageSelector } from '../context/languageContext';

const android = Platform.OS == 'android';

export default function HomeHeader() {
    const { languages, selectedLanguage, setSelectedLanguage } = useLanguageSelector();
    const { user, logout } = useAuth();

    const insets = useSafeAreaInsets();
    const { top } = insets;

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(selectedLanguage);
    const [items, setItems] = useState(
        languages.map(lang => ({ label: lang.name, value: lang.id }))
    );

    const handleProfile = () => {
        // Handle profile navigation
    };

    const handleLogout = async () => {
        await logout();
    };

    useEffect(() => {
        setItems([{ label: 'Disable', value: 'disabled' }, ...languages.map(lang => ({ label: lang.name, value: lang.id }))])
    }, [languages]);

    useEffect(() => {
        setValue(selectedLanguage);
    }, [selectedLanguage]);

    return (
        <View style={{ paddingTop: android ? top + 10 : 10 }} className="flex-row justify-between px-5 bg-indigo-400 pb-6 rounded-b-3xl shadow">

            <View className="flex-row items-center gap-3">
                <View>
                    <Text style={{ fontSize: hp(3) }} className="font-medium text-white">
                        Chats
                    </Text>
                </View>

                {/* Language Selector */}
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    searchable={true}
                    onChangeValue={(item) => setSelectedLanguage(item)}
                    searchPlaceholder="Search..."
                    containerStyle={{ width: wp(40), marginLeft: wp(22) }}
                    style={{
                        backgroundColor: '#C7D2FE',
                        borderColor: '#4F46E5',
                        borderRadius: 5,
                    }}
                    textStyle={{
                        color: 'black',
                        fontSize: hp(2),
                    }}
                    dropDownContainerStyle={{
                        backgroundColor: '#fff',
                        borderColor: '#E0E7FF',

                    }}
                />

                {/* Profile Image */}
                <Menu>
                    <MenuTrigger>
                        <Image
                            style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
                            source={user?.profileUrl}
                            placeholder={{ blurhash }}
                            transition={500}
                        />
                    </MenuTrigger>
                    <MenuOptions
                        customStyles={{
                            optionsContainer: {
                                borderRadius: 10,
                                borderCurve: 'continuous',
                                marginTop: 40,
                                marginLeft: -30,
                                backgroundColor: 'white',
                                shadowOpacity: 0.2,
                                shadowOffset: { width: 0, height: 0 },
                                width: 160,
                            },
                        }}
                    >
                        <MenuItem
                            text="Profile"
                            action={handleProfile}
                            value={null}
                            icon={<Feather name="user" size={hp(2.5)} color="#737373" />}
                        />
                        <Divider />
                        <MenuItem
                            text="Sign Out"
                            action={handleLogout}
                            value={null}
                            icon={<AntDesign name="logout" size={hp(2.5)} color="#737373" />}
                        />
                    </MenuOptions>
                </Menu>
            </View>
        </View>
    );
}

const Divider = () => {
    return (
        <View className="p-[1px] w-full bg-neutral-200" />
    );
};

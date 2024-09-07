import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import HomeHeader from '../../components/HomeHeader'
import {LanguageSelectorProvider} from '../../context/languageContext'

export default function _layout() {
  return (
    <LanguageSelectorProvider>
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          header: () => <HomeHeader />
        }}
      />

    </Stack>
    </LanguageSelectorProvider>
  )
}
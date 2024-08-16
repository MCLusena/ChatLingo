import { View, Text } from 'react-native'
import LottieView from 'lottie-react-native'
import React from 'react'

export default function Loading({ size }) {
    return (
        <View style={{ height: size, aspectRatio: 1 }}>
            <LottieView style={{ flex: 1 }} source={require('../assets/images/loading.json')} autoPlay loop />
        </View>
    )
}
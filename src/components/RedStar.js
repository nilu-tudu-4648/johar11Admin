import { StyleSheet, View } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../constants/theme'
import AppText from './AppText'

const RedStar = () => {
    return (
        <View style={{ flex: 1 }}>
            <AppText style={styles.smallText}>*</AppText>
        </View>
    )
}

export default React.memo(RedStar)

const styles = StyleSheet.create({
    smallText: {
        fontSize: SIZES.h7,
        alignSelf: "stretch",
        color: COLORS.red,
    },
})
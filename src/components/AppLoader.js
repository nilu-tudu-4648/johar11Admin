import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../constants/theme'

const AppLoader = ({ loading }) => {
    return (
        <Modal animationType='none' visible={loading} transparent={true}>
            <View style={styles.container}>
                <ActivityIndicator size={55} color={COLORS.blue} />
            </View>
        </Modal>
    )
}

export default React.memo(AppLoader)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
    }
})
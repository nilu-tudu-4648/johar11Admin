import React from 'react'
import { StyleSheet } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { COLORS, SIZES } from '../constants/theme'



const AppSearchBar = ({
    searchQuery,
    placeholder,
    onChangeSearch,
    style
}) => {
    return (
        <Searchbar
            placeholder={placeholder ? placeholder : "Search"}
            placeholderTextColor={COLORS.lightgray1}
            onChangeText={onChangeSearch}
            value={searchQuery}
            inputStyle={{ fontSize: 12 }}
            style={[styles.container, style]}
        />
    )
}
const styles = StyleSheet.create({
    container: {
        width: '99%',
        borderWidth: .4,
        borderColor: COLORS.gray,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.base
    }
})
export default React.memo(AppSearchBar)
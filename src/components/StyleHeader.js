import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AppHeader from '../components/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { NAVIGATION } from '../constants/routes';
import { COLORS, FSTYLES, SIZES, STYLES } from '../constants/theme';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import AppSearchBar from './AppSearchBar';
import { useDispatch } from 'react-redux';
import AppText from './AppText';
import { AntDesign } from '@expo/vector-icons';
const StyleHeader = ({ searchQuery, onChangeSearch, closeSheet, placeholder, onPress }) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const onChange = (query) => {
        // dispatch(setsearchQueryData(query));
    }
    const navigationState = useNavigationState(state => state);
    const activeRouteName = navigationState.routes[navigationState.index].name;
    const isLeads = activeRouteName === NAVIGATION.LEADS ? true : false;
    return (
        <AppHeader style={{ justifyContent: 'space-around', paddingHorizontal: SIZES.h4 }}>
            <View style={FSTYLES}>
                <Ionicons onPress={() => navigation.openDrawer()} name="reorder-three-sharp" size={SIZES.largeTitle * .8} color={COLORS.white} />
                <AppText size={2} bold={true} color={COLORS.white}>{activeRouteName.toUpperCase() || activeRouteName.toUpperCase()}</AppText>
                <TouchableOpacity onPress={() => navigation.navigate(!isLeads ? NAVIGATION.PROFILE : NAVIGATION.LEADS_VISIT_HISTORY)}>
                    <FontAwesome5 name={!isLeads ? 'user-circle' : 'history'} size={SIZES.largeTitle * .6} color={COLORS.white} />
                </TouchableOpacity>
            </View>
            {
                onPress ?
                    <View style={{ height: 60, ...FSTYLES }}>
                        <AppSearchBar style={{ width: '83%' }} closeSheet={closeSheet} onChangeSearch={onChangeSearch ? onChangeSearch : onChange}
                            searchQuery={searchQuery} placeholder={placeholder} />
                        <TouchableOpacity onPress={onPress} style={{ width: '15%', backgroundColor: COLORS.white, height: '95%', ...STYLES, borderRadius: SIZES.base }} >
                            <AntDesign name="plus" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    : <AppSearchBar closeSheet={closeSheet} onChangeSearch={onChangeSearch ? onChangeSearch : onChange}
                        searchQuery={searchQuery} placeholder={placeholder} />
            }
        </AppHeader>
    )
}

export default StyleHeader

const styles = StyleSheet.create({})
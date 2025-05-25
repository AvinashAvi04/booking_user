import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import Header from '../components/Header';
import Button from '../components/Button';
import MapView, { Marker, Callout } from 'react-native-maps';
import { mapDarkStyle, mapStandardStyle } from '../data/mapData';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const LocationDetails = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { dark, colors } = useTheme();

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
                    <Header title="Location Details" />
                </View>

                <MapView
                    style={styles.mapContainer}
                    customMapStyle={dark ? mapDarkStyle : mapStandardStyle}
                    userInterfaceStyle="dark"
                    initialRegion={{
                        latitude: 48.8566,
                        longitude: 2.3522,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    <Marker
                        coordinate={{
                            latitude: 48.8566,
                            longitude: 2.3522,
                        }}
                        image={icons.location}
                        title="Move"
                        description="Address"
                        onPress={() => console.log("Move to another screen")}>
                        <Callout tooltip>
                            <View>
                                <View style={styles.bubble}>
                                    <Text
                                        style={{
                                            ...FONTS.body4,
                                            fontWeight: 'bold',
                                            color: COLORS.black,
                                        }}>
                                        User Address
                                    </Text>
                                </View>
                                <View style={styles.arrowBorder} />
                                <View style={styles.arrow} />
                            </View>
                        </Callout>
                    </Marker>
                </MapView>

                <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
                    <Button
                        title="Get Direction"
                        filled
                        style={styles.btn}
                        onPress={() => navigation.navigate("selectcar")}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        padding: 16,
        zIndex: 99999,
        backgroundColor: COLORS.white
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        height: 54,
        right: 0,
        left: 0,
        width: "100%",
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.white
    },
    btn: {
        width: SIZES.width - 32,
        marginTop: 22
    },
    locationMapContainer: {
        height: 226,
        width: "100%",
        borderRadius: 12,
        marginVertical: 16
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        borderRadius: 12,
        backgroundColor: COLORS.dark2
    },
    viewMapContainer: {
        height: 50,
        backgroundColor: COLORS.gray,
        alignItems: "center",
        justifyContent: "center",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 15,
        width: 'auto',
    },
    // Arrow below the bubble
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
    },
})

export default LocationDetails
import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import Header from '../components/Header';
import Button from '../components/Button';
import MapView, { Marker, Callout } from 'react-native-maps';
import { mapDarkStyle, mapStandardStyle } from '../data/mapData';
import { useTheme } from '../theme/ThemeProvider';
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const AddressDirection = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { dark, colors } = useTheme();
    const refRBSheet = useRef<any>(null);

    useEffect(() => {
        refRBSheet.current.open()
    }, [])

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
                    <Header title="Address Direction" />
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
                        onPress={() => console.log("Move to another screen")}
                    >
                        <Callout tooltip>
                            <View>
                                <View style={styles.bubble}>
                                    <Text
                                        style={{
                                            ...FONTS.body4,
                                            fontWeight: 'bold',
                                            color: COLORS.black,
                                        }}
                                    >
                                        User Address
                                    </Text>
                                </View>
                                <View style={styles.arrowBorder} />
                                <View style={styles.arrow} />
                            </View>
                        </Callout>
                    </Marker>
                </MapView>

                <RBSheet
                    ref={refRBSheet}
                    closeOnPressMask={true}
                    height={300}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0,0,0,0.1)",
                        },
                        draggableIcon: {
                            backgroundColor: dark ? COLORS.dark3 : "#000",
                        },
                        container: {
                            borderTopRightRadius: 32,
                            borderTopLeftRadius: 32,
                            height: 300,
                            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                            alignItems: "center",
                        }
                    }}>
                    <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
                        <View style={styles.bottomTopContainer}>
                            <Text style={[styles.bottomTopTitle, {
                                color: dark ? COLORS.white : COLORS.greyscale900
                            }]}>Distance</Text>
                            <Text style={[styles.bottomTopSubtitle, {
                                color: dark ? COLORS.secondaryWhite : COLORS.greyScale800
                            }]}>4.5 Km</Text>
                        </View>
                        <View style={styles.separateLine} />
                        <View style={styles.addressItemContainer}>
                            <View style={styles.addressItemLeftContainer}>
                                <View style={styles.addressIcon1}>
                                    <View style={styles.addressIcon2}>
                                        <Image
                                            source={icons.crosshair}
                                            resizeMode='contain'
                                            style={styles.addressIcon3}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Text style={[styles.locationTitle, {
                                        color: dark ? COLORS.white : COLORS.greyscale900
                                    }]}>
                                        My Current Location
                                    </Text>
                                    <Text style={[styles.locationSubtitle, {
                                        color: dark ? COLORS.grayscale100 : COLORS.greyScale800
                                    }]}>
                                        35 Oak Ave Antitoch, TN 37013
                                    </Text>
                                </View>
                            </View>
                            <Image
                                source={icons.editPencil}
                                resizeMode='contain'
                                style={styles.editPencilIcon}
                            />
                        </View>
                        <View style={styles.addressItemContainer}>
                            <View style={styles.addressItemLeftContainer}>
                                <View style={styles.addressIcon1}>
                                    <View style={styles.addressIcon2}>
                                        <Image
                                            source={icons.location2}
                                            resizeMode='contain'
                                            style={styles.addressIcon3}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Text style={[styles.locationTitle, {
                                        color: dark ? COLORS.white : COLORS.greyscale900
                                    }]}>
                                        My Current Location
                                    </Text>
                                    <Text style={[styles.locationSubtitle, {
                                        color: dark ? COLORS.grayscale100 : COLORS.greyScale800
                                    }]}>
                                        35 Oak Ave Antitoch, TN 37013
                                    </Text>
                                </View>
                            </View>
                            <Image
                                source={icons.editPencil}
                                resizeMode='contain'
                                style={styles.editPencilIcon}
                            />
                        </View>
                        <Button
                            title="Continue to Order"
                            filled
                            style={styles.btn}
                            onPress={() => {
                                refRBSheet.current.close();
                                navigation.navigate("selectcar")
                            }}
                        />
                    </View>
                </RBSheet>
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
        height: 292,
        right: 0,
        left: 0,
        width: "100%",
        paddingHorizontal: 16,
        alignItems: "center",
        backgroundColor: COLORS.white
    },
    btn: {
        width: SIZES.width - 32,
        marginTop: 12
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
    bottomTopContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 22,
    },
    bottomTopTitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.black
    },
    bottomTopSubtitle: {
        fontSize: 16,
        color: COLORS.greyscale900,
        fontFamily: "regular"
    },
    separateLine: {
        height: .4,
        width: SIZES.width - 32,
        backgroundColor: COLORS.greyscale300,
        marginVertical: 12
    },
    addressItemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 12
    },
    addressItemLeftContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    addressIcon1: {
        width: 52,
        height: 52,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(254, 187, 27, 0.3)",
        marginRight: 12,
    },
    addressIcon2: {
        height: 36,
        width: 36,
        borderRadius: 999,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    addressIcon3: {
        height: 20,
        width: 20,
        tintColor: COLORS.greyscale900
    },
    locationTitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginBottom: 6
    },
    locationSubtitle: {
        fontSize: 13,
        color: COLORS.grayscale700,
        fontFamily: "regular"
    },
    editPencilIcon: {
        height: 20,
        width: 20,
        tintColor: COLORS.primary
    },
})

export default AddressDirection
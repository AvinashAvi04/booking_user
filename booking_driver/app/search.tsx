import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, Alert } from 'react-native';
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { allRoutes } from '../data';
import NotFoundCard from '../components/NotFoundCard';
import { useTheme } from '../theme/ThemeProvider';
import RouteItem from '../components/RouteItem';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '../components/Button';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import AddressItem from '../components/AddressItem';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const isTestMode = true;

const initialState = {
    inputValues: {
        currentLocation: isTestMode ? 'Current Location' : '',
        destination: isTestMode ? 'Destination' : '',
    },
    inputValidities: {
        currentLocation: false,
        destination: false
    },
    formIsValid: false,
}


const Search = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const refRBSheet = useRef<any>(null);
    const { dark, colors } = useTheme();

    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const [error, setError] = useState(null);

    const inputChangedHandler = useCallback(
           (inputId: string, inputValue: string) => {
               const result = validateInput(inputId, inputValue)
               dispatchFormState({
                   inputId,
                   validationResult: result,
                   inputValue,
               })
           }, [dispatchFormState]);

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error)
        }
    }, [error]);
    /**
    * Render header
    */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            resizeMode='contain'
                            style={[styles.backIcon, {
                                tintColor: dark ? COLORS.white : COLORS.greyscale900
                            }]}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>
                        Search
                    </Text>
                </View>
                <TouchableOpacity>
                    <Image
                        source={icons.moreCircle}
                        resizeMode='contain'
                        style={[styles.moreIcon, {
                            tintColor: dark ? COLORS.white : COLORS.greyscale900
                        }]}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * Render content
    */
    const renderContent = () => {
        const [selectedTab, setSelectedTab] = useState('row');
        const [searchQuery, setSearchQuery] = useState('');
        const [filteredRoutes, setfilteredRoutes] = useState(allRoutes);
        const [resultsCount, setResultsCount] = useState(0);

        useEffect(() => {
            handleSearch();
        }, [searchQuery, selectedTab]);


        const handleSearch = () => {
            const events = allRoutes.filter((route) =>
                route.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setfilteredRoutes(events);
            setResultsCount(events.length);
        };

        return (
            <View>
                {/* Search bar */}
                <View
                    style={[styles.searchBarContainer, {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite
                    }]}>
                    <TouchableOpacity
                        onPress={handleSearch}>
                        <Image
                            source={icons.search2}
                            resizeMode='contain'
                            style={styles.searchIcon}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Search'
                        placeholderTextColor={COLORS.gray}
                        style={[styles.searchInput, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                    <TouchableOpacity
                        onPress={() => refRBSheet.current.open()}>
                        <Image
                            source={icons.filter}
                            resizeMode='contain'
                            style={styles.filterIcon}
                        />
                    </TouchableOpacity>
                </View>


                <View style={styles.reusltTabContainer}>
                    <Text style={[styles.tabText, {
                        color: dark ? COLORS.secondaryWhite : COLORS.black
                    }]}>{resultsCount} founds</Text>
                    <View>
                        <Text style={styles.clearAll}>Clear All</Text>
                    </View>
                </View>

                {/* Results container  */}
                <View>
                    {/* Events result list */}
                    <View style={{
                        backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
                        marginVertical: 16
                    }}>
                        {resultsCount && resultsCount > 0 ? (
                            <>
                                <FlatList
                                    data={filteredRoutes}
                                    keyExtractor={(item) => item.id}

                                    renderItem={({ item }) => {
                                        return (
                                            <RouteItem
                                                name={item.name}
                                                address={item.address}
                                                distance={item.distance}
                                                onPress={() => navigation.navigate("locationdetails")}
                                            />
                                        )
                                    }}
                                />

                            </>
                        ) : (
                            <NotFoundCard />
                        )}
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {renderHeader()}
                <View>
                    {renderContent()}
                </View>
            </View>

            <RBSheet
                ref={refRBSheet}
                closeOnPressMask={true}
                height={580}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                    draggableIcon: {
                        backgroundColor: dark ? COLORS.dark3 : "#000",
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 540,
                        backgroundColor: dark ? COLORS.black : COLORS.white,
                        alignItems: "center",
                    }
                }}>
                <Text style={[styles.bottomTitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>Select Address</Text>

                <View style={styles.separateLine} />

                <View style={styles.bottomView}>
                    <Input
                        id="currentLocation"
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['currentLocation']}
                        placeholder="Current Location"
                        placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                        icon={icons.dotCircle}
                    />
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['destination']}
                        autoCapitalize="none"
                        id="destination"
                        placeholder="Destination"
                        placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                        icon={icons.location2}
                    />
                </View>

                <View style={styles.separateLine} />

                <View style={styles.savedView}>
                    <View style={styles.savedLeftView}>
                        <Image
                            source={icons.bookmark2}
                            resizeMode='contain'
                            style={styles.bookmarIcon}
                        />
                        <Text style={[styles.savedTitle, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>Saved Places</Text>
                    </View>
                    <TouchableOpacity>
                        <Image
                            source={icons.arrowRight}
                            resizeMode='contain'
                            style={[styles.arrowRightIcon, {
                                tintColor: dark ? COLORS.white : COLORS.greyscale900
                            }]}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.separateLine} />
                <AddressItem
                    name="Eleonora Hotel"
                    address="6 Glendale St. Worcester, MA 01604"
                    distance="2.9 Km"
                    onPress={() => console.log("Clicked")}
                />
                <AddressItem
                    name="Grand City Park"
                    address="307 Lilac Drive Munster, IN 46321"
                    distance="8.3 Km"
                    onPress={() => console.log("Clicked")}
                />
                <View style={styles.bottomContainer}>
                    <Button
                        title="Reset"
                        style={{
                            width: (SIZES.width - 32) / 2 - 8,
                            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
                        }}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Continue"
                        filled
                        style={styles.logoutButton}
                        onPress={() => {
                            refRBSheet.current.close()
                            setTimeout(() => {
                                navigation.navigate("addressdirection")
                            }, 1000);
                        }}
                    />
                </View>
            </RBSheet>
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
        padding: 16
    },
    headerContainer: {
        flexDirection: "row",
        width: SIZES.width - 32,
        justifyContent: "space-between",
        marginBottom: 16
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center"
    },
    searchIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.gray
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: "regular",
        marginHorizontal: 8
    },
    filterIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary
    },
    tabContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: SIZES.width - 32,
        justifyContent: "space-between"
    },
    tabBtn: {
        width: (SIZES.width - 32) / 2 - 6,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        borderRadius: 32
    },
    selectedTab: {
        width: (SIZES.width - 32) / 2 - 6,
        height: 42,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        borderRadius: 32
    },
    tabBtnText: {
        fontSize: 16,
        fontFamily: "semiBold",
        color: COLORS.primary,
        textAlign: "center"
    },
    selectedTabText: {
        fontSize: 16,
        fontFamily: "semiBold",
        color: COLORS.white,
        textAlign: "center"
    },
    resultContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: SIZES.width - 32,
        marginVertical: 16,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.black,
    },
    subResult: {
        fontSize: 14,
        fontFamily: "semiBold",
        color: COLORS.primary
    },
    resultLeftView: {
        flexDirection: "row"
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 22,
        paddingHorizontal: 16,
        width: SIZES.width
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32
    },
    logoutButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32
    },
    bottomTitle: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.black,
        textAlign: "center",
        marginTop: 12
    },
    separateLine: {
        height: .4,
        width: SIZES.width - 32,
        backgroundColor: COLORS.greyscale300,
        marginVertical: 12
    },
    sheetTitle: {
        fontSize: 18,
        fontFamily: "semiBold",
        color: COLORS.black,
        marginVertical: 12
    },
    reusltTabContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: SIZES.width - 32,
        justifyContent: "space-between"
    },
    clearAll: {
        fontFamily: "bold",
        color: COLORS.primary,
        fontSize: 18
    },
    tabText: {
        fontSize: 20,
        fontFamily: "semiBold",
        color: COLORS.black
    },
    bottomView: {
        width: SIZES.width - 32
    },
    savedView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: SIZES.width - 32,
        marginVertical: 12,
    },
    savedLeftView: {
        flexDirection: "row",
        alignItems: "center"
    },
    bookmarIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary
    },
    savedTitle: {
        fontSize: 18,
        fontFamily: "semiBold",
        color: COLORS.black,
        marginLeft: 16
    },
    arrowRightIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.greyscale900
    },
})

export default Search
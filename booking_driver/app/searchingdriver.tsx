import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS, icons, images } from '../constants';
import Header from '../components/Header';
import MapView, { Marker, Callout } from 'react-native-maps';
import { mapDarkStyle, mapStandardStyle } from '../data/mapData';
import { useTheme } from '../theme/ThemeProvider';
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const SearchingDriver = () => {
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
          <Header title="Searching direction" />
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
            image={icons.location2}
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
          height={412}
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
              height: 412,
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            }
          }}>
          <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
            <View style={styles.bottomTopContainer}>
              <Text style={[styles.bottomTopTitle, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>Driver is Arriving...</Text>
              <Text style={[styles.bottomTopSubtitle, {
                color: dark ? COLORS.grayscale100 : COLORS.greyScale800
              }]}>2 mins</Text>
            </View>
            <View style={styles.separateLine} />

            <View style={styles.driverInfoContainer}>
              <View style={styles.driverLeftInfo}>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet.current.close();
                    navigation.navigate("driverdetails")
                  }}>
                  <Image
                    source={images.user2}
                    resizeMode='contain'
                    style={styles.driverImage}
                  />
                </TouchableOpacity>
                <View>
                  <Text style={[styles.driverName, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                  }]}>Daniel Austin</Text>
                  <Text style={[styles.driverCar, {
                    color: dark ? COLORS.grayscale100 : COLORS.grayscale700
                  }]}>Mercedes-Benz E-class</Text>
                </View>
              </View>
              <View style={styles.driverRightContainer}>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet.current.close();
                    setTimeout(() => {
                      navigation.navigate("driverreviews");
                    }, 2000); // 2000 milliseconds = 2 seconds
                  }}
                  style={styles.driverRightReview}>
                  <Image
                    source={icons.star2}
                    resizeMode='contain'
                    style={styles.starIcon}
                  />
                  <Text style={[styles.starNum, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                  }]}>4.8</Text>
                </TouchableOpacity>
                <Text style={[styles.taxiID, {
                  color: dark ? COLORS.white : COLORS.greyscale900
                }]}>HSW 4736 XK</Text>
              </View>
            </View>

            <View style={styles.separateLine} />

            <View style={styles.locationItemContainer}>
              <View style={styles.locationItemRow}>
                <View style={styles.locationIcon1}>
                  <View style={styles.locationIcon2}>
                    <Image
                      source={icons.crosshair}
                      resizeMode='contain'
                      style={styles.locationIcon3}
                    />
                  </View>
                </View>
                <View>
                  <Text style={[styles.baseLocationName, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                  }]}>
                    My Current Location
                  </Text>
                  <Text style={[styles.baseLocationAddress, {
                    color: dark ? COLORS.grayscale100 : COLORS.greyScale800
                  }]}>
                    35 Oak Ave. Antioch, TN 37010
                  </Text>
                </View>
              </View>
              <Text style={[styles.locationDistance, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>0 Km</Text>
            </View>
            <View style={styles.locationItemContainer}>
              <View style={styles.locationItemRow}>
                <View style={styles.locationIcon1}>
                  <View style={styles.locationIcon2}>
                    <Image
                      source={icons.location2}
                      resizeMode='contain'
                      style={styles.locationIcon3}
                    />
                  </View>
                </View>
                <View>
                  <Text style={[styles.baseLocationName, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                  }]}>
                    Soft Bank Buildings
                  </Text>
                  <Text style={[styles.baseLocationAddress, {
                    color: dark ? COLORS.grayscale100 : COLORS.greyScale800
                  }]}>
                    26 States St. Daphne, AL 36526
                  </Text>
                </View>
              </View>
              <Text style={[styles.locationDistance, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>4 Km</Text>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.close();
                  navigation.navigate("(tabs)")
                }}
                style={[styles.actionBtn, {
                  backgroundColor: dark ? "rgba(255, 228, 164, 1)" : "rgba(254, 187, 27, 0.2)"
                }]}>
                <Image
                  source={icons.close}
                  resizeMode='contain'
                  style={[styles.actionIcon, {
                    tintColor: dark ? COLORS.black : COLORS.black
                  }]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.close();
                  navigation.navigate("chat")
                }}
                style={styles.actionBtn}>
                <Image
                  source={icons.chat}
                  resizeMode='contain'
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.close();
                  navigation.navigate("call")
                }}
                style={styles.actionBtn}>
                <Image
                  source={icons.telephone}
                  resizeMode='contain'
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
            </View>
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
    height: 400,
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
  driverInfoContainer: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  driverLeftInfo: {
    flexDirection: "row",
    alignItems: "center"
  },
  driverImage: {
    width: 52,
    height: 52,
    borderRadius: 999,
    marginRight: 12
  },
  driverName: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  driverCar: {
    fontSize: 14,
    color: COLORS.grayscale700,
    fontFamily: "regular",
    marginTop: 6
  },
  driverRightContainer: {
    flexDirection: "column",
    alignItems: "flex-end"
  },
  driverRightReview: {
    flexDirection: "row",
    alignItems: "center"
  },
  starIcon: {
    height: 14,
    width: 14,
    tintColor: COLORS.primary,
    marginRight: 6
  },
  starNum: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: "regular"
  },
  taxiID: {
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: "medium",
    marginTop: 6
  },
  actionContainer: {
    flexDirection: "row",
    marginTop: 22
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    marginHorizontal: 12
  },
  actionIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black
  },
  locationItemContainer: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 12,
    alignItems: "center",
    justifyContent: "space-between"
  },
  locationIcon1: {
    height: 52,
    width: 52,
    borderRadius: 999,
    marginRight: 12,
    backgroundColor: "rgba(254, 187, 27, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  locationIcon2: {
    height: 36,
    width: 36,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  locationIcon3: {
    width: 16,
    height: 16,
    tintColor: COLORS.black
  },
  baseLocationName: {
    fontSize: 17,
    color: COLORS.greyscale900,
    fontFamily: "bold",
  },
  baseLocationAddress: {
    fontSize: 14,
    color: COLORS.greyScale800,
    fontFamily: "regular",
    marginTop: 8
  },
  arrowIconContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 12
  },
  arrowIcon: {
    height: 18,
    width: 18,
    tintColor: COLORS.black
  },
  locationDistance: {
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: "medium",
  },
  locationItemRow: {
    flexDirection: "row",
  }
})

export default SearchingDriver
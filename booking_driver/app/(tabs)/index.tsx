import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { COLORS, icons } from "@/constants";
import { activeBookings } from "@/data";
import { useTheme } from "@/theme/ThemeProvider";
import { useRouter } from "expo-router";
import Input from "@/components/Input";
import Button from "@/components/Button";

const ActiveBookings = () => {
  const { dark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const redirectToChat = (bookingId: string, driverName: string) => {
    router.push({
      pathname: "/chat",
      params: {
        bookingId,
        driverName,
      },
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
        },
      ]}
    >
      <View
        style={{
          marginVertical: 16,
          alignItems: "center",
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "800" }}>Find Customers</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Input
            placeholder="Search by booking ID or driver name"
            onChangeText={() => {}}
            onInputChanged={() => {}}
            style={{
              marginTop: 12,
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            }}
          />
          {/* <Button title="..." onPress={() => {}} /> */}
          {/* <TouchableOpacity>
            <Text style={{ fontSize: 30,  }}>...</Text>
          </TouchableOpacity> */}
          <TouchableOpacity>
            <Image
              source={icons.moreCircle}
              resizeMode="contain"
              style={[
                styles.moreIcon,
                {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={activeBookings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View
              style={[
                styles.cardContainer,
                {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                },
              ]}
            >
              {/* Driver infor */}
              <View style={styles.topCardContainer}>
                <View style={styles.topCardLeftContainer}>
                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => redirectToChat(item.id, item.name)}
                  >
                    <Image
                      source={item.avatar}
                      resizeMode="cover"
                      style={styles.avatar}
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text
                        style={[
                          styles.name,
                          {
                            color: dark
                              ? COLORS.secondaryWhite
                              : COLORS.greyscale900,
                          },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.taxi,
                          {
                            color: dark
                              ? COLORS.grayscale200
                              : COLORS.grayscale700,
                          },
                        ]}
                      >
                        Delhi - Pune
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.topCardRightContainer}>
                  <View style={[styles.statusContainer]}>
                    <TouchableOpacity
                      onPress={() => redirectToChat(item.id, item.name)}
                      style={{ alignItems: "center" }}
                    >
                      <Text style={styles.status}>Chat</Text>
                    </TouchableOpacity>
                  </View>
                  {/* <Text
                    style={[
                      styles.taxiID,
                      {
                        color: dark ? COLORS.white : COLORS.greyscale900,
                      },
                    ]}
                  >
                    {item.taxiID}
                  </Text> */}
                </View>
              </View>

              <View
                style={[
                  styles.separateLine,
                  {
                    backgroundColor: dark
                      ? COLORS.grayscale700
                      : COLORS.grayscale200,
                  },
                ]}
              />

              {isOpen && (
                <>
                  {/* Timing information for route */}
                  <View style={styles.routeContainer}>
                    <View style={styles.topRouteContainer}>
                      <View style={styles.routeIconContainer}>
                        <Image
                          source={icons.location2Outline}
                          resizeMode="contain"
                          style={styles.routeIcon}
                        />
                        <Text
                          style={[
                            styles.routeName,
                            {
                              color: dark ? COLORS.white : COLORS.greyscale900,
                            },
                          ]}
                        >
                          {item.distance}
                        </Text>
                      </View>
                      {/* <View style={styles.routeIconContainer}>
                        <Image
                          source={icons.clock}
                          resizeMode="contain"
                          style={styles.routeIcon}
                        />
                        <Text
                          style={[
                            styles.routeName,
                            {
                              color: dark ? COLORS.white : COLORS.greyscale900,
                            },
                          ]}
                        >
                          {item.duration}
                        </Text>
                      </View> */}
                      <View style={styles.routeIconContainer}>
                        <Image
                          source={icons.wallet2Outline}
                          resizeMode="contain"
                          style={styles.routeIcon}
                        />
                        <Text
                          style={[
                            styles.routeName,
                            {
                              color: dark ? COLORS.white : COLORS.greyscale900,
                            },
                          ]}
                        >
                          {item.price}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.bottomRouteContainer}>
                      <Text
                        style={[
                          styles.bottomRouteName,
                          {
                            color: dark ? COLORS.white : COLORS.greyscale900,
                          },
                        ]}
                      >
                        Date & Time
                      </Text>
                      <Text
                        style={[
                          styles.date,
                          {
                            color: dark ? COLORS.white : COLORS.greyscale900,
                          },
                        ]}
                      >
                        {item.date}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.separateLine,
                      {
                        backgroundColor: dark
                          ? COLORS.grayscale700
                          : COLORS.grayscale200,
                      },
                    ]}
                  />

                  {/* Location information for route */}
                  <View>
                    <View style={styles.locationItemContainer}>
                      <View style={styles.locationIcon1}>
                        <View style={styles.locationIcon2}>
                          <Image
                            source={icons.crosshair}
                            resizeMode="contain"
                            style={styles.locationIcon3}
                          />
                        </View>
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.baseLocationName,
                            {
                              color: dark ? COLORS.white : COLORS.greyscale900,
                            },
                          ]}
                        >
                          {item.baseLocationName}
                        </Text>
                        <Text
                          style={[
                            styles.baseLocationAddress,
                            {
                              color: dark ? COLORS.white : COLORS.greyScale800,
                            },
                          ]}
                        >
                          {item.baseLocationAddress}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.locationItemContainer}>
                      <View style={styles.locationIcon1}>
                        <View style={styles.locationIcon2}>
                          <Image
                            source={icons.location2}
                            resizeMode="contain"
                            style={styles.locationIcon3}
                          />
                        </View>
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.baseLocationName,
                            {
                              color: dark ? COLORS.white : COLORS.greyscale900,
                            },
                          ]}
                        >
                          {item.destinationLocationName}
                        </Text>
                        <Text
                          style={[
                            styles.baseLocationAddress,
                            {
                              color: dark ? COLORS.white : COLORS.greyScale800,
                            },
                          ]}
                        >
                          {item.destinationLocationAddress}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Location map for route */}
                  {/* <View style={[styles.locationMapContainer, {
                      backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                    }]}>
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
                            latitude: item.destinationLocationLat,
                            longitude: item.destinationLocationLong,
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
                    </View> */}

                  {/* <TouchableOpacity onPress={() => {}} style={styles.cancelBtn}>
                    <Text style={styles.cancelBtnText}>Cancel Booking</Text>
                  </TouchableOpacity> */}
                </>
              )}
              <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                style={styles.arrowIconContainer}
              >
                <Image
                  source={isOpen ? icons.arrowUp : icons.arrowDown}
                  resizeMode="contain"
                  style={[
                    styles.arrowIcon,
                    {
                      tintColor: dark ? COLORS.white : COLORS.greyscale900,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.tertiaryWhite,
    paddingHorizontal: 16,
  },
  cardContainer: {
    width: "100%",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 32,
    marginVertical: 18,
    alignSelf: "center",
  },
  topCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  topCardLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 999,
    marginRight: 12,
  },
  name: {
    fontFamily: "bold",
    fontSize: 16,
    color: COLORS.greyscale900,
    marginBottom: 8,
  },
  taxi: {
    fontFamily: "regular",
    fontSize: 12,
    color: COLORS.grayscale700,
  },
  topCardRightContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  statusContainer: {
    width: 54,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  status: {
    fontFamily: "regular",
    fontSize: 12,
    color: COLORS.black,
  },
  taxiID: {
    fontFamily: "semiBold",
    fontSize: 12,
    color: COLORS.greyscale900,
    marginTop: 6,
  },
  separateLine: {
    height: 1,
    backgroundColor: COLORS.grayscale200,
    width: "100%",
    marginTop: 12,
  },
  routeContainer: {},
  topRouteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12,
  },
  routeIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.grayscale400,
    marginRight: 8,
  },
  routeName: {
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: "semiBold",
  },
  bottomRouteContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 16,
  },
  bottomRouteName: {
    fontSize: 12,
    color: COLORS.greyscale900,
    fontFamily: "regular",
  },
  date: {
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: "semiBold",
  },
  locationItemContainer: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 12,
    alignItems: "center",
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
    tintColor: COLORS.black,
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
    marginTop: 8,
  },
  locationMapContainer: {
    height: 160,
    width: "100%",
    borderRadius: 12,
    marginVertical: 16,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.dark2,
  },
  viewMapContainer: {
    height: 50,
    backgroundColor: COLORS.gray,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: "auto",
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  cancelBtn: {
    width: "100%",
    height: 42,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    marginTop: 6,
  },
  cancelBtnText: {
    color: COLORS.greyscale900,
    fontFamily: "semiBold",
    fontSize: 16,
  },
  arrowIconContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 12,
  },
  arrowIcon: {
    height: 18,
    width: 18,
    tintColor: COLORS.black,
  },
});

export default ActiveBookings;

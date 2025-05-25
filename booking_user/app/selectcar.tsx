import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import CarItem from '../components/CarItem';
import { Feather } from "@expo/vector-icons";
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';

const SelectCar = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedItem, setSelectedItem] = useState(null);
  const { colors, dark } = useTheme();

  // handle checkbox
  const handleCheckboxPress = (itemTitle:any) => {
    if (selectedItem === itemTitle) {
      // If the clicked item is already selected, deselect it
      setSelectedItem(null);
    } else {
      // Otherwise, select the clicked item
      setSelectedItem(itemTitle);
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Select Car" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.subtitle, {
            color: dark ? COLORS.white : COLORS.secondaryWhite
          }]}>Select the vehicle you want to ride.</Text>
          <View style={{
            backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite
          }}>
            <CarItem
              checked={selectedItem === 'Bike'}
              onPress={() => handleCheckboxPress('Bike')}
              title="Bike"
              description="7 nearbies"
              icon={icons.motorcycle}
              price="$10"
            />
            <CarItem
              checked={selectedItem === 'Standard'}
              onPress={() => handleCheckboxPress('Standard')}
              title="Standard"
              description="12 nearbies"
              icon={icons.car2}
              price="$20"
            />
            <CarItem
              checked={selectedItem === 'Premium'}
              onPress={() => handleCheckboxPress('Premium')}
              title="Premium"
              description="4 nearbies"
              icon={icons.car2}
              price="$30"
            />
            <View style={styles.separateLine} />
          </View>
          <Text style={[styles.promoTitle, {
            color: dark ? COLORS.white : COLORS.secondaryWhite
          }]}>Promo Code</Text>
          <View style={styles.promoCodeContainer}>
            <TextInput
              placeholder='Enter your promo code'
              placeholderTextColor={COLORS.grayscale700}
              style={[styles.promoCodeInput, {
                backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
              }]}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("addpromo")}
              style={styles.plusIconContainer}>
              <Feather name="plus" size={20} color={dark ? COLORS.white : "black"} />
            </TouchableOpacity>
          </View>
          <View style={[styles.separateLine, { marginVertical: 32 }]} />
          <View style={styles.topRouteContainer}>
            <View style={styles.routeIconContainer}>
              <Image
                source={icons.location2Outline}
                resizeMode='contain'
                style={styles.routeIcon}
              />
              <Text style={[styles.routeName, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>4.5 Km</Text>
            </View>
            <View style={styles.routeIconContainer}>
              <Image
                source={icons.clock}
                resizeMode='contain'
                style={styles.routeIcon}
              />
              <Text style={[styles.routeName, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>4 mins</Text>
            </View>
            <View style={styles.routeIconContainer}>
              <Image
                source={icons.wallet2Outline}
                resizeMode='contain'
                style={styles.routeIcon}
              />
              <Text style={[styles.routeName, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>$20.00</Text>
            </View>
          </View>
        </ScrollView>
        <Button
          title="Continue"
          filled
          style={{ marginTop: 12 }}
          onPress={() => navigation.navigate("paymentmethods")}
        />
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
    padding: 16
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "regular",
    color: COLORS.black,
    marginVertical: 12
  },
  separateLine: {
    height: .4,
    width: SIZES.width - 32,
    backgroundColor: COLORS.greyscale300,
    marginVertical: 12
  },
  promoTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginVertical: 12
  },
  promoCodeContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  promoCodeInput: {
    height: 52,
    width: SIZES.width - 96,
    backgroundColor: COLORS.tertiaryWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: "regular"
  },
  plusIconContainer: {
    height: 52,
    width: 52,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center"
  },
  topRouteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 74,
    marginTop: 12,
    marginHorizontal: 26
  },
  routeIconContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  routeIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.grayscale400,
    marginRight: 8
  },
  routeName: {
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: "semiBold",
  },
})

export default SelectCar
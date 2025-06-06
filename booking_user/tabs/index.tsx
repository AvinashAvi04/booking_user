import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants";
import OneWayForm from "@/components/BookingForms/OneWayForm";
import RoundTripForm from "@/components/BookingForms/RoundTripForm";
const BookingTabs = () => {
  const [activeTab, setActiveTab] = useState("oneWay");

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "oneWay" && styles.activeTab]}
          onPress={() => setActiveTab("oneWay")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "oneWay" && styles.activeTabText,
            ]}
          >
            One Way
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "roundTrip" && styles.activeTab]}
          onPress={() => setActiveTab("roundTrip")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "roundTrip" && styles.activeTabText,
            ]}
          >
            Round Trip
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "oneWay" ? <OneWayForm /> : <RoundTripForm />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  tabContainer: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.h4,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.white,
  },
});

export default BookingTabs;

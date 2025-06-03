import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal as RNModal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { SIZES, FONTS, COLORS } from "../../constants/theme";
import {
  OneWayForm,
  RoundTripForm,
  LocalForm,
  AirportForm,
} from "../../components/BookingForms";
import { useTheme } from "@/theme/ThemeProvider";
import Button from "../../components/Button";
import Input from "@/components/Input";
import { useRouter, useLocalSearchParams } from "expo-router";
import { icons } from "@/constants";

type ThemeColors = {
  primary: string;
  text: string;
  background: string;
  card?: string;
  border?: string;
  textSecondary?: string;
};

type TabType = "oneWay" | "roundTrip" | "local" | "airport";

const BookingForm = () => {
  const { userType, isSignup, phone, email } = useLocalSearchParams();
  const isFirstTimeUser = isSignup === "true";
  const [activeTab, setActiveTab] = useState<TabType>("oneWay");
  const [showWelcomeModal, setShowWelcomeModal] =
    useState<boolean>(isFirstTimeUser);
  const [userName, setUserName] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const { colors } = useTheme() as { colors: ThemeColors };
  const styles = createStyles(colors);

  const handleWelcomeSubmit = () => {
    if (!userName.trim() || (email ? !userPhone.trim() : !userEmail.trim())) {
      Alert.alert(
        "Required Fields Missing",
        `Please enter your ${!userName.trim() ? "name" : ""}${
          !userName.trim() && (email ? !userPhone.trim() : !userEmail.trim())
            ? " and "
            : ""
        }${
          email
            ? !userPhone.trim()
              ? "phone number"
              : ""
            : !userEmail.trim()
            ? "email"
            : ""
        } to continue`
      );
      return;
    }
    setShowWelcomeModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "oneWay":
        return (
          <View style={styles.tabContent}>
            <OneWayForm />
          </View>
        );
      case "roundTrip":
        return (
          <View style={styles.tabContent}>
            <RoundTripForm />
          </View>
        );
      case "local":
        return (
          <View style={styles.tabContent}>
            <LocalForm />
          </View>
        );
      case "airport":
        return (
          <View style={styles.tabContent}>
            <AirportForm />
          </View>
        );
      default:
        return null;
    }
  };

  const TabButton = ({
    label,
    isActive,
    onPress,
  }: {
    label: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderWelcomeModal = () => (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={showWelcomeModal}
      onRequestClose={() => {
        // Prevent closing with back button on Android
        return true;
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent]}>
          <MaterialIcons
            name="account-circle"
            size={48}
            color={colors.primary}
            style={styles.icon}
          />

          <Text style={[styles.modalTitle, styles.titleWithIcon]}>
            Welcome to Our App! 👋
          </Text>

          <View style={styles.contentContainer}>
            <Text style={styles.modalSubtitle}>
              We're excited to have you on board. Please tell us your name to
              get started.
            </Text>
            <Input
              id="userName"
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary || colors.text}
              value={userName}
              onInputChanged={(id, text) => setUserName(text)}
              autoFocus
              style={styles.input}
              icon={icons.user}
            />
            <Input
              id={email ? "phone" : "email"}
              placeholder={
                email ? "Enter your phone number" : "Enter your email"
              }
              placeholderTextColor={colors.textSecondary || colors.text}
              value={email ? userPhone : userEmail}
              onInputChanged={(id, text) => {
                if (email) {
                  setUserPhone(text);
                } else {
                  setUserEmail(text);
                }
              }}
              autoFocus
              style={styles.input}
              keyboardType={email ? "phone-pad" : "email-address"}
              autoCapitalize="none"
              icon={email ? icons.call : icons.email}
            />
          </View>

          <Button
            title="Continue"
            onPress={handleWelcomeSubmit}
            style={styles.submitButton}
            filled
            textColor="white"
          />
        </View>
      </View>
    </RNModal>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {renderWelcomeModal()}
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Book a Ride</Text>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollView}
          >
            <TabButton
              label="One Way"
              isActive={activeTab === "oneWay"}
              onPress={() => setActiveTab("oneWay")}
            />
            <TabButton
              label="Round Trip"
              isActive={activeTab === "roundTrip"}
              onPress={() => setActiveTab("roundTrip")}
            />
            <TabButton
              label="Local"
              isActive={activeTab === "local"}
              onPress={() => setActiveTab("local")}
            />
            <TabButton
              label="Airport"
              isActive={activeTab === "airport"}
              onPress={() => setActiveTab("airport")}
            />
          </ScrollView>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            style={styles.contentContainer}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          >
            {renderTabContent()}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // Modal styles
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      padding: SIZES.padding,
    },
    modalContent: {
      width: "100%",
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      alignItems: "center",
      backgroundColor: COLORS.white,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    icon: {
      marginBottom: SIZES.padding,
    },
    titleWithIcon: {
      marginTop: SIZES.padding,
    },
    modalTitle: {
      ...FONTS.h2,
      marginBottom: SIZES.padding,
      textAlign: "center",
      color: COLORS.black,
    },
    modalSubtitle: {
      ...FONTS.body4,
      textAlign: "center",
      color: COLORS.grayscale700,
      marginBottom: SIZES.padding,
      lineHeight: 22,
    },
    submitButton: {
      width: "100%",
      marginTop: SIZES.padding2,
    },

    inputContainer: {
      width: "100%",
      marginBottom: SIZES.padding * 1.5,
      padding: SIZES.padding2,
    },
    input: {
      height: 52,
      borderWidth: 1,
      borderRadius: SIZES.radius,
      paddingHorizontal: 30,
      borderColor: COLORS.greyscale300,
      backgroundColor: COLORS.white,
      ...FONTS.body4,
    },
    continueButton: {
      width: "100%",
      height: 50,
      borderRadius: SIZES.radius,
      backgroundColor: COLORS.primary,
      marginTop: SIZES.padding,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background || COLORS.white,
      paddingBottom: 80, // Add bottom padding to account for tab bar
    },
    header: {
      padding: SIZES.padding3,
      borderBottomWidth: 0.5,
      backgroundColor: colors.card || colors.background,
      borderBottomColor: colors.border || "#e0e0e0",
    },
    headerTitle: {
      ...FONTS.h2,
      textAlign: "center",
      color: colors.text,
    },
    tabsContainer: {
      backgroundColor: colors.card || colors.background,
    },
    tabsScrollView: {
      paddingHorizontal: SIZES.padding2,
    },
    tabButton: {
      paddingVertical: SIZES.padding2,
      paddingHorizontal: SIZES.padding3,
      marginRight: SIZES.padding,
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    activeTabButton: {
      borderBottomColor: colors.primary,
    },
    tabButtonText: {
      ...FONTS.body3,
      color: colors.textSecondary || colors.text,
    },
    activeTabButtonText: {
      color: colors.primary,
      fontFamily: "bold",
    },
    contentContainer: {
      // flex: 1,
      paddingHorizontal: SIZES.padding2,
      backgroundColor: colors.background,
      width: "100%",
    },
    tabContent: {
      paddingVertical: SIZES.padding3,
    },
    tabTitle: {
      ...FONTS.h3,
      color: colors.text,
      marginBottom: SIZES.padding3,
    },
  });

export default BookingForm;

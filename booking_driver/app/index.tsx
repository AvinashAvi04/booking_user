import React, { useEffect } from "react";
import {
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, images } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const Onboarding1 = () => {
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/(tabs)");
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ImageBackground source={images.splashOnboarding} style={styles.area}>
      <LinearGradient
        // Background linear gradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.background}
      >
        <Text style={styles.greetingText}>Welcome to 👋</Text>
        <View style={styles.logoContainer}>
          <Text style={styles.logoName}>Rahiseva</Text>
          <Text style={styles.logoText}>Driver</Text>
        </View>
        <Text style={styles.subtitle}>
          The best cab booking app of the century to make your day great!
        </Text>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  background: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 270,
    paddingHorizontal: 16,
  },
  greetingText: {
    fontSize: 40,
    color: COLORS.white,
    fontFamily: "bold",
    marginVertical: 12,
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  logoName: {
    fontSize: 76,
    color: COLORS.primary,
    fontFamily: "extraBold",
    textAlign: 'left',
  },
  logoText: {
    fontSize: 18,
    color: COLORS.primary,
    fontFamily: 'bold',
    textAlign: 'left',
    marginTop: -10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginVertical: 14,
    fontFamily: "semiBold",
  },
});

export default Onboarding1;

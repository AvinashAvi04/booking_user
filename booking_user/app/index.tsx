import React, { useEffect } from "react";
import {
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS, images } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const Onboarding1 = () => {
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/phonelogin");
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);
  // Run only once after component mounts

  return (
    <ImageBackground source={images.splashOnboarding} style={styles.area}>
      <LinearGradient
        // Background linear gradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.background}
      >
        <Text style={styles.greetingText}>Welcome to 👋</Text>
        <Text style={styles.logoName}>Rahiseva</Text>
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
    // marginVertical: 12,
  },
  logoName: {
    fontSize: 76,
    color: COLORS.primary,
    fontFamily: "extraBold",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginVertical: 16,
    fontFamily: "semiBold",
  },
});

export default Onboarding1;

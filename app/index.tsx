import React, { useEffect } from "react";
import {
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS, images } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";

type Nav = {
  navigate: (value: string) => void;
};

const Onboarding1 = () => {
  const { navigate } = useNavigation<Nav>();
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     navigate("login");
  //   }, 2000);

  //   return () => clearTimeout(timeout);
  // }, []); // Run only once after component mounts

  return (
    <ImageBackground source={images.splashOnboarding} style={styles.area}>
      <LinearGradient
        // Background linear gradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.background}
      >
        <Text style={styles.greetingText}>Welcome to 👋</Text>
        <Text style={styles.logoName}>Taxio</Text>
        <Text style={styles.subtitle}>
          The best taxi booking app of the century to make your day great!
        </Text>
        <TouchableOpacity
          style={{ position: "absolute", bottom: 20, right: 20 }}
          onPress={() => navigate("login")}
        >
          <Text style={{ color: COLORS.white, fontSize: 16 }}>Go To Login</Text>
        </TouchableOpacity>
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
  logoName: {
    fontSize: 76,
    color: COLORS.primary,
    fontFamily: "extraBold",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginVertical: 12,
    fontFamily: "semiBold",
  },
});

export default Onboarding1;

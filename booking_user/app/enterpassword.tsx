import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS, SIZES, FONTS, icons } from "../constants";
import Input from "../components/Input";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";

const EnterPassword = () => {
  const params = useLocalSearchParams();
  
  const phone = params.phone || '';
  const existingUser = params.existingUser === "true";
  const router = useRouter();
  const { dark } = useTheme();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string[];
    confirmPassword?: string[];
  }>({});

  const validateForm = () => {
    const newErrors: { password?: string[]; confirmPassword?: string[] } = {};

    if (!password) {
      newErrors.password = ["Password is required"];
    } else if (password.length < 6) {
      newErrors.password = ["Password must be at least 6 characters"];
    }

    if (existingUser) {
      if (!confirmPassword) {
        newErrors.confirmPassword = ["Please confirm your password"];
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = ["Passwords do not match"];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // For both signup and login, navigate to OTP verification
      console.log(existingUser ? "Sign up with:" : "Log in with:", { phone, password });
      
      router.push({
        pathname: "/otpverification",
        params: {
          phone: phone,
          password: password,
          existingUser: existingUser ? "true" : "false"
        }
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text
            style={[FONTS.h1, { color: dark ? COLORS.white : COLORS.black }]}
          >
            {existingUser ? "Create Password" : "Welcome Back!"}
          </Text>
          <Text style={[styles.subtitle, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
            {existingUser
              ? `Create a password to secure your account for ${phone}`
              : `Welcome back! Please enter your password for ${phone}. You'll receive an OTP to verify.`}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            id="password"
            placeholder="Password"
            secureTextEntry
            value={password}
            onInputChanged={(id, text) => setPassword(text)}
            errorText={errors.password}
            placeholderTextColor={dark ? COLORS.gray : COLORS.gray2}
            icon={icons.padlock}
            autoCapitalize="none"
          />

          {existingUser && (
            <Input
              id="confirmPassword"
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onInputChanged={(id, text) => setConfirmPassword(text)}
              errorText={errors.confirmPassword}
              placeholderTextColor={dark ? COLORS.gray : COLORS.gray2}
              icon={icons.padlock}
              autoCapitalize="none"
              style={{ marginTop: SIZES.padding2 }}
            />
          )}

          <Button
            title={existingUser ? "Create Account" : "Sign In"}
            onPress={handleSubmit}
            filled
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding3,
    paddingTop: SIZES.padding3 * 2,
  },
  header: {
    marginBottom: SIZES.padding3 * 2,
  },
  subtitle: {
    ...FONTS.body4,
    marginTop: SIZES.padding,
  },
  form: {
    marginBottom: SIZES.padding3,
  },
  button: {
    width: "100%",
    marginTop: SIZES.padding3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SIZES.padding3,
  },
  footerText: {
    ...FONTS.body4,
  },
  footerLink: {
    ...FONTS.body4,
    fontWeight: "600",
  },
});

export default EnterPassword;

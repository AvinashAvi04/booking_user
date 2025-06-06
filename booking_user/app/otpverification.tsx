import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useReducer, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { COLORS } from "../constants";
import { OtpInput } from "react-native-otp-entry";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import { reducer } from "@/utils/reducers/formReducers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  inputValues: {
    mobile: "",
    password: "",
  },
  inputValidities: {
    mobile: false,
    password: false,
  },
  formIsValid: false,
};

const OTPVerification = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [time, setTime] = useState(50);
  const { colors, dark } = useTheme();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleVerify = async () => {
    if (!otp || otp.length !== 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setError("");
    try {
      console.log("Sending OTP verification request with:", {
        phone_number: params.phone,
        otp_code: otp,
        user_type: "user",
      });

      const response = await axios.post(
        REACT_APP_BASE_URL + "/api/v1/users/auth/verify-otp/",
        {
          phone_number: params.phone,
          otp_code: otp,
          user_type: "user",
        }
      );

      console.log("Server response status:", response.status);
      console.log("Server response data:", response.data);

      if (response.status === 200) {
        try {
          // Store tokens in AsyncStorage
          await AsyncStorage.setItem("accessToken", response.data.access);
          await AsyncStorage.setItem("refreshToken", response.data.refresh);

          console.log("Tokens stored successfully");
          router.replace({ pathname: "/(tabs)", params: params });
        } catch (storageError) {
          console.error("Storage error:", storageError);
          setError("Failed to store authentication tokens");
        }
      }
    } catch (error: any) {
      console.error("Error message:", error.message);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="OTP Verification" />
        <ScrollView>
          <Text
            style={[
              styles.title,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Code has been send to {params.phone}
          </Text>
          <OtpInput
            numberOfDigits={4}
            onTextChange={(text) => {
              setOtp(text);
              setError("");
            }}
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={500}
            onFilled={(text) => {
              setOtp(text);
              setError("");
            }}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                borderColor: error
                  ? COLORS.error
                  : dark
                  ? COLORS.gray
                  : COLORS.secondaryWhite,
                borderWidth: 0.4,
                borderRadius: 10,
                height: 58,
                width: 58,
              },
              pinCodeTextStyle: {
                color: dark ? COLORS.white : COLORS.black,
              },
            }}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.codeContainer}>
            <TouchableOpacity
              disabled={time > 0}
              style={{ padding: 8, paddingRight: 0 }}
              onPress={() => {
                if (time === 0) setTime(50);
              }}
            >
              <Text
                style={[
                  styles.code,
                  {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                  },
                ]}
              >
                Resend code in
              </Text>
            </TouchableOpacity>
            <Text style={styles.time}>{`  ${time} `}</Text>
            <Text
              style={[
                styles.code,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              s
            </Text>
          </View>
        </ScrollView>
        <Button
          title="Verify"
          filled
          style={styles.button}
          onPress={() => handleVerify()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 54,
  },
  OTPStyle: {
    borderRadius: 8,
    height: 58,
    width: 58,
    backgroundColor: COLORS.white,
    borderBottomColor: "gray",
    borderBottomWidth: 0.4,
    borderWidth: 0.4,
    borderColor: "gray",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "center",
  },
  code: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center",
  },
  time: {
    fontFamily: "medium",
    fontSize: 18,
    color: COLORS.primary,
  },
  button: {
    borderRadius: 32,
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
    fontFamily: "regular",
    fontSize: 14,
  },
});

export default OTPVerification;

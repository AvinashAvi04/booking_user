import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { COLORS } from "../constants";
import { OtpInput } from "react-native-otp-entry";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OTPVerification = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [time, setTime] = useState(50);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const { colors, dark } = useTheme();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 1. Verify OTP
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/api/v1/user/auth/verify-otp/`,
        {
          phone_number: params.phone,
          otp_code: otp,
          user_type: "driver",
        }
      );

      // 2. Get token from response
      const token = response.data.access || response.data.token;
      if (!token) {
        throw new Error("No token received");
      }

      // 3. Save token to AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      
      try {
        // 4. Fetch user details with the token
        const userResponse = await axios.get(
          `${REACT_APP_BASE_URL}/api/v1/user/me/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // 5. Navigate to edit profile for existing user
        router.push({
          pathname: "/(tabs)",
          params: {
            ...params,
            ...userResponse.data,
            token: token,
            isSignUp: "false",
          },
        });
      } catch (userError) {
        console.error("Error fetching user details:", userError);
        setError("Failed to load user details. Please try again.");
      }
    } catch (error: unknown) {
      console.error("OTP verification failed:", error);
      
      // Type guard to check if error is an object and has response property
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as {
          response?: {
            data?: {
              detail?: string;
            };
          };
        };
        
        if (apiError.response?.data?.detail === "User not found") {
          // Navigate to edit profile for new user
          router.push({
            pathname: "/(tabs)",
            params: { 
              ...params, 
              isSignUp: "true",
              phone: params.phone,
            },
          });
        } else {
          setError("Invalid OTP. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (time > 0) return;
    
    axios
      .post(REACT_APP_BASE_URL + "/api/v1/user/auth/send-otp/", {
        phone_number: params.phone,
        user_type: "user",
      })
      .then(() => {
        setTime(50);
        setError("");
      })
      .catch((error) => {
        console.error("Failed to resend OTP:", error);
        setError("Failed to resend OTP. Please try again.");
      });
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
            Code has been sent to {params.phone}
          </Text>
          <OtpInput
            numberOfDigits={4}
            onTextChange={setOtp}
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={500}
            onFilled={handleVerifyOTP}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                borderColor: error ? COLORS.red : (dark ? COLORS.gray : COLORS.secondaryWhite),
                borderWidth: error ? 1 : 0.4,
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
              onPress={handleResendOTP}
            >
              <Text
                style={[
                  styles.code,
                  {
                    color: time > 0 
                      ? (dark ? COLORS.gray : COLORS.greyscale500)
                      : COLORS.primary,
                  },
                ]}
              >
                {time > 0 ? 'Resend code in' : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
            {time > 0 && (
              <>
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
              </>
            )}
          </View>
        </ScrollView>
        <Button
          title={isLoading ? "Verifying..." : "Verify"}
          filled
          style={[styles.button, (isLoading || otp.length !== 4) && { opacity: 0.7 }]}
          onPress={handleVerifyOTP}
          disabled={isLoading || otp.length !== 4}
        />
        {isLoading && (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        )}
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
    opacity: 1,
  },
  errorText: {
    color: COLORS.red,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'regular',
  },
  loader: {
    marginTop: 16,
  },
});

export default OTPVerification;

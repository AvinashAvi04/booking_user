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

const isTestMode = true;
const initialState = {
  inputValues: {
    mobile: isTestMode ? "9999999999" : "",
    password: isTestMode ? "**********" : "",
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

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleVerify = () => {
    axios
      .post(REACT_APP_BASE_URL + "/api/v1/user/auth/verify-otp/", {
        phone_number: formState.inputValues.mobile,
        otp_code: "1234", // Replace with actual OTP input
        user_type: "user",
      })
      .then((response) => {
        console.log("OTP verified successfully:", response.data);
        // router.push({ pathname: "/(tabs)", params: params });
      })
      .catch((error) => {
        // console.error("Error sending OTP:", error);
        Alert.alert("Please try again.");
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
            Code has been send to {params.phone}
          </Text>
          <OtpInput
            numberOfDigits={4}
            onTextChange={(text) => console.log(text)}
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={500}
            onFilled={(text) => console.log(`OTP is ${text}`)}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                borderColor: dark ? COLORS.gray : COLORS.secondaryWhite,
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
});

export default OTPVerification;

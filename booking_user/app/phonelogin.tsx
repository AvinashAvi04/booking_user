import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, icons, images } from "../constants";
import Header from "../components/Header";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import Input from "../components/Input";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import SocialButton from "../components/SocialButton";
import OrSeparator from "../components/OrSeparator";
import { useTheme } from "../theme/ThemeProvider";
import { useNavigation, useRouter } from "expo-router";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";

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

type Nav = {
  navigate: (value: string) => void;
};

const Login = () => {
  const router = useRouter();
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const { colors, dark } = useTheme();
  const [mobileTouched, setMobileTouched] = useState(false);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      if (inputId === "mobile" && !mobileTouched) setMobileTouched(true);
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState, mobileTouched]
  );

  useEffect(() => {
    console.log("Form State Updated:", formState.inputValues.mobile);
  }, [formState]);

  // Error handling is now silent
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  // Implementing apple authentication
  const appleAuthHandler = () => {
    console.log("Apple Authentication");
  };

  // Implementing facebook authentication
  const facebookAuthHandler = () => {
    console.log("Facebook Authentication");
  };

  // Implementing google authentication
  const googleAuthHandler = () => {
    console.log("Google Authentication");
  };

  useEffect(() => {
    dispatchFormState({
      inputId: "mobile",
      inputValue: "",
      validationResult: validateInput("mobile", ""),
    });
  }, []);

  const isMobileValid = useCallback(() => {
    const mobile = formState.inputValues.mobile;
    return mobile && /^\d{10}$/.test(mobile);
  }, [formState.inputValues.mobile]);

  const handleLogin = () => {
    console.log("Login Button Pressed", REACT_APP_BASE_URL);
    Keyboard.dismiss();

    if (!isMobileValid()) return;

    axios
      .post(REACT_APP_BASE_URL + "/api/v1/users/auth/send-otp/", {
        phone_number: formState.inputValues.mobile,
        user_type: "user",
      })
      .then((response) => {
        // Optionally check response status or content
        // console.log("OTP sent:", response.data.detail);
        if (response.status == 200) {
          router.replace({
            pathname: "/otpverification",
            params: {
              userType: "user",
              isSignup: "true",
              phone: formState.inputValues.mobile,
              email: null,
            },
          });
        } else {
          Alert.alert("Login Failed", "Unable to send OTP. Please try again.");
        }
      })
      .catch((error) => {
        // console.error("Error sending OTP:", error);
        Alert.alert("Login Failed", "Unable to send OTP. Please try again.");
      });
  };

  return (
    <SafeAreaView
      style={[
        styles.area,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        {/* <Header title="" /> */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
          <Text
            style={[
              styles.title,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Login to Your Account
          </Text>
          <Input
            id="mobile"
            onInputChanged={inputChangedHandler}
            errorText={
              mobileTouched ? formState.inputValidities.mobile : undefined
            }
            placeholder="Enter Your 10 Digit Mobile Number..."
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.telephone}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <Button
            title="Login"
            filled
            onPress={handleLogin}
            style={[styles.button, !isMobileValid() && { opacity: 0.7 }]}
            disabled={!isMobileValid()}
          />
        </ScrollView>
        <TouchableOpacity
          onPress={() => router.replace("/emaillogin")}
          style={{ alignSelf: "center", marginBottom: 8 }}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 18,
              fontFamily: "medium",
              textDecorationLine: "underline",
            }}
          >
            Login using Email
          </Text>
        </TouchableOpacity>
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
  logo: {
    width: 100,
    height: 100,
    tintColor: COLORS.primary,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontFamily: "semiBold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 22,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 18,
  },
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
    borderRadius: 4,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  privacy: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.black,
  },
  socialTitle: {
    fontSize: 19.25,
    fontFamily: "medium",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 26,
  },
  socialBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
    position: "absolute",
    bottom: 12,
    right: 0,
    left: 0,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "regular",
    color: "black",
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
  },
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 12,
  },
});

export default Login;

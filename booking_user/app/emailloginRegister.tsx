import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, icons, images } from "../constants";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import Input from "../components/Input";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";

const initialState = {
  inputValues: {
    email: "",
    password: "",
  },
  inputValidities: {
    email: undefined,
    password: undefined,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string) => void;
};

const EmailLogin = () => {
  const router = useRouter();
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const { colors, dark } = useTheme();

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
      // Clear errors when user types
      if (inputId === "email") setEmailError("");
      if (inputId === "password") setPasswordError("");
    },
    [dispatchFormState]
  );

  // const params = useLocalSearchParams();
  // useEffect(() => {
  //   if (params.email) {
  //     dispatchFormState({
  //       inputId: "email",
  //       inputValue: params.email as string,
  //       validationResult: true,
  //     });
  //   }
  // }, [params.email]);

  const isEmailValid = () => {
    return (
      !formState.inputValidities.email && formState.inputValues.email.length > 0
    );
  };

  const isPasswordValid = () => {
    return (
      !formState.inputValidities.password &&
      formState.inputValues.password.length > 0
    );
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!formState.formIsValid) return;

    // Reset errors
    setEmailError("");
    setPasswordError("");

    try {
      const response = await axios.post(
        `${REACT_APP_BASE_URL}/api/v1/users/auth/token/`,
        {
          email: formState.inputValues.email,
          password: formState.inputValues.password,
          // user_type: "user",
        }
      );

      if (response.status === 200) {
        // Store the access token
        await AsyncStorage.setItem("accessToken", response.data.access);

        // Navigate to the home screen
        router.replace({
          pathname: "/(tabs)",
        });
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.email) {
          setEmailError(
            Array.isArray(errorData.email)
              ? errorData.email[0]
              : errorData.email
          );
        }
        if (errorData.password) {
          setPasswordError(
            Array.isArray(errorData.password)
              ? errorData.password[0]
              : errorData.password
          );
        }
        if (errorData.detail) {
          setEmailError(errorData.detail);
          setPasswordError(errorData.detail);
        }
      } else {
        setEmailError("Invalid email or password");
        setPasswordError("Invalid email or password");
      }
    }
  };

  // router.replace({pathname:"/(tabs)", params:{userType: "user", isSignup: "true", phone: null, email: formState.inputValues.email}}); // or navigate to the home screen
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
            Login to your Account
          </Text>
          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={
              emailError ? [emailError] : formState.inputValidities.email
            }
            placeholder="Enter Your Email..."
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            id="password"
            onInputChanged={inputChangedHandler}
            errorText={
              passwordError
                ? [passwordError]
                : formState.inputValidities.password
            }
            placeholder="Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
            autoCapitalize="none"
          />
          <Button
            title="Login"
            filled
            onPress={handleLogin}
            style={[styles.button, !formState.formIsValid && { opacity: 0.7 }]}
            disabled={!formState.formIsValid}
          />
          <View style={styles.bottomLinksContainer}>
            <TouchableOpacity onPress={() => navigate("forgotpasswordmethods")}>
              <Text style={styles.forgotPasswordBtnText}>
                Forgot the password?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/emaillogin")}>
              <Text style={styles.forgotPasswordBtnText}>
                Don't have an account?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => router.push("/phonelogin")}
          style={{ alignSelf: "center", marginBottom: 24 }}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 18,
              fontFamily: "medium",
              textDecorationLine: "underline",
            }}
          >
            Login using Phone Number
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
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
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
  bottomLinksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  forgotPasswordBtnText: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: COLORS.primary,
  },
});

export default EmailLogin;

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, icons, images } from "../constants";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import Input from "../components/Input";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

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

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const appleAuthHandler = () => {
    console.log("Apple Authentication");
  };

  const facebookAuthHandler = () => {
    console.log("Facebook Authentication");
  };

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
    Keyboard.dismiss();
    if (!isMobileValid()) return;
    router.push({ pathname: "/otpverification", params: { userType: "driver", phone: formState.inputValues.mobile, email: null, isSignUp: "true" } });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView
        style={[
          styles.area,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 60 }]} // Added padding to avoid overlap
          >
            <View
              style={[
                styles.container,
                {
                  backgroundColor: colors.background,
                },
              ]}
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {/* Fixed bottom container */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => router.replace("/emaillogin")}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    zIndex: 1000, // High zIndex to ensure it stays on top
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
});

export default Login;
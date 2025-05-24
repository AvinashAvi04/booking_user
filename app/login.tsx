import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
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

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    console.log("Form State Updated:", formState.inputValues.mobile);
  }, [formState]);

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error);
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
        <Header title="" />
        <ScrollView showsVerticalScrollIndicator={false}>
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
            errorText={formState.inputValidities["mobile"]}
            placeholder="Enter Your 10 Digit Mobile Number..."
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.telephone}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {/* <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities["password"]}
            autoCapitalize="none"
            id="password"
            placeholder="Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          /> */}
          {/* <View style={styles.checkBoxContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                color={isChecked ? COLORS.primary : dark ? COLORS.primary : "gray"}
                                onValueChange={setChecked}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.privacy, {
                                    color: dark ? COLORS.white : COLORS.black
                                }]}>Remenber me</Text>
                            </View>
                        </View>
                    </View> */}
          <Button
            title="Login"
            filled
            onPress={() => {
              const mobile = formState.inputValues.mobile;
              if (/^\d{10}$/.test(mobile)) {
                router.push("/enterpassword");
              }
              //   else {
              //     Alert.alert(
              //       "Invalid Mobile Number",
              //       "Please enter a valid 10 digit mobile number."
              //     );
              //   }
            }}
            style={styles.button}
          />
          {/* <TouchableOpacity onPress={() => navigate("forgotpasswordmethods")}>
            <Text style={styles.forgotPasswordBtnText}>
              Forgot the password?
            </Text>
          </TouchableOpacity> */}
          {/* <View>
            <OrSeparator text="or continue with" />
            <View style={styles.socialBtnContainer}>
              <SocialButton
                icon={icons.appleLogo}
                onPress={appleAuthHandler}
                tintColor={dark ? COLORS.white : COLORS.black}
              />
              <SocialButton
                icon={icons.facebook}
                onPress={facebookAuthHandler}
              />
              <SocialButton icon={icons.google} onPress={googleAuthHandler} />
            </View>
          </View> */}
        </ScrollView>
        {/* <View style={styles.bottomContainer}>
          <Text
            style={[
              styles.bottomLeft,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Don't have an account ?
          </Text>
          <TouchableOpacity onPress={() => navigate("signup")}>
            <Text style={styles.bottomRight}>{"  "}Sign Up</Text>
          </TouchableOpacity>
        </View> */}
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

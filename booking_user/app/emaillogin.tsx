import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation, useRouter } from 'expo-router';

const initialState = {
  inputValues: {
    email: '',
    password: '',
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
    if (error) {
      console.error(error);
    }
  }, [error]);

  const isEmailValid = () => {
    return !formState.inputValidities.email && formState.inputValues.email.length > 0;
  };

  const isPasswordValid = () => {
    return !formState.inputValidities.password && formState.inputValues.password.length > 0;
  };

  const handleLogin = () => {
    Keyboard.dismiss();
    if (!formState.formIsValid) return;
    // Implement your login logic here
    router.push('/(tabs)'); // or navigate to the home screen
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
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image source={images.logo} resizeMode="contain" style={styles.logo} />
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
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.email}
            placeholder="Enter Your Email..."
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            id="password"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.password}
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
          <TouchableOpacity onPress={() => navigate('forgotpasswordmethods')}>
            <Text style={styles.forgotPasswordBtnText}>Forgot the password?</Text>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity onPress={() => router.push('/phonelogin')} style={{ alignSelf: 'center', marginBottom: 24 }}>
          <Text style={{ color: COLORS.primary, fontSize: 18, fontFamily: 'medium', textDecorationLine: 'underline' }}>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontFamily: 'semiBold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 22,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
    position: 'absolute',
    bottom: 12,
    right: 0,
    left: 0,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: 'regular',
    color: 'black',
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.primary,
  },
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default EmailLogin;
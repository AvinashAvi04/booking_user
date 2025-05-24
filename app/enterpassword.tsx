import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES, FONTS } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';

type PasswordScreenProps = {
  isSignUp?: boolean;
  email?: string;
};

const EnterPassword = ({ isSignUp = false, email = '' }: PasswordScreenProps) => {
  const router = useRouter();
  const { dark } = useTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{password?: string[]; confirmPassword?: string[]}>({});

  const validateForm = () => {
    const newErrors: {password?: string[]; confirmPassword?: string[]} = {};
    
    if (!password) {
      newErrors.password = ['Password is required'];
    } else if (password.length < 6) {
      newErrors.password = ['Password must be at least 6 characters'];
    }

    if (isSignUp) {
      if (!confirmPassword) {
        newErrors.confirmPassword = ['Please confirm your password'];
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = ['Passwords do not match'];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Handle form submission
      if (isSignUp) {
        console.log('Sign up with:', { email, password });
        // router.replace('/verification'); // Uncomment and adjust route as needed
      } else {
        console.log('Log in with:', { email, password });
        // router.replace('/home'); // Uncomment and adjust route as needed
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[FONTS.h1, { color: dark ? COLORS.white : COLORS.black }]}>
            {isSignUp ? 'Create Password' : 'Welcome Back!'}
          </Text>
          <Text style={[styles.subtitle, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
            {isSignUp 
              ? 'Create a password to secure your account' 
              : 'Enter your password to continue'}
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
          />
          
          {isSignUp && (
            <Input
              id="confirmPassword"
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onInputChanged={(id, text) => setConfirmPassword(text)}
              errorText={errors.confirmPassword}
              placeholderTextColor={dark ? COLORS.gray : COLORS.gray2}
              style={{ marginTop: SIZES.padding2 }}
            />
          )}

          <Button 
            title={isSignUp ? 'Create Account' : 'Sign In'}
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
    width: '100%',
    marginTop: SIZES.padding3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.padding3,
  },
  footerText: {
    ...FONTS.body4,
  },
  footerLink: {
    ...FONTS.body4,
    fontWeight: '600',
  },
});

export default EnterPassword;
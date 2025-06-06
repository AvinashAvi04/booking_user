import React, { FC, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  TextInputProps,
} from "react-native";
import { COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";

interface InputProps extends TextInputProps {
  id: string;
  icon?: any;
  errorText?: string[];
  onInputChanged: (id: string, text: string) => void;
}

const Input: FC<InputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const { dark } = useTheme();

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const onChangeText = (text: string) => {
    props.onInputChanged(props.id, text);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused
              ? COLORS.primary
              : dark
              ? COLORS.dark2
              : COLORS.greyscale500,
            backgroundColor: isFocused
              ? COLORS.tansparentPrimary
              : dark
              ? COLORS.dark2
              : COLORS.greyscale500,
          },
        ]}
      >
        {props.icon && (
          <Image
            source={props.icon}
            style={[
              styles.icon,
              {
                tintColor: isFocused ? COLORS.primary : "#BCBCBC",
              },
            ]}
          />
        )}
        <TextInput
          {...props}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, { color: dark ? COLORS.white : COLORS.black }]}
          autoCapitalize="none"
        />
      </View>
      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  errorContainer: {
    marginTop: 4,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
  },
});

export default Input;

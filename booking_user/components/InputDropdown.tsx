import React, { FC, useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  TextInputProps,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Platform,
} from "react-native";
import { COLORS, FONTS } from "@/constants";
import { useTheme } from "@theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Suggestion } from "@/types";

interface InputDropdownProps extends TextInputProps {
  id: string;
  icon?: any;
  errorText?: string[];
  onInputChanged: (id: string, text: string) => void;
  suggestions?: Suggestion[];
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  isLoading?: boolean;
}

const InputDropdown: FC<InputDropdownProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const { dark } = useTheme();

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsFocused(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const onChangeText = (text: string) => {
    props.onInputChanged(props.id, text);
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    if (props.onSuggestionSelect) {
      props.onSuggestionSelect(suggestion);
    }
    setIsFocused(false);
  };

  const renderSuggestions = () => {
    if (!isFocused) return null;

    if (props.isLoading) {
      return (
        <View style={styles.suggestionsContainer}>
          <View style={styles.suggestionItem}>
            <Text
              style={[styles.suggestionText, { color: COLORS.grayscale400 }]}
            >
              Searching...
            </Text>
          </View>
        </View>
      );
    }

    if (!props.suggestions || props.suggestions.length === 0) {
      return (
        <View style={styles.suggestionsContainer}>
          <View style={styles.suggestionItem}>
            <Text
              style={[styles.suggestionText, { color: COLORS.grayscale400 }]}
            >
              No locations found
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.suggestionsContainer}>
        <FlatList
          data={props.suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSuggestionSelect(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.suggestionText,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.place_name}
              </Text>
            </TouchableOpacity>
          )}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
          style={styles.suggestionsList}
          keyboardShouldPersistTaps="always"
        />
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { zIndex: isFocused ? 99999 : 1 }]}>
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
              zIndex: isFocused ? 99999 : 1,
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
            style={[
              styles.input,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
            autoCapitalize="none"
          />
        </View>
        {renderSuggestions()}
        {props.errorText && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{props.errorText}</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: COLORS.white,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    ...FONTS.body3,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.greyscale500,
    maxHeight: 200,
    zIndex: 99999,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale500,
  },
  suggestionText: {
    ...FONTS.body3,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  errorContainer: {
    marginTop: 4,
  },
  errorText: {
    ...FONTS.body4,
    color: COLORS.error,
  },
});

export default InputDropdown;

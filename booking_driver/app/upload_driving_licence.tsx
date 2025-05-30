import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES, FONTS, icons } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "@/components/Input";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

function UploadDL() {
  const { dark } = useTheme();
  const router = useRouter();
  const [dlNumber, setDlNumber] = useState("");
  const [hasUserTyped, setHasUserTyped] = useState(false);
  const isDlValid = dlNumber.trim().length > 0;

  const handleDlChange = (text: string) => {
    if (!hasUserTyped) setHasUserTyped(true);
    setDlNumber(text);
  };

  const handleVerify = () => {
    if (!isDlValid) {
      setHasUserTyped(true);
      return;
    }
    router.replace('/add_vehicle')
  };

  return (
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
      ]}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
        ]}
      >
        <View
          style={{
            backgroundColor: COLORS.success,
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              ...FONTS.body3,
              color: COLORS.white,
              textTransform: "uppercase",
            }}
          >
            You have completed your KYC
          </Text>
        </View>

        <Text
          style={{
            ...FONTS.h2,
            color: dark ? COLORS.white : COLORS.black,
            marginVertical: 20,
            fontWeight: 'bold',
          }}
        >
          Please upload required document
        </Text>

        <Text
          style={{
            ...FONTS.body2,
            color: COLORS.grayscale700,
            marginTop: 10,
            marginBottom: 6,
            marginLeft: 5,
          }}
        >
          Driver license
        </Text>

        <Input
          id="dlNumber"
          placeholder="Driver's License Number"
          value={dlNumber}
          onInputChanged={(id, text) => handleDlChange(text)}
          icon={icons.document}
          keyboardType="number-pad"
          errorText={hasUserTyped && !isDlValid ? ['Driver license is required'] : undefined}
        />

      </View>

      {/* Single Verify button at the bottom */}
      <View style={styles.bottomContainer}>
        <Button
          title="Verify"
          filled
          style={styles.bottomButtonSingle}
          onPress={handleVerify}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, padding: 16, backgroundColor: COLORS.white },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: COLORS.black,
    backgroundColor: COLORS.greyscale300,
    marginRight: 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    alignItems: "center",
  },
  bottomButtonSingle: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});

export default UploadDL;

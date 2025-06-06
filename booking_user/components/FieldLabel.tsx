import React from "react";
import { Text, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants";

interface FieldLabelProps {
  children: React.ReactNode;
}

const  FieldLabel: React.FC<FieldLabelProps> = ({ children }) => {
  return <Text style={styles.label}>{children}</Text>;
};

const styles = StyleSheet.create({
  label: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginBottom: 8,
  },
});


export default FieldLabel;
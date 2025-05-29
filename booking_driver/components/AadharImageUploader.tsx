import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants"; // Adjust this import as needed

// Define the props interface
interface AadharImageUploaderProps {
  pickFrontImage: () => void;
  pickBackImage: () => void;
  frontImage: string | null;
  backImage: string | null;
}

const AadharImageUploader: React.FC<AadharImageUploaderProps> = ({
  pickFrontImage,
  pickBackImage,
  frontImage,
  backImage,
}) => {
  return (
    <View style={styles.container}>
      {/* Front Photo */}
      <Text style={styles.label}>Add Aadhar Front Photo</Text>
      <TouchableOpacity onPress={pickFrontImage} style={styles.pickImage}>
        {frontImage ? (
          <Image source={{ uri: frontImage }} style={styles.image} />
        ) : (
          <MaterialCommunityIcons
            name="pencil-outline"
            size={24}
            color={COLORS.white}
          />
        )}
      </TouchableOpacity>

      {/* Back Photo */}
      <Text style={styles.label}>Add Aadhar Back Photo</Text>
      <TouchableOpacity onPress={pickBackImage} style={styles.pickImage}>
        {backImage ? (
          <Image source={{ uri: backImage }} style={styles.image} />
        ) : (
          <MaterialCommunityIcons
            name="pencil-outline"
            size={24}
            color={COLORS.white}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  pickImage: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  image: {
    width: 100,
    height: 60,
    borderRadius: 4,
    resizeMode: "cover",
  },
});

export default AadharImageUploader;

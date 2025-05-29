import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import { COLORS, SIZES, FONTS } from "../constants";
import { useRouter } from "expo-router";
import Button from "../components/Button";
import RNPickerSelect from "react-native-picker-select";
import { launchImagePicker } from "../utils/ImagePickerHelper"; // Reusing from upload_driving_licence.tsx

const AddVehicle = () => {
  const { dark } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modelName, setModelName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [rc, setRc] = useState("");
  const [carImage, setCarImage] = useState<any>(null);
  const [isCarInYourName, setIsCarInYourName] = useState("");

  const pickCarImage = async () => {
    try {
      const uri = await launchImagePicker();
      if (uri) setCarImage({ uri });
    } catch (error) {
      console.error("Error picking car image:", error);
    }
  };

  const handleSave = () => {
    console.log(
      "Model Name:",
      modelName,
      "Vehicle Number:",
      vehicleNumber,
      "RC:",
      rc,
      "Car Image:",
      carImage,
      "Is Car in Your Name:",
      isCarInYourName
    );
    setModalVisible(false);
    setModelName("");
    setVehicleNumber("");
    setRc("");
    setCarImage(null);
    setIsCarInYourName("");
  };

  const ownershipOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

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
        <View style={styles.headerContainer}>
          <Text style={{ fontSize: 20, fontWeight: 700 }}>Your Vehicles</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.verificationContainer}>
          <Text style={styles.verificationText}>
            vehicle verification status
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          <Button
            title="processed"
            filled
            style={styles.processedButton}
            onPress={() => {
              try {
                router.replace("/otpverification_kyc");
              } catch (error) {
                console.error("Navigation error:", error);
              }
            }}
          />
        </View>

        {/* Modal for adding a vehicle */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add a vehicle</Text>

              <TextInput
                style={styles.input}
                placeholder="Model Name"
                placeholderTextColor={COLORS.gray}
                value={modelName}
                onChangeText={setModelName}
              />
              <TextInput
                style={styles.input}
                placeholder="Vehicle Number"
                placeholderTextColor={COLORS.gray}
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
              />
              <TextInput
                style={styles.input}
                placeholder="RC"
                placeholderTextColor={COLORS.gray}
                value={rc}
                onChangeText={setRc}
              />

              {/* Car Image Upload */}
              <View style={{ marginVertical: 15, width: "100%" }}>
                <Text style={{ ...FONTS.body3, marginBottom: 8 }}>
                  Upload Car Image
                </Text>
                <TouchableOpacity onPress={pickCarImage}>
                  <View
                    style={{
                      height: 120,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: COLORS.primary,
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      backgroundColor: COLORS.greyscale300,
                    }}
                  >
                    {carImage ? (
                      <Image
                        source={{ uri: carImage.uri }}
                        // contentFit="cover"
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <Text style={{ ...FONTS.body4, color: COLORS.dark2 }}>
                        Car Image
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              {/* Is Car in Your Name Dropdown */}
              <View style={styles.dropdownContainer}>
                <Text style={{ ...FONTS.body3, marginBottom: 8 }}>
                  Is car in your name
                </Text>
                <RNPickerSelect
                  onValueChange={(value) => setIsCarInYourName(value)}
                  items={ownershipOptions}
                  placeholder={{
                    label: "Select an option...",
                    value: null,
                  }}
                  style={pickerSelectStyles}
                  value={isCarInYourName}
                />
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.closeButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, padding: 16, backgroundColor: COLORS.white },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  addButton: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    fontSize: 16,
    color: COLORS.black,
  },
  verificationContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  verificationText: {
    fontSize: 16,
    color: COLORS.black,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "center",
    width: SIZES.width - 32,
    alignItems: "center",
  },
  processedButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: SIZES.width - 40,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.black,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: COLORS.black,
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: COLORS.gray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.black,
    paddingRight: 30,
    height: 50,
    width: "100%",
    alignItems: "center",
    backgroundColor: COLORS.greyscale300,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.black,
    paddingRight: 30,
    height: 50,
    width: "100%",
    alignItems: "center",
    backgroundColor: COLORS.greyscale300,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
});

export default AddVehicle;

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import { COLORS, SIZES, FONTS } from "../constants";
import { useRouter } from "expo-router";
import Button from "../components/Button";
import RNPickerSelect from "react-native-picker-select";
import { launchImagePicker } from "../utils/ImagePickerHelper";

interface Vehicle {
  name: string;
  status: 'Pending' | 'Approved' | 'Canceled';
  number?: string;
  rc?: string;
  isOwned?: boolean;
}

const AddVehicle = () => {
  const { dark } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modelName, setModelName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [rc, setRc] = useState("");
  const [carImage, setCarImage] = useState<any>(null);
  const [affidavitImage, setAffidavitImage] = useState<any>(null);
  const [isCarInYourName, setIsCarInYourName] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      name: 'Scripio',
      status: 'Pending'
    },
    {
      name: 'Fortuner',
      status: 'Canceled'
    }, 
    {
      name: 'Bolero',
      status: 'Approved'
    }, 
    {
      name: 'Audi',
      status: 'Pending'
    }, 
    {
      name: 'BMW',
      status: 'Approved'
    }
  ]);

  const pickCarImage = async () => {
    try {
      const uri = await launchImagePicker();
      if (uri) setCarImage({ uri });
    } catch (error) {
      console.error("Error picking car image:", error);
    }
  };

  const pickAffidavitImage = async () => {
    try {
      const uri = await launchImagePicker();
      if (uri) setAffidavitImage({ uri });
    } catch (error) {
      console.error("Error picking affidavit image:", error);
    }
  };

  const handleSave = () => {
    if (!modelName || !vehicleNumber) {
      // Basic validation
      return;
    }

    const newVehicle: Vehicle = {
      name: modelName,
      status: 'Pending', // Default status
      number: vehicleNumber,
      rc: rc,
      isOwned: isCarInYourName === 'yes'
    };

    setVehicles((prevVehicles: Vehicle[]) => [...prevVehicles, newVehicle]);
    
    // Reset form
    setModalVisible(false);
    setModelName("");
    setVehicleNumber("");
    setRc("");
    setCarImage(null);
    setAffidavitImage(null);
    setIsCarInYourName("");
  };

  const ownershipOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  return (
    <SafeAreaView style={[styles.area, dark && styles.darkBackground]}>
      <View style={[styles.container, dark && styles.darkBackground]}>
        <View style={styles.headerContainer}>
          <Text style={styles.vehiclesTitle}>Your Vehicles</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.verificationContainer}>
          {vehicles.map((vehicle, index) => (
            <View key={index} style={styles.vehicleItem}>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <View style={styles.vehicleStatusContainer}>
                <View 
                  style={[
                    styles.statusDot,
                    vehicle.status.toLowerCase() === 'approved' ? styles.statusApproved :
                    vehicle.status.toLowerCase() === 'pending' ? styles.statusPending :
                    styles.statusCanceled
                  ]} 
                />
                <Text 
                  style={[
                    styles.vehicleStatus,
                    vehicle.status.toLowerCase() === 'approved' ? styles.statusApprovedText :
                    vehicle.status.toLowerCase() === 'pending' ? styles.statusPendingText :
                    styles.statusCanceledText
                  ]}
                >
                  {vehicle.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomContainer}>
          <Button
            title="processed"
            filled
            style={styles.processedButton}
            onPress={() => {
              try {
                router.replace("/(tabs)");
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
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalWrapper}>
              <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={[
                    styles.modalView,
                    dark ? styles.modalDarkBackground : styles.modalLightBackground
                  ]}
                >
                  <Text style={styles.modalTitle}>Add a vehicle</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Vehical Number"
                    placeholderTextColor={COLORS.gray}
                    value={vehicleNumber}
                    onChangeText={setVehicleNumber}
                  />

                  <Button
                    title="Fetch Details"
                    filled
                    style={styles.fetchDetailButton}
                    onPress={() => {}}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Model Name"
                    placeholderTextColor={COLORS.gray}
                    value={modelName}
                    onChangeText={setModelName}
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
                            style={{ width: "100%", height: "100%" }}
                          />
                        ) : (
                          <Text
                            style={{ ...FONTS.body4, color: COLORS.dark2 }}
                          >
                            Car Image
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Ownership Dropdown */}
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

                  {isCarInYourName === "no" && (
                    <View style={{ marginVertical: 15, width: "100%" }}>
                      <Text style={{ ...FONTS.body3, marginBottom: 8 }}>
                        Upload Affidavit
                      </Text>
                      <TouchableOpacity onPress={pickAffidavitImage}>
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
                          {affidavitImage ? (
                            <Image
                              source={{ uri: affidavitImage.uri }}
                              style={{ width: "100%", height: "100%" }}
                            />
                          ) : (
                            <Text
                              style={{ ...FONTS.body4, color: COLORS.dark2 }}
                            >
                              Affidavit Image
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

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
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main container styles
  area: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },
  darkBackground: {
    backgroundColor: COLORS.dark1
  },
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: COLORS.white 
  },
  
  // Header styles
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
  
  // Bottom container styles
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
  
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
  },
  modalWrapper: {
    width: "90%",
    maxHeight: "90%",
  },
  modalView: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.black,
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
  
  // Form input styles
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
  fetchDetailButton: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 8,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  
  // Text styles
  vehiclesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark1
  },

  // Status styles
  statusApproved: {
    backgroundColor: COLORS.primary
  },
  statusPending: {
    backgroundColor: COLORS.success
  },
  statusCanceled: {
    backgroundColor: COLORS.error
  },
  statusApprovedText: {
    color: COLORS.primary
  },
  statusPendingText: {
    color: COLORS.success
  },
  statusCanceledText: {
    color: COLORS.error
  },

  // Modal background styles
  modalLightBackground: {
    backgroundColor: COLORS.white
  },
  modalDarkBackground: {
    backgroundColor: COLORS.dark2
  },

  // Vehicle list styles
  verificationContainer: {
    flex: 1,
    marginTop: 20,
    width: '100%',
  },
  vehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleName: {
    ...FONTS.h4,
    color: COLORS.dark1,
    flex: 1,
  },
  vehicleStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  vehicleStatus: {
    ...FONTS.body4,
    textTransform: 'capitalize',
    fontSize: 16,
    color: COLORS.black,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.black,
    paddingRight: 30,
    height: 50,
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
    backgroundColor: COLORS.greyscale300,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
});

export default AddVehicle;

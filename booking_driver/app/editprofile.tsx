import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useState,
  useRef,
} from "react";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { reducer } from "../utils/reducers/formReducers";
import { validateInput } from "../utils/actions/formActions";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { launchImagePicker } from "../utils/ImagePickerHelper";
import Input from "../components/Input";
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerModal from "../components/DatePickerModal";
import Button from "../components/Button";
import RNPickerSelect from "react-native-picker-select";
import { useTheme } from "../theme/ThemeProvider";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import Input2 from "@/components/Input2";
import { MaterialIcons } from "@expo/vector-icons";

interface Item {
  flag: string;
  item: string;
  code: string;
}

interface RenderItemProps {
  item: Item;
}


const initialState = {
  inputValues: {
    fullName: "John Doe",
    email: "example@gmail.com",
    nickname:  "",
    phoneNumber: "",
  },
  inputValidities: {
    fullName: false,
    email: false,
    nickname: false,
    phoneNumber: false,
  },
  formIsValid: false,
};

// edit profile screen
const EditProfile = () => {
  const params = useLocalSearchParams();
  const isFirstTimeUser = params.isSignup === "true";
  const [showWelcomeModal, setShowWelcomeModal] = useState(isFirstTimeUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(
    Array.isArray(params.email) ? params.email[0] || "" : params.email || ""
  );
  const [phone, setPhone] = useState(
    Array.isArray(params.phone) ? params.phone[0] || "" : params.phone || ""
  );
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [image, setImage] = useState<any>(null);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const { dark, colors } = useTheme();
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleWelcomeSubmit = () => {
    if (!name.trim()) {
      setValidationError("Please enter your name");
      return;
    }

    const hasEmail = Array.isArray(params.email) ? params.email.length > 0 : Boolean(params.email);
    const hasPhone = Array.isArray(params.phone) ? params.phone.length > 0 : Boolean(params.phone);

    if (!hasEmail && !email) {
      setValidationError("Please enter your email address");
      return;
    }

    if (!hasPhone && !phone) {
      setValidationError("Please enter your phone number");
      return;
    }

    if (email && !validateEmail(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    if (phone && !validatePhone(phone)) {
      setValidationError("Please enter a valid 10-digit phone number");
      return;
    }

    setValidationError("");
    setShowWelcomeModal(false);
    // Here you would typically save the data to your backend
  };

  const renderWelcomeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showWelcomeModal}
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>

          <MaterialIcons
            name="account-circle"
            size={48}
            color={colors.primary}
            style={styles.icon}
          />

          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Welcome to Our App! 👋
          </Text>

          <View style={styles.contentContainer}>
            <Text style={[styles.modalSubtitle, { color: colors.text }]}>
              {(!params.email || (Array.isArray(params.email) && params.email.length === 0)) || 
               (!params.phone || (Array.isArray(params.phone) && params.phone.length === 0))
                ? "Please complete your profile" 
                : "We're excited to have you on board. Please tell us your name to get started."
              }
            </Text>
            
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={name}
              onInputChanged={(id, text) => setName(text)}
              style={styles.input}
              icon={icons.user}
              autoCapitalize="words"
            />

            {(!params.email || (Array.isArray(params.email) && params.email.length === 0)) && (
              <Input
                id="email"
                placeholder="Enter your email address"
                value={email}
                onInputChanged={(id, text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                icon={icons.email}
                errorText={emailError ? [emailError] : undefined}
              />
            )}

            {(!params.phone || (Array.isArray(params.phone) && params.phone.length === 0)) && (
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={phone}
                onInputChanged={(id, text) => setPhone(text)}
                keyboardType="phone-pad"
                maxLength={10}
                style={styles.input}
                icon={icons.call}
              />
            )}

            {validationError ? (
              <Text style={styles.errorText}>{validationError}</Text>
            ) : null}
          </View>

          <Button
            title="Continue"
            onPress={handleWelcomeSubmit}
            style={styles.submitButton}
            filled
            textColor="white"
          />
        </View>
      </View>
    </Modal>
  );

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const handleGenderChange = (value: any) => {
    setSelectedGender(value);
  };

  const today = new Date();
  const startDate = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    "YYYY/MM/DD"
  );

  const [startedDate, setStartedDate] = useState("12/12/2023");
  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

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
      Alert.alert("An error occurred", error);
    }
  }, [error]);

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;
      setImage({ uri: tempUri });
    } catch (error) {}
  };

  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then((response) => response.json())
      .then((data) => {
        let areaData = data.map((item: any) => {
          return {
            code: item.alpha2Code,
            item: item.name,
            callingCode: `+${item.callingCodes[0]}`,
            flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`,
          };
        });

        setAreas(areaData);
        if (areaData.length > 0) {
          let defaultData = areaData.filter((a: any) => a.code == "US");
          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
          }
        }
      });
  }, []);

  function RenderAreasCodesModal() {
    const renderItem = ({ item }: RenderItemProps) => {
      return (
        <TouchableOpacity
          style={{
            padding: 10,
            flexDirection: "row",
          }}
          onPress={() => {
            setSelectedArea(item), setModalVisible(false);
          }}
        >
          <Image
            source={{ uri: item.flag }}
            contentFit="contain"
            style={{
              height: 30,
              width: 30,
              marginRight: 10,
            }}
          />
          <Text style={{ fontSize: 16, color: "#fff" }}>{item.item}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                height: 400,
                width: SIZES.width * 0.8,
                backgroundColor: COLORS.primary,
                borderRadius: 12,
              }}
            >
              <FlatList
                data={areas}
                renderItem={renderItem}
                horizontal={false}
                keyExtractor={(item) => item.code}
                style={{
                  padding: 20,
                  marginBottom: 20,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  const [frontImage, setFrontImage] = useState<any>(null);
  const [backImage, setBackImage] = useState<any>(null);

  const pickFrontImage = async () => {
    try {
      const uri = await launchImagePicker();
      if (uri) setFrontImage({ uri });
    } catch (error) {
      console.error("Error picking front image:", error);
    }
  };

  const pickBackImage = async () => {
    try {
      const uri = await launchImagePicker();
      if (uri) setBackImage({ uri });
    } catch (error) {
      console.error("Error picking back image:", error);
    }
  };

  const [aadhar1, setAadhar1] = useState("");
  const [aadhar2, setAadhar2] = useState("");
  const [aadhar3, setAadhar3] = useState("");
  const [validationError, setValidationError] = useState("");

  // Refs for TextInput focus
  const aadhar2Ref = useRef<TextInput>(null);
  const aadhar3Ref = useRef<TextInput>(null);

  const validateAadhar = () => {
    if (!aadhar1 || !aadhar2 || !aadhar3) {
      setValidationError("Please enter complete Aadhar number");
      return false;
    }
    if (aadhar1.length !== 4 || aadhar2.length !== 4 || aadhar3.length !== 4) {
      setValidationError("Each part must be 4 digits");
      return false;
    }
    setValidationError("");
    return true;
  };

  return (
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
      ]}
    >
      {renderWelcomeModal()}
      <View
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
        ]}
      >
        <Header title="Complete Your KYC" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            {/* <View style={styles.avatarContainer}>
              <Image
                source={image === null ? images.user1 : image}
                contentFit="cover"
                style={styles.avatar}
              />
              <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View> */}
          </View>
          <Text>Enter your Aadhar Card Number</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <Input2
                id="aadhar1"
                value={aadhar1}
                onInputChanged={(_, val) => {
                  const cleanedValue = val.replace(/[^0-9]/g, "");
                  setAadhar1(cleanedValue);
                  if (cleanedValue.length === 4) {
                    aadhar2Ref.current?.focus();
                  }
                }}
                maxLength={4}
                keyboardType="numeric"
                placeholder="0000"
                style={{ flex: 1, marginRight: 4 }}
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                ref={null}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input2
                id="aadhar2"
                value={aadhar2}
                onInputChanged={(_, val) => {
                  const cleanedValue = val.replace(/[^0-9]/g, "");
                  setAadhar2(cleanedValue);
                  if (cleanedValue.length === 4) {
                    aadhar3Ref.current?.focus();
                  }
                }}
                maxLength={4}
                keyboardType="numeric"
                placeholder="0000"
                style={{ flex: 1, marginHorizontal: 2 }}
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                ref={aadhar2Ref}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input2
                id="aadhar3"
                value={aadhar3}
                onInputChanged={(_, val) => {
                  setAadhar3(val.replace(/[^0-9]/g, ""));
                }}
                maxLength={4}
                keyboardType="numeric"
                placeholder="0000"
                style={{ flex: 1, marginLeft: 4 }}
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                ref={aadhar3Ref}
              />
            </View>
          </View>
          {/* <View>
            <AadharImageUploaderProps
              pickFrontImage={pickFrontImage}
              pickBackImage={pickBackImage}
              frontImage={frontImage}
              backImage={backImage}
            />
          </View> */}
        </ScrollView>
      </View>
      {RenderAreasCodesModal()}
      <View style={styles.bottomContainer}>
        <Button
          title="Save"
          filled
          style={styles.continueButton}
          onPress={() => {
            if (validateAadhar()) {
              console.log("Aadhar number is valid, proceeding to OTP verification");
              router.replace("/otpverification_kyc");
            }
          }}
        />
        {validationError ? (
          <Text style={styles.errorText}>{validationError}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const AadharImageUploaderProps = ({
  pickFrontImage,
  pickBackImage,
  frontImage,
  backImage,
}: {
  pickFrontImage: () => void;
  pickBackImage: () => void;
  frontImage: any;
  backImage: any;
}) => {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ ...FONTS.body3, marginBottom: 8 }}>
        Upload Aadhar Card
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={pickFrontImage}>
          <View
            style={{
              width: SIZES.width / 2.3,
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
            {frontImage ? (
              <Image
                source={{ uri: frontImage.uri }}
                contentFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text style={{ ...FONTS.body4, color: COLORS.dark2 }}>
                Front Side
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickBackImage}>
          <View
            style={{
              width: SIZES.width / 2.3,
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
            {backImage ? (
              <Image
                source={{ uri: backImage.uri }}
                contentFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text style={{ ...FONTS.body4, color: COLORS.dark2 }}>
                Back Side
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: SIZES.padding * 2,
  },
  modalContent: {
    width: "100%",
    padding: SIZES.padding * 2.5,
    borderRadius: SIZES.radius,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    top: SIZES.padding,
    right: SIZES.padding,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  icon: {
    marginBottom: SIZES.padding,
  },
  titleWithIcon: {
    marginTop: -SIZES.padding,
  },
  modalTitle: {
    ...FONTS.h3,
    marginBottom: SIZES.padding,
    textAlign: "center",
  },
  modalSubtitle: {
    ...FONTS.body4,
    textAlign: "center",
    marginBottom: SIZES.padding * 1.5,
  },
  contentContainer: {
    width: "100%",
    marginBottom: SIZES.padding * 1.5,
  },
  submitButton: {
    width: "100%",
  },
  area: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, padding: 16, backgroundColor: COLORS.white },
  avatarContainer: {
    marginVertical: 12,
    alignItems: "center",
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  avatar: { height: 130, width: 130, borderRadius: 65 },
  pickImage: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  inputContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: 0.4,
    borderRadius: 6,
    height: 52,
    width: SIZES.width - 32,
    alignItems: "center",
    marginVertical: 16,
    backgroundColor: COLORS.greyscale500,
  },
  downIcon: { width: 10, height: 10, tintColor: "#111" },
  selectFlagContainer: {
    width: 90,
    height: 50,
    marginHorizontal: 5,
    flexDirection: "row",
  },
  flagIcon: { width: 30, height: 30 },
  input: {
    flex: 1,
    marginVertical: 10,
    marginBottom: SIZES.padding,
    height: 40,
    fontSize: 14,
    color: "#111",
  },
  errorText: {
    color: COLORS.error || 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    textAlign: 'center',
    width: '100%',
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "space-between",
    marginTop: 4,
    backgroundColor: COLORS.greyscale500,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
  rowContainer: { flexDirection: "row", justifyContent: "space-between" },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center",
  },
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: 0.4,
    borderRadius: 6,
    height: 58,
    width: SIZES.width - 32,
    alignItems: "center",
    marginVertical: 16,
    backgroundColor: COLORS.greyscale500,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.greyscale600,
    paddingRight: 30,
    height: 58,
    width: SIZES.width - 32,
    alignItems: "center",
    backgroundColor: COLORS.greyscale500,
    borderRadius: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.greyscale600,
    paddingRight: 30,
    height: 58,
    width: SIZES.width - 32,
    alignItems: "center",
    backgroundColor: COLORS.greyscale500,
    borderRadius: 16,
  },
});

export default EditProfile;

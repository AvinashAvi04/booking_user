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
import { useRouter } from "expo-router";
import Input2 from "@/components/Input2";

interface Item {
  flag: string;
  item: string;
  code: string;
}

interface RenderItemProps {
  item: Item;
}

const isTestMode = true;

const initialState = {
  inputValues: {
    fullName: isTestMode ? "John Doe" : "",
    email: isTestMode ? "example@gmail.com" : "",
    nickname: isTestMode ? "" : "",
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
const UploadDL = () => {
  const [image, setImage] = useState<any>(null);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const { dark } = useTheme();
  const router = useRouter();

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

  // Refs for TextInput focus
  const aadhar2Ref = useRef<TextInput>(null);
  const aadhar3Ref = useRef<TextInput>(null);

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
        {/* <Header title="You have completed your KYC" /> */}
        <View
          style={{
            backgroundColor: COLORS.success,
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Text style={{ textAlign: "center" }}>
            You have completed your KYC
          </Text>
        </View>
         <Input
            id="aadhar1"
            placeholder="Password"
            secureTextEntry
            value={''}
            onInputChanged={(id, text) => setPassword(text)}
            errorText={errors.password}
            placeholderTextColor={dark ? COLORS.gray : COLORS.gray2}
            icon={icons.padlock}
            autoCapitalize="none"
          />
        {/* <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <AadharImageUploaderProps
              pickFrontImage={pickFrontImage}
              pickBackImage={pickBackImage}
              frontImage={frontImage}
              backImage={backImage}
            />
          </View>
        </ScrollView> */}
      </View>
      {RenderAreasCodesModal()}
      <View style={styles.bottomContainer}>
        <Button
          title="Upload"
          filled
          style={styles.continueButton}
          onPress={() => {
            try {
              router.replace("/add_vehicle");
            } catch (error) {
              console.error("Navigation error:", error);
            }
          }}
        />
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
        Please Upload Required Document{" "}
      </Text>
      <View>
        <TouchableOpacity onPress={pickFrontImage}>
          <View
            style={{
              flex: 1,
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
                Driving License
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    height: 40,
    fontSize: 14,
    color: "#111",
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

export default UploadDL;

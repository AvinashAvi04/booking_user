import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_BASE_URL } from "@env";
import { COLORS, FONTS, icons, cabTypes } from "@/constants";
import FieldLabel from "@/components/FieldLabel";
import InputDropdown from "@/components/InputDropdown";
import DatePickerModal from "@/components/DatePickerModal";
import TimeDropdown from "@/components/TimeDropdown";
import Input from "@/components/Input";
import DateTimePickerModal from "@/components/DateTimePickerModal";

interface Location {
  name: string;
  longitude: number;
  latitude: number;
}

interface Suggestion {
  place_name: string;
  longitude: number;
  latitude: number;
}

const OneWayForm = () => {
  const [fields, setFields] = useState({
    source: { name: "", longitude: 0, latitude: 0 } as Location,
    destination: { name: "", longitude: 0, latitude: 0 } as Location,
    stops: [] as Location[],
    date: new Date(),
    time: new Date(),
    cabType: "",
    numberOfPeople: 1,
  });
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [selectedCab, setSelectedCab] = useState("Hatchback");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const router = useRouter();
  const [showCabDropdown, setShowCabDropdown] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState<number>(-1);

  const formatDate = (date: Date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  const formatTime = (date: Date) => {
    return moment(date).format("HH:mm");
  };

  const formatDateForPicker = (date: Date) => {
    try {
      return moment(date).format("YYYY/MM/DD");
    } catch (error) {
      return moment().format("YYYY/MM/DD");
    }
  };

  const addStop = () => {
    setFields((f) => ({
      ...f,
      stops: [...f.stops, { name: "", longitude: 0, latitude: 0 }],
    }));
  };

  const removeStop = (index: number) => {
    setFields((f) => ({
      ...f,
      stops: f.stops.filter((_, i) => i !== index),
    }));
  };

  const updateStop = (
    index: number,
    name: string,
    longitude: number,
    latitude: number
  ) => {
    setFields((f) => {
      const newStops = [...f.stops];
      newStops[index] = {
        name,
        longitude,
        latitude,
      };
      return { ...f, stops: newStops };
    });
  };

  const fetchSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.get(
        `${REACT_APP_BASE_URL}/api/v1/bookings/autocomplete/?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion: Suggestion, type: string) => {
    if (!suggestion || !suggestion.place_name) return;

    const location: Location = {
      name: suggestion.place_name,
      longitude: suggestion.longitude,
      latitude: suggestion.latitude,
    };

    switch (type) {
      case "source":
        setFields((f) => ({
          ...f,
          source: location,
        }));
        break;
      case "destination":
        setFields((f) => ({
          ...f,
          destination: location,
        }));
        break;
      case "stop":
        setFields((f) => ({
          ...f,
          stops: f.stops.map((stop, index) =>
            index === activeStopIndex ? location : stop
          ),
        }));
        break;
    }
    setSuggestions([]);
    setActiveInput("");
  };

  const handleInputChange = (id: string, value: string) => {
    if (id === "source") {
      setFields((f) => ({ ...f, source: { ...f.source, name: value } }));
      setActiveInput("source");
      fetchSuggestions(value);
    } else if (id === "destination") {
      setFields((f) => ({
        ...f,
        destination: { ...f.destination, name: value },
      }));
      setActiveInput("destination");
      fetchSuggestions(value);
    } else if (id.startsWith("stop")) {
      const index = parseInt(id.replace("stop", ""));
      setFields((f) => {
        const newStops = [...f.stops];
        newStops[index] = { ...newStops[index], name: value };
        return { ...f, stops: newStops };
      });
      setActiveInput(`stop${index}`);
      fetchSuggestions(value);
    }
  };

  const handleCabSelect = (cab: (typeof cabTypes)[0]) => {
    setSelectedCab(cab.key);
    setShowCabDropdown(false);
  };

  const handleOneWaySubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");

      // Format the date and time
      const formattedDate = fields.date.toISOString().split("T")[0];
      const formattedTime = fields.time
        .toISOString()
        .split("T")[1]
        .substring(0, 5);
      const departureDate = formattedDate;

      const payload = {
        from_location_name: fields.source.name,
        from_location_longitude: fields.source.longitude,
        from_location_latitude: fields.source.latitude,
        to_location_name: fields.destination.name,
        to_location_longitude: fields.destination.longitude,
        to_location_latitude: fields.destination.latitude,
        departure_date: departureDate,
        trip_type: "one_way",
        number_of_people: 2, // You might want to make this dynamic based on selected cab type
        stops: fields.stops.map((stop) => ({
          name: stop.name,
          longitude: stop.longitude,
          latitude: stop.latitude,
        })),
      };

      const response = await axios.post(
        `${REACT_APP_BASE_URL}/api/v1/bookings/trips/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Navigate to price discussion on success
        router.push("/pricediscussion");
      }
    } catch (error) {
      console.error("Error submitting trip:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.formContainer}>
        <FieldLabel>Source</FieldLabel>
        <InputDropdown
          id="source"
          placeholder="Source"
          icon={icons.location}
          onInputChanged={(id, v) => {
            setFields((f) => ({
              ...f,
              source: { ...f.source, name: v },
            }));
            fetchSuggestions(v);
          }}
          value={fields.source.name}
          suggestions={suggestions}
          onSuggestionSelect={(suggestion) => {
            setFields((f) => ({
              ...f,
              source: {
                name: suggestion.place_name,
                longitude: suggestion.longitude,
                latitude: suggestion.latitude,
              },
            }));
            setSuggestions([]);
          }}
        />

        {fields.stops.map((stop, index) => (
          <View key={`stop-${index}`} style={styles.stopContainer}>
            <View style={styles.stopHeader}>
              <Text style={styles.stopLabel}>Stop {index + 1}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeStop(index)}
              >
                <Image source={icons.close} style={styles.removeIcon} />
              </TouchableOpacity>
            </View>
            <InputDropdown
              id={`stop-${index}`}
              placeholder={`Stop ${index + 1}`}
              icon={icons.location}
              onInputChanged={(id, v) => {
                updateStop(index, v, 0, 0);
                fetchSuggestions(v);
              }}
              value={stop.name}
              suggestions={suggestions}
              onSuggestionSelect={(suggestion) => {
                setActiveStopIndex(index);
                updateStop(
                  index,
                  suggestion.place_name,
                  suggestion.longitude,
                  suggestion.latitude
                );
                setSuggestions([]);
              }}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addStopButton} onPress={addStop}>
          <Text style={styles.addStopText}>+ Add Stop</Text>
        </TouchableOpacity>

        <FieldLabel>Destination</FieldLabel>
        <InputDropdown
          id="destination"
          placeholder="Destination"
          icon={icons.location}
          onInputChanged={(id, v) => {
            setFields((f) => ({
              ...f,
              destination: { ...f.destination, name: v },
            }));
            fetchSuggestions(v);
          }}
          value={fields.destination.name}
          suggestions={suggestions}
          onSuggestionSelect={(suggestion) => {
            setFields((f) => ({
              ...f,
              destination: {
                name: suggestion.place_name,
                longitude: suggestion.longitude,
                latitude: suggestion.latitude,
              },
            }));
            setSuggestions([]);
          }}
        />

        <FieldLabel>Date and Time</FieldLabel>
        <TouchableOpacity onPress={() => setShowDate(true)}>
          <Input
            id="datetime"
            placeholder="Select Date and Time"
            icon={icons.calendar}
            value={`${formatDate(fields.date)} ${formatTime(fields.time)}`}
            editable={false}
            onInputChanged={() => {}}
          />
        </TouchableOpacity>

        <DateTimePickerModal
          open={showDate}
          startDate={moment().format("YYYY/MM/DD")}
          selectedDate={moment(fields.date).format("YYYY/MM/DD")}
          onClose={() => setShowDate(false)}
          onChangeDateTime={(dateStr, timeStr) => {
            try {
              const newDate = moment(dateStr, "YYYY/MM/DD").toDate();
              const [hours, minutes] = timeStr.split(":").map(Number);
              newDate.setHours(hours);
              newDate.setMinutes(minutes);
              setFields((f) => ({
                ...f,
                date: newDate,
                time: newDate,
              }));
            } catch (error) {
              console.error("DateTime error:", error);
              const now = new Date();
              setFields((f) => ({
                ...f,
                date: now,
                time: now,
              }));
            }
          }}
        />

        <View style={{ marginTop: "20" }}></View>

        <FieldLabel>Cab Type</FieldLabel>
        <TouchableOpacity
          style={styles.cabTypeButton}
          onPress={() => setShowCabDropdown(true)}
        >
          <View style={styles.cabTypeContent}>
            <Image
              source={cabTypes.find((cab) => cab.key === selectedCab)?.image}
              style={styles.cabTypeImage}
            />
            <View style={styles.cabTypeInfo}>
              <Text style={styles.cabTypeName}>{selectedCab}</Text>
              <Text style={styles.cabTypeDesc}>
                {cabTypes.find((cab) => cab.key === selectedCab)?.desc}
              </Text>
            </View>
            <View style={styles.cabTypePassengers}>
              <Image source={icons.user} style={styles.personIcon} />
              <Text style={styles.passengerCount}>
                {cabTypes.find((cab) => cab.key === selectedCab)?.passengers}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleOneWaySubmit}
        >
          <Text style={styles.submitButtonText}>Book Now</Text>
        </TouchableOpacity>

        {showCabDropdown && (
          <Modal
            visible={showCabDropdown}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCabDropdown(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowCabDropdown(false)}
            >
              <View style={styles.cabDropdownContainer}>
                <FlatList
                  data={cabTypes}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.cabTypeItem,
                        selectedCab === item.key && styles.selectedCabTypeItem,
                      ]}
                      onPress={() => handleCabSelect(item)}
                    >
                      <Image source={item.image} style={styles.cabTypeImage} />
                      <View style={styles.cabTypeInfo}>
                        <Text
                          style={[
                            styles.cabTypeName,
                            selectedCab === item.key &&
                              styles.selectedCabTypeText,
                          ]}
                        >
                          {item.key}
                        </Text>
                        <Text
                          style={[
                            styles.cabTypeDesc,
                            selectedCab === item.key &&
                              styles.selectedCabTypeText,
                          ]}
                        >
                          {item.desc}
                        </Text>
                      </View>
                      <View style={styles.cabTypePassengers}>
                        <Image source={icons.user} style={styles.personIcon} />
                        <Text
                          style={[
                            styles.passengerCount,
                            selectedCab === item.key &&
                              styles.selectedCabTypeText,
                          ]}
                        >
                          {item.passengers}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.key}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  stopContainer: {
    marginBottom: 15,
  },
  stopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  stopLabel: {
    ...FONTS.body3,
    color: "#000",
  },
  removeButton: {
    padding: 5,
  },
  removeIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.gray,
  },
  addStopButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    // padding: 10,
    // backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  addStopText: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginLeft: 5,
  },
  dateButton: {
    marginBottom: 20,
  },
  cabTypeButton: {
    marginBottom: 20,
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
  },
  cabTypeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cabTypeImage: {
    width: 40,
    height: 20,
    marginRight: 15,
  },
  cabTypeInfo: {
    flex: 1,
  },
  cabTypeName: {
    ...FONTS.h4,
    color: COLORS.black,
  },
  cabTypeDesc: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  cabTypePassengers: {
    flexDirection: "row",
    alignItems: "center",
  },
  personIcon: {
    width: 10,
    height: 10,
    tintColor: COLORS.gray,
    marginRight: 5,
  },
  passengerCount: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cabDropdownContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  cabTypeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  selectedCabTypeItem: {
    backgroundColor: COLORS.primary,
  },
  selectedCabTypeText: {
    color: COLORS.white,
  },
});

export default OneWayForm;

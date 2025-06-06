import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
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

interface CabType {
  key: string;
  image: any;
  desc: string;
  passengers: number;
}

type RootStackParamList = {
  pricediscussion: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TimeDropdownProps {
  value: string;
  onTimeSelect: (time: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

interface InputDropdownProps {
  id: string;
  placeholder: string;
  icon: any;
  onInputChanged: (id: string, text: string) => void;
  value: string;
  suggestions: Suggestion[];
  onSuggestionSelect: (suggestion: Suggestion) => void;
  editable?: boolean;
}

const RoundTripForm = () => {
  const [fields, setFields] = useState({
    source: { name: "", longitude: 0, latitude: 0 } as Location,
    destination: { name: "", longitude: 0, latitude: 0 } as Location,
    stops: [] as Location[],
    departureDate: new Date(),
    departureTime: new Date(),
    returnDate: new Date(),
    returnTime: new Date(),
    cabType: "",
    numberOfPeople: 1,
  });
  const [showDepartureDate, setShowDepartureDate] = useState(false);
  const [showDepartureTime, setShowDepartureTime] = useState(false);
  const [showReturnDate, setShowReturnDate] = useState(false);
  const [showReturnTime, setShowReturnTime] = useState(false);
  const [selectedCab, setSelectedCab] = useState("Hatchback");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const navigator = useNavigation<NavigationProp>();
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
        if (activeStopIndex !== -1) {
          setFields((f) => ({
            ...f,
            stops: f.stops.map((stop, index) =>
              index === activeStopIndex ? location : stop
            ),
          }));
        }
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

  const handleRoundTripSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");

      // Format the dates and times
      const departureDate = moment(fields.departureDate).format("YYYY-MM-DD");
      const departureTime = moment(fields.departureTime).format("HH:mm");
      const returnDate = moment(fields.returnDate).format("YYYY-MM-DD");
      const returnTime = moment(fields.returnTime).format("HH:mm");

      const payload = {
        from_location_name: fields.source.name,
        from_location_longitude: fields.source.longitude,
        from_location_latitude: fields.source.latitude,
        to_location_name: fields.destination.name,
        to_location_longitude: fields.destination.longitude,
        to_location_latitude: fields.destination.latitude,
        departure_date: departureDate,
        departure_time: departureTime,
        return_date: returnDate,
        return_time: returnTime,
        trip_type: "round_trip",
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
        navigator.navigate("pricediscussion");
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
          onInputChanged={(id: string, v: string) => {
            setFields((f) => ({
              ...f,
              source: { ...f.source, name: v },
            }));
            fetchSuggestions(v);
          }}
          value={fields.source.name}
          suggestions={suggestions}
          onSuggestionSelect={(suggestion: Suggestion) =>
            handleSuggestionSelect(suggestion, "source")
          }
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

        <FieldLabel>Departure Date and Time</FieldLabel>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDepartureDate(true)}
        >
          <InputDropdown
            id="departureDate"
            placeholder="Select Departure Date and Time"
            icon={icons.calendar}
            onInputChanged={(id, v) => {
              const newDate = new Date(v);
              setFields((f) => ({ ...f, departureDate: newDate }));
            }}
            value={`${formatDate(fields.departureDate)} ${formatTime(
              fields.departureTime
            )}`}
            editable={false}
          />
        </TouchableOpacity>

        <FieldLabel>Return Date and Time</FieldLabel>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowReturnDate(true)}
        >
          <InputDropdown
            id="returnDate"
            placeholder="Select Return Date and Time"
            icon={icons.calendar}
            onInputChanged={(id, v) => {
              const newDate = new Date(v);
              setFields((f) => ({ ...f, returnDate: newDate }));
            }}
            value={`${formatDate(fields.returnDate)} ${formatTime(
              fields.returnTime
            )}`}
            editable={false}
          />
        </TouchableOpacity>

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
          onPress={handleRoundTripSubmit}
        >
          <Text style={styles.submitButtonText}>Book Now</Text>
        </TouchableOpacity>

        <DatePickerModal
          open={showDepartureDate}
          startDate={moment().format("YYYY/MM/DD")}
          selectedDate={moment(fields.departureDate).format("YYYY/MM/DD")}
          onClose={() => setShowDepartureDate(false)}
          onChangeStartDate={(dateStr) => {
            try {
              const newDate = moment(dateStr, "YYYY/MM/DD").toDate();

              // Preserve the time from the existing date if valid
              if (
                fields.departureTime instanceof Date &&
                !isNaN(fields.departureTime.getTime())
              ) {
                const time = moment(fields.departureTime);
                newDate.setHours(time.hours());
                newDate.setMinutes(time.minutes());
              }

              setFields((f) => ({ ...f, departureDate: newDate }));
              setShowDepartureTime(true);
            } catch (error) {
              console.error("Date error:", error);
              setFields((f) => ({ ...f, departureDate: new Date() }));
            }
          }}
        />

        <DatePickerModal
          open={showReturnDate}
          startDate={moment().format("YYYY/MM/DD")}
          selectedDate={moment(fields.returnDate).format("YYYY/MM/DD")}
          onClose={() => setShowReturnDate(false)}
          onChangeStartDate={(dateStr) => {
            try {
              const newDate = moment(dateStr, "YYYY/MM/DD").toDate();

              // Preserve the time from the existing date if valid
              if (
                fields.returnTime instanceof Date &&
                !isNaN(fields.returnTime.getTime())
              ) {
                const time = moment(fields.returnTime);
                newDate.setHours(time.hours());
                newDate.setMinutes(time.minutes());
              }

              setFields((f) => ({ ...f, returnDate: newDate }));
              setShowReturnTime(true);
            } catch (error) {
              console.error("Date error:", error);
              setFields((f) => ({ ...f, returnDate: new Date() }));
            }
          }}
        />

        {showDepartureTime && (
          <TimeDropdown
            value={formatTime(fields.departureTime)}
            onTimeSelect={(time: string) => {
              try {
                const newDate = moment(fields.departureDate).toDate();
                const [hours, minutes] = time.split(":").map(Number);
                newDate.setHours(hours);
                newDate.setMinutes(minutes);
                setFields((f) => ({
                  ...f,
                  departureDate: newDate,
                  departureTime: newDate,
                }));
              } catch (error) {
                console.error("Time selection error:", error);
                const now = new Date();
                setFields((f) => ({
                  ...f,
                  departureDate: now,
                  departureTime: now,
                }));
              }
              setShowDepartureTime(false);
            }}
            isVisible={showDepartureTime}
            onClose={() => setShowDepartureTime(false)}
          />
        )}

        {showReturnTime && (
          <TimeDropdown
            value={formatTime(fields.returnTime)}
            onTimeSelect={(time: string) => {
              try {
                const newDate = moment(fields.returnDate).toDate();
                const [hours, minutes] = time.split(":").map(Number);
                newDate.setHours(hours);
                newDate.setMinutes(minutes);
                setFields((f) => ({
                  ...f,
                  returnDate: newDate,
                  returnTime: newDate,
                }));
              } catch (error) {
                console.error("Time selection error:", error);
                const now = new Date();
                setFields((f) => ({
                  ...f,
                  returnDate: now,
                  returnTime: now,
                }));
              }
              setShowReturnTime(false);
            }}
            isVisible={showReturnTime}
            onClose={() => setShowReturnTime(false)}
          />
        )}

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
    color: COLORS.gray,
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
    marginBottom: 20,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  addStopText: {
    ...FONTS.body3,
    color: COLORS.white,
    marginLeft: 5,
  },
  dateButton: {
    marginBottom: 20,
  },
  cabTypeButton: {
    marginBottom: 20,
    padding: 15,
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
    height: 40,
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
    width: 20,
    height: 20,
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


export default RoundTripForm;
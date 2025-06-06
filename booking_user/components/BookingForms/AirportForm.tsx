import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, icons } from "@/constants";
import FieldLabel from "@/components/FieldLabel";
import Input from "@/components/Input";
import Button from "@/components/Button";
import DatePickerModal from "@/components/DatePickerModal";

const AirportForm = () => {
  const [fields, setFields] = useState({
    fromAirport: true,
    airport: "",
    destination: "",
    pickup: "",
    toAirport: false,
    airport2: "",
    source: "",
    time: "",
  });
  const [showPickup, setShowPickup] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() =>
              setFields((f) => ({ ...f, fromAirport: true, toAirport: false }))
            }
            style={[
              styles.toggleBtn,
              fields.fromAirport && styles.toggleBtnActive,
            ]}
          >
            <Text
              style={[
                styles.toggleBtnText,
                fields.fromAirport && styles.toggleBtnTextActive,
              ]}
            >
              From Airport
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setFields((f) => ({ ...f, fromAirport: false, toAirport: true }))
            }
            style={[
              styles.toggleBtn,
              fields.toAirport && styles.toggleBtnActive,
            ]}
          >
            <Text
              style={[
                styles.toggleBtnText,
                fields.toAirport && styles.toggleBtnTextActive,
              ]}
            >
              To Airport
            </Text>
          </TouchableOpacity>
        </View>
        <FieldLabel>Airport</FieldLabel>
        <Input
          id="airport"
          placeholder="Airport"
          icon={icons.location}
          onInputChanged={(id, v) => setFields((f) => ({ ...f, airport: v }))}
          value={fields.airport}
        />
        {fields.fromAirport ? (
          <>
            <FieldLabel>Destination</FieldLabel>
            <Input
              id="destination"
              placeholder="Destination"
              icon={icons.location}
              onInputChanged={(id, v) =>
                setFields((f) => ({ ...f, destination: v }))
              }
              value={fields.destination}
            />
          </>
        ) : (
          <>
            <FieldLabel>Source Address</FieldLabel>
            <Input
              id="source"
              placeholder="Source Address"
              icon={icons.location}
              onInputChanged={(id, v) =>
                setFields((f) => ({ ...f, source: v }))
              }
              value={fields.source}
            />
          </>
        )}
        <FieldLabel>Pickup Date & Time</FieldLabel>
        <TouchableOpacity onPress={() => setShowPickup(true)}>
          <Input
            id="pickup"
            placeholder="Pickup Date & Time"
            icon={icons.calendar}
            value={fields.pickup}
            editable={false}
            onInputChanged={() => {}}
          />
        </TouchableOpacity>
        <FieldLabel>Time</FieldLabel>
        <Input
          id="time"
          placeholder="Time"
          icon={icons.clockTime}
          onInputChanged={(id, v) => setFields((f) => ({ ...f, time: v }))}
          value={fields.time}
        />
        <Button
          title="Search"
          filled
          style={{ marginTop: 24 }}
          onPress={() => {
            router.push("/pricediscussion");
          }}
        />
        <DatePickerModal
          open={showPickup}
          startDate={new Date().toISOString().split("T")[0]}
          selectedDate={fields.pickup}
          onClose={() => setShowPickup(false)}
          onChangeStartDate={(date) =>
            setFields((f) => ({ ...f, pickup: date }))
          }
        />
      </ScrollView>
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
  toggleRow: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    overflow: "hidden",
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
  },
  toggleBtnText: {
    ...FONTS.body3,
    color: COLORS.gray,
  },
  toggleBtnTextActive: {
    color: COLORS.white,
  },
});


export default AirportForm;
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, icons } from "@/constants";
import FieldLabel from "@/components/FieldLabel";
import Input from "@/components/Input";
import Button from "@/components/Button";
import DatePickerModal from "@/components/DatePickerModal";

const LocalForm = () => {
  const [fields, setFields] = useState({ city: "", date: "", time: "" });
  const [showDate, setShowDate] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <FieldLabel>City</FieldLabel>
        <Input
          id="city"
          placeholder="City"
          icon={icons.location}
          onInputChanged={(id, v) => setFields((f) => ({ ...f, city: v }))}
          value={fields.city}
        />
        <FieldLabel>Pickup Date</FieldLabel>
        <TouchableOpacity onPress={() => setShowDate(true)}>
          <Input
            id="date"
            placeholder="Pickup Date"
            icon={icons.calendar}
            value={fields.date}
            editable={false}
            onInputChanged={() => {}}
          />
        </TouchableOpacity>
        <FieldLabel>Pickup Time</FieldLabel>
        <Input
          id="time"
          placeholder="Pickup Time"
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
          open={showDate}
          startDate={new Date().toISOString().split("T")[0]}
          selectedDate={fields.date}
          onClose={() => setShowDate(false)}
          onChangeStartDate={(date) => setFields((f) => ({ ...f, date }))}
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
});


export default LocalForm;
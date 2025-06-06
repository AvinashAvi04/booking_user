import React, { useState, FC, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DatePicker from "react-native-modern-datepicker";
import { COLORS, FONTS } from "../constants";
import moment from "moment";

const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

interface DatePickerModalProps {
  open: boolean;
  startDate: string;
  selectedDate: string;
  onClose: () => void;
  onChangeStartDate: (date: string) => void;
}

const DatePickerModal: FC<DatePickerModalProps> = ({
  open,
  startDate,
  selectedDate,
  onClose,
  onChangeStartDate,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(selectedDate);

  // Update selectedStartDate when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedStartDate(selectedDate);
    }
  }, [selectedDate]);

  // Reset selectedStartDate when modal opens
  useEffect(() => {
    if (open) {
      setSelectedStartDate(selectedDate || startDate);
    }
  }, [open, selectedDate, startDate]);

  const handleDateChange = (date: string) => {
    if (!date) return;
    setSelectedStartDate(date);
    onChangeStartDate(date);
  };

  const handleOnPressStartDate = () => {
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <DatePicker
            mode="calendar"
            minimumDate={startDate}
            selected={selectedStartDate}
            onDateChange={handleDateChange}
            onSelectedChange={(date) => setSelectedStartDate(date)}
            options={{
              backgroundColor: COLORS.white,
              textHeaderColor: COLORS.black,
              textDefaultColor: COLORS.black,
              selectedTextColor: COLORS.white,
              mainColor: COLORS.primary,
              textSecondaryColor: COLORS.gray,
              borderColor: COLORS.grayscale200,
              defaultFont: FONTS.body3.fontFamily,
              headerFont: FONTS.h4.fontFamily,
              textFontSize: 16,
              textHeaderFontSize: 14,
            }}
          />
          <TouchableOpacity
            onPress={handleOnPressStartDate}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.h4.fontFamily,
  },
});

export default DatePickerModal;

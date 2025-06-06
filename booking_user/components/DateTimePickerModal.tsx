import React, { useState, FC, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import DatePicker from "react-native-modern-datepicker";
import { COLORS, FONTS } from "../constants";
import moment from "moment";

interface DateTimePickerModalProps {
  open: boolean;
  startDate: string;
  selectedDate: string;
  onClose: () => void;
  onChangeDateTime: (date: string, time: string) => void;
}

const DateTimePickerModal: FC<DateTimePickerModalProps> = ({
  open,
  startDate,
  selectedDate,
  onClose,
  onChangeDateTime,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(selectedDate);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDate) {
      setSelectedStartDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (open) {
      setSelectedStartDate(selectedDate || startDate);
      setShowTimePicker(false);
    }
  }, [open, selectedDate, startDate]);

  useEffect(() => {
    // Generate time options in 30-minute intervals
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    setTimeOptions(times);
  }, []);

  const handleDateChange = (date: string) => {
    if (!date) return;
    setSelectedStartDate(date);
    setShowTimePicker(true);
  };

  const handleTimeSelect = (time: string) => {
    onChangeDateTime(selectedStartDate, time);
    onClose();
  };

  const renderTimeItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.timeItem}
      onPress={() => handleTimeSelect(item)}
    >
      <Text style={styles.timeText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {!showTimePicker ? (
            <>
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
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.timeHeader}>Select Time</Text>
              <FlatList
                data={timeOptions}
                renderItem={renderTimeItem}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                style={styles.timeList}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={10}
              />
              <TouchableOpacity
                onPress={() => setShowTimePicker(false)}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>Back to Date</Text>
              </TouchableOpacity>
            </>
          )}
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
  timeHeader: {
    ...FONTS.h4,
    marginBottom: 16,
  },
  timeList: {
    width: "100%",
    maxHeight: 300,
  },
  timeItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  timeText: {
    ...FONTS.body3,
    textAlign: "center",
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
  backButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.h4.fontFamily,
  },
});

export default DateTimePickerModal;

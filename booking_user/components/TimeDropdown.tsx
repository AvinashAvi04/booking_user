import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";

interface TimeDropdownProps {
  value: string;
  onTimeSelect: (time: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({
  value,
  onTimeSelect,
  isVisible,
  onClose,
}) => {
  const { dark } = useTheme();
  const [timeOptions, setTimeOptions] = useState<string[]>([]);

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

  const renderTimeItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.timeItem,
        value === item && styles.selectedTimeItem,
        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
      ]}
      onPress={() => {
        onTimeSelect(item);
        onClose();
      }}
    >
      <Text
        style={[
          styles.timeText,
          value === item && styles.selectedTimeText,
          { color: dark ? COLORS.white : COLORS.black },
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.dropdownContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
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
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    width: "80%",
    maxHeight: 400,
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  timeList: {
    maxHeight: 350,
  },
  timeItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedTimeItem: {
    backgroundColor: COLORS.primary,
  },
  timeText: {
    fontSize: 16,
    textAlign: "center",
  },
  selectedTimeText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});

export default TimeDropdown;

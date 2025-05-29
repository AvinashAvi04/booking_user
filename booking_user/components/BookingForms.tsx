import React, { useState, ReactNode } from "react";
import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Input from "./Input";
import Button from "./Button";
import DatePickerModal from "./DatePickerModal";
import CarItem from "./CarItem";
import { COLORS, icons } from "../constants";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

// --- ONEWAY FORM ---
const cabTypes = [
  { key: 'Hatchback', icon: icons.car2, desc: 'Small car', price: '' },
  { key: 'Sedan', icon: icons.car2, desc: 'Comfortable sedan', price: '' },
  { key: 'SUV', icon: icons.car2, desc: 'Ertiga, Rumion, Triber', price: '' },
  { key: 'Prime SUV', icon: icons.car2, desc: 'Innova, Crysta, KIA Carens', price: '' },
];

const FieldLabel = ({ children }: { children: ReactNode }) => (
  <Text style={styles.fieldLabel}>{children}</Text>
);

export const OneWayForm = () => {
  const [fields, setFields] = useState({ source: '', destination: '', date: '', time: '' });
  const [showDate, setShowDate] = useState(false);
  const [selectedCab, setSelectedCab] = useState('Hatchback');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        <FieldLabel>Source</FieldLabel>
        <Input id="source" placeholder="Source" icon={icons.location} onInputChanged={(id, v) => setFields(f => ({ ...f, source: v }))} value={fields.source} />
        <FieldLabel>Destination</FieldLabel>
        <Input id="destination" placeholder="Destination" icon={icons.location} onInputChanged={(id, v) => setFields(f => ({ ...f, destination: v }))} value={fields.destination} />
        <FieldLabel>Date</FieldLabel>
        <TouchableOpacity onPress={() => setShowDate(true)}>
          <Input id="date" placeholder="Date" icon={icons.calendar} value={fields.date} editable={false} onInputChanged={() => {}} />
        </TouchableOpacity>
        <FieldLabel>Time</FieldLabel>
        <Input id="time" placeholder="Time" icon={icons.clockTime} onInputChanged={(id, v) => setFields(f => ({ ...f, time: v }))} value={fields.time} />
        <Text style={styles.label}>Cab Type</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerIconWrapper}>
            <Text>
              <Text style={{ marginRight: 8 }}>
                {/* Car icon as emoji fallback if needed */}
                🚗
              </Text>
            </Text>
          </View>
          <Picker
            selectedValue={selectedCab}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedCab(itemValue)}
            dropdownIconColor={COLORS.primary}
          >
            {cabTypes.map(cab => (
              <Picker.Item label={cab.key} value={cab.key} key={cab.key} />
            ))}
          </Picker>
        </View>
        <Button title="Book Now" filled style={{ marginTop: 24 }} onPress={() => {}} />
        <DatePickerModal
          open={showDate}
          startDate={new Date().toISOString().split('T')[0]}
          selectedDate={fields.date}
          onClose={() => setShowDate(false)}
          onChangeStartDate={date => setFields(f => ({ ...f, date }))}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- ROUND TRIP FORM ---
export const RoundTripForm = () => {
  const [fields, setFields] = useState({ source: '', destinations: [''], pickup: '', return: '' });
  const [showPickup, setShowPickup] = useState(false);
  const [showReturn, setShowReturn] = useState(false);

  const addDestination = () => setFields(f => ({ ...f, destinations: [...f.destinations, ''] }));
  const setDestination = (idx: number, val: string) => setFields(f => {
    const arr = [...f.destinations];
    arr[idx] = val;
    return { ...f, destinations: arr };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        <FieldLabel>Source</FieldLabel>
        <Input id="source" placeholder="Source" icon={icons.location} onInputChanged={(id, v) => setFields(f => ({ ...f, source: v }))} value={fields.source} />
        {fields.destinations.map((d, i) => (
          <React.Fragment key={i}>
            <FieldLabel>{i === 0 ? 'To' : `To +${i}`}</FieldLabel>
            <Input
              id={`to${i}`}
              placeholder={i === 0 ? 'To' : `To +${i}`}
              icon={icons.location}
              onInputChanged={(id, v) => setDestination(i, v)}
              value={d}
            />
          </React.Fragment>
        ))}
        <TouchableOpacity onPress={addDestination} style={styles.addBtn}><Text style={styles.addBtnText}>+ Add Destination</Text></TouchableOpacity>
        <FieldLabel>Pickup Date & Time</FieldLabel>
        <TouchableOpacity onPress={() => setShowPickup(true)}>
          <Input id="pickup" placeholder="Pickup Date & Time" icon={icons.calendar} value={fields.pickup} editable={false} onInputChanged={() => {}} />
        </TouchableOpacity>
        <FieldLabel>Return Date & Time</FieldLabel>
        <TouchableOpacity onPress={() => setShowReturn(true)}>
          <Input id="return" placeholder="Return Date & Time" icon={icons.calendar} value={fields.return} editable={false} onInputChanged={() => {}} />
        </TouchableOpacity>
        <Button title="Book Now" filled style={{ marginTop: 24 }} onPress={() => {}} />
        <DatePickerModal
          open={showPickup}
          startDate={new Date().toISOString().split('T')[0]}
          selectedDate={fields.pickup}
          onClose={() => setShowPickup(false)}
          onChangeStartDate={date => setFields(f => ({ ...f, pickup: date }))}
        />
        <DatePickerModal
          open={showReturn}
          startDate={fields.pickup || new Date().toISOString().split('T')[0]}
          selectedDate={fields.return}
          onClose={() => setShowReturn(false)}
          onChangeStartDate={date => setFields(f => ({ ...f, return: date }))}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- LOCAL FORM ---
export const LocalForm = () => {
  const [fields, setFields] = useState({ city: '', date: '', time: '' });
  const [showDate, setShowDate] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        <FieldLabel>City</FieldLabel>
        <Input id="city" placeholder="City" icon={icons.location} onInputChanged={(id, v) => setFields(f => ({ ...f, city: v }))} value={fields.city} />
        <FieldLabel>Pickup Date</FieldLabel>
        <TouchableOpacity onPress={() => setShowDate(true)}>
          <Input id="date" placeholder="Pickup Date" icon={icons.calendar} value={fields.date} editable={false} onInputChanged={() => {}} />
        </TouchableOpacity>
        <FieldLabel>Pickup Time</FieldLabel>
        <Input id="time" placeholder="Pickup Time" icon={icons.clockTime} onInputChanged={(id, v) => setFields(f => ({ ...f, time: v }))} value={fields.time} />
        <Button title="Book Now" filled style={{ marginTop: 24 }} onPress={() => {}} />
        <DatePickerModal
          open={showDate}
          startDate={new Date().toISOString().split('T')[0]}
          selectedDate={fields.date}
          onClose={() => setShowDate(false)}
          onChangeStartDate={date => setFields(f => ({ ...f, date }))}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- AIRPORT FORM ---
export const AirportForm = () => {
  const [fields, setFields] = useState({
    fromAirport: true,
    airport: '',
    destination: '',
    pickup: '',
    toAirport: false,
    airport2: '',
    source: '',
    time: '',
  });
  const [showPickup, setShowPickup] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.toggleRow}>
          <TouchableOpacity onPress={() => setFields(f => ({ ...f, fromAirport: true, toAirport: false }))} style={[styles.toggleBtn, fields.fromAirport && styles.toggleBtnActive]}>
            <Text style={[styles.toggleBtnText, fields.fromAirport && styles.toggleBtnTextActive]}>From Airport</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFields(f => ({ ...f, fromAirport: false, toAirport: true }))} style={[styles.toggleBtn, fields.toAirport && styles.toggleBtnActive]}>
            <Text style={[styles.toggleBtnText, fields.toAirport && styles.toggleBtnTextActive]}>To Airport</Text>
          </TouchableOpacity>
        </View>
        <FieldLabel>Airport</FieldLabel>
        <Input id="airport" placeholder="Airport" icon={icons.location} onInputChanged={(id, v) => setFields(f => ({ ...f, airport: v }))} value={fields.airport} />
        {fields.fromAirport ? (
          <>
            <FieldLabel>Destination</FieldLabel>
            <Input id="destination" placeholder="Destination" icon={icons.location} onInputChanged={(id, v) => setFields(f => ({ ...f, destination: v }))} value={fields.destination} />
          </>
        ) : (
          <>
            <FieldLabel>Source Address</FieldLabel>
            <Input id="source" placeholder="Source Address" icon={icons.location} onInputChanged={(id, v) => setFields(f => ({ ...f, source: v }))} value={fields.source} />
          </>
        )}
        <FieldLabel>Pickup Date & Time</FieldLabel>
        <TouchableOpacity onPress={() => setShowPickup(true)}>
          <Input id="pickup" placeholder="Pickup Date & Time" icon={icons.calendar} value={fields.pickup} editable={false} onInputChanged={() => {}} />
        </TouchableOpacity>
        <FieldLabel>Time</FieldLabel>
        <Input id="time" placeholder="Time" icon={icons.clockTime} onInputChanged={(id, v) => setFields(f => ({ ...f, time: v }))} value={fields.time} />
        <Button title="Book Now" filled style={{ marginTop: 24 }} onPress={() => {}} />
        <DatePickerModal
          open={showPickup}
          startDate={new Date().toISOString().split('T')[0]}
          selectedDate={fields.pickup}
          onClose={() => setShowPickup(false)}
          onChangeStartDate={date => setFields(f => ({ ...f, pickup: date }))}
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
    flexGrow: 1,
    padding: 20,
    backgroundColor: COLORS.white,
    minHeight: '100%',
  },
  fieldLabel: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 12,
    marginLeft: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    color: COLORS.primary,
  },
  cabTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cabTypeCol: {
    width: '48%',
    marginBottom: 10,
  },
  cabTypeCard: {
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  cabTypeIcon: {
    width: 22,
    height: 22,
  },
  addBtn: {
    marginVertical: 12,
    alignSelf: 'flex-start',
  },
  addBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  toggleRow: {
    flexDirection: 'row',
    marginVertical: 12,
    justifyContent: 'center',
  },
  toggleBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: COLORS.white,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
  },
  toggleBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  toggleBtnTextActive: {
    color: COLORS.white,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 4,
    backgroundColor: COLORS.white,
    height: 52,
    paddingHorizontal: 8,
  },
  pickerIconWrapper: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    color: COLORS.primary,
    backgroundColor: 'transparent',
    height: 52,
  },
});

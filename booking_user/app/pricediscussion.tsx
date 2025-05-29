import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import Input from '../components/Input';
import { useTheme } from '../theme/ThemeProvider';


export default function PriceDiscussion() {
  const { colors } = useTheme();
  const [userPrice, setUserPrice] = useState('700');
  const preferredPrice = 1000;

  const handleGoWithOurPrice = () => {
    setUserPrice(preferredPrice.toString());
  };

  const handleFindDrivers = () => {
    // Implement find drivers logic here
  };

  return (
    <PageContainer>
      <View style={[styles.container, { backgroundColor: colors?.background || COLORS.white }]}>  
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>our price</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
          <Text style={styles.price}>$ {preferredPrice}</Text>
          <Button 
            title="go with our price" 
            onPress={handleGoWithOurPrice} 
            style={styles.button}
            textColor={COLORS.black}
            filled={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>set price</Text>
          <Input
            id="userPrice"
            value={`$${userPrice}`}
            onInputChanged={(_, text) => setUserPrice(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            style={styles.input}
            placeholder="$700"
            placeholderTextColor={COLORS.gray}
          />
          <Button 
            title="find drivers" 
            onPress={handleFindDrivers} 
            style={styles.button}
            filled={true}
          />
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    margin: SIZES.padding3,
    padding: SIZES.padding3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    width: '100%',
    marginBottom: SIZES.padding3 * 1.5,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  label: {
    ...FONTS.h3,
    fontFamily: 'regular',
    marginBottom: 2,
  },
  arrow: {
    fontSize: 22,
    marginLeft: 8,
    marginBottom: 2,
  },
  price: {
    ...FONTS.h1,
    marginBottom: SIZES.padding,
    fontFamily: 'bold',
  },
  input: {
    marginVertical: SIZES.padding,
    fontSize: 22,
    fontFamily: 'bold',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: SIZES.padding,
  },
});
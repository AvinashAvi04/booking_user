import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS, SIZES } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import ReasonTaxioItem from '@/components/ReasonTaxioItem';

const reasons = [
    "Book Rides Instantly",
    "Track Your Ride in Real-Time",
    "Choose Your Preferred Vehicle",
    "Get Affordable and Transparent Pricing",
    "Ride with Professional Drivers",
    "Other Reasons",
];

type Nav = {
    navigate: (value: string) => void
}

const ReasonForUsingTaxio = () => {
    const { navigate } = useNavigation<Nav>();
    const { colors, dark } = useTheme();
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    const toggleReason = (reason: string) => {
        setSelectedReasons((prevSelectedReasons) =>
            prevSelectedReasons.includes(reason)
                ? prevSelectedReasons.filter((r) => r !== reason)
                : [...prevSelectedReasons, reason]
        );
    };

    // Replace the api url
    const sendSelectedReasons = async () => {
        try {
            const response = await fetch('https://your-backend-endpoint.com/api/reasons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reasons: selectedReasons }),
            });

            if (!response.ok) {
                throw new Error('Failed to send reasons');
            }

            Alert.alert('Success', 'Selected reasons sent successfully');
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Error', 'An unknown error occurred');
            }
        }
    };

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[styles.title, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Reason for Using Taxio</Text>
                    <Text style={[styles.subtitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>We want to provide the best experience according to your needs.</Text>
                    <View style={styles.reasonContainer}>
                        {reasons.map((reason, index) => (
                            <ReasonTaxioItem
                                key={index}
                                reason={reason}
                                isChecked={selectedReasons.includes(reason)}
                                onToggle={toggleReason}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
            <View style={styles.bottomContainer}>
                <Button
                    title="Continue"
                    filled
                    style={styles.button}
                    onPress={() => navigate("fillyourprofile")}
                />
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white
    },
    title: {
        fontSize: 28,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        textAlign: "center",
        marginVertical: 22
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "regular",
        color: COLORS.greyscale900,
        textAlign: "center",
        paddingHorizontal: 3
    },
    reasonContainer: {
        marginVertical: 22
    },
    button: {
        marginTop: 12,
        width: SIZES.width - 32,
        borderRadius: 32
    },
    bottomContainer: {
        position: "absolute",
        bottom: 28,
        right: 0,
        left: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16
    }
})

export default ReasonForUsingTaxio
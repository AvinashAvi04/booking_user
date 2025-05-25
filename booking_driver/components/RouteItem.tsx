import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface RouteItemProps {
    name: string;
    address: string;
    distance: string;
    onPress: () => void;
}

const RouteItem: React.FC<RouteItemProps> = ({ name, address, distance, onPress }) => {
    const { dark } = useTheme();

    return (
        <TouchableOpacity 
            onPress={onPress}
            style={styles.container}>
            <View style={styles.routeLeftContainer}>
                <View style={styles.locationIcon1}>
                    <View style={styles.locationIcon2}>
                        <Image
                            source={icons.location2}
                            resizeMode='contain'
                            style={styles.locationIcon3}
                        />
                    </View>
                </View>
                <View>
                    <Text style={[styles.routeName, { 
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>{name}</Text>
                    <Text style={[styles.routeAddress, { 
                        color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                    }]}>{address}</Text>
                </View>
            </View>
            <Text style={[styles.distance, { 
                color: dark ? COLORS.white : COLORS.greyscale900
            }]}>{distance}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: SIZES.width - 32,
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 12,
        alignItems: 'center'
    },
    routeLeftContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    locationIcon1: {
        height: 52,
        width: 52,
        borderRadius: 999,
        marginRight: 12,
        backgroundColor: "rgba(254, 187, 27, 0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    locationIcon2: {
        height: 36,
        width: 36,
        borderRadius: 999,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    locationIcon3: {
        height: 16,
        width: 16,
        tintColor: COLORS.black
    },
    routeName: {
        fontSize: 18,
        color: COLORS.greyscale900,
        fontFamily: "bold",
        marginBottom: 6
    },
    routeAddress: {
        fontSize: 12,
        color: COLORS.grayscale700,
        fontFamily: "regular"
    },
    distance: {
        fontSize: 14,
        color: COLORS.greyscale900,
        fontFamily: "medium"
    }
});

export default RouteItem;

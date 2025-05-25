import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface AddressItemProps {
    name: string;
    address: string;
    distance: string;
    onPress: () => void;
}

const AddressItem: React.FC<AddressItemProps> = ({ name, address, distance, onPress }) => {
    const { dark } = useTheme();
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.routeLeftContainer}>
                <Image
                    source={icons.clock}
                    resizeMode='contain'
                    style={[styles.clockIcon, {
                        tintColor: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                    }]}
                />
                <View>
                    <Text style={[styles.routeName, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>{name}</Text>
                    <Text style={[styles.routeAddress, {
                        color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
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
    },
    clockIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.grayscale700,
        marginRight: 12
    }
});

export default AddressItem;

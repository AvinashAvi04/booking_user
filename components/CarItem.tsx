import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import { COLORS } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface CarItemProps {
    checked: boolean;
    onPress: () => void;
    title: string;
    description: string;
    price: string;
    icon: any;
}

const CarItem: React.FC<CarItemProps> = ({ checked, onPress, title, description, price, icon }) => {
    const { dark } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container,
            Platform.OS === 'android' ? styles.androidShadow : styles.iosShadow,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
            <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                    <Image
                        source={icon}
                        resizeMode='contain'
                        style={styles.icon}
                    />
                </View>
                <View>
                    <Text style={[styles.title, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>{title}</Text>
                    <Text style={[styles.description, {
                        color: dark ? COLORS.white : COLORS.grayscale700
                    }]}>{description}</Text>
                </View>
            </View>
            <View style={styles.leftContainer}>
                <Text style={[styles.price, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>{price}</Text>
                <TouchableOpacity style={{ marginLeft: 8 }}>
                    <View style={styles.roundedChecked}>
                        {checked && <View style={styles.roundedCheckedCheck} />}
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
        height: 74,
        backgroundColor: COLORS.white,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        height: 52,
        width: 52,
        borderRadius: 999,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 22
    },
    icon: {
        height: 26,
        width: 26,
        tintColor: COLORS.black
    },
    title: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginBottom: 4
    },
    description: {
        fontSize: 14,
        color: COLORS.greyScale800,
        fontFamily: 'regular',
    },
    price: {
        fontSize: 20,
        color: COLORS.greyscale900,
        fontFamily: 'bold',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roundedChecked: {
        width: 20,
        height: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    roundedCheckedCheck: {
        height: 10,
        width: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 999,
    },
    androidShadow: {
        elevation: 1,
    },
    iosShadow: {
        shadowColor: 'rgba(4, 6, 15, 0.05)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 0,
    },
});

export default CarItem;

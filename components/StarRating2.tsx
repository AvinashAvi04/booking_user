import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS } from '../constants';

interface StarRatingProps {
    ratings: number;
    reviews: number;
}

const StarRating2: React.FC<StarRatingProps> = ({ ratings, reviews }) => {
    const { dark } = useTheme();
    let stars = [];
    
    for (let i = 1; i <= 5; i++) {
        let name: any = 'star';
        if (i > ratings) {
            name = 'star-outline';
        }
        stars.push(<Ionicons name={name} size={15} key={i} color="orange" />);
    }

    return (
        <View style={styles.container}>
            {stars}
            <Text style={[styles.text, { color: dark ? COLORS.grayscale200 : '#444' }]}>({reviews})</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
        marginLeft: 5,
        color: '#444',
    },
});

export default StarRating2;

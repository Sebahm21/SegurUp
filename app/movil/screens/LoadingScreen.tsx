import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

const LoadingScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../shared/assets/logo.jpg')} // Ajusta la ruta a tu logo
                style={styles.background}
                resizeMode="contain" // Mantiene proporciones y centra
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001d36', // Color base para áreas no cubiertas
    },
    background: {
        flex: 1,
        justifyContent: 'center', // Centra la imagen verticalmente
        alignItems: 'center',     // Centra la imagen horizontalmente
    },
});

export default LoadingScreen;
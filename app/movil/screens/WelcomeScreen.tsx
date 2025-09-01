import React from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push('/home'); // Navega a /home (crea home.tsx si no existe)
  };

  return (
    <ImageBackground 
      source={require('../../shared/assets/ciudad.jpg')} // Ajusta la ruta
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.description}>
          SegurUp es una app diseñada para proteger a la comunidad. 
          Participa, reporta y colabora. Juntos hacemos la ciudad más segura.
        </Text>
       
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Comencemos! →</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(10, 31, 46, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topText: {
    position: 'absolute',
    top: 40,
    color: '#FFFFFF',
    fontSize: 14,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
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
        <View style={styles.topContainer}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.description}>
            SegurUp es una app diseñada para proteger a la comunidad.{'\n'}
            Participa, reporta y colabora..{'\n'} 
            Juntos hacemos la ciudad más segura.
          </Text>
        </View>
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
    justifyContent: 'space-between', // Espacia el contenido entre la parte superior y inferior
    padding: 20,
  },
  topContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 25,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center', // Centra el botón horizontalmente
    marginBottom: 20, // Margen inferior para simular la posición en la imagen
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
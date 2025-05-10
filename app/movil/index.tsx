import { ScrollView, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';

export default function MovilHome() {
  const { width, height } = Dimensions.get('window');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.container, { width, height }]}>
        <Text style={styles.text}>
          Bienvenido a la versión Movil!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    margin: 20,
  },
});
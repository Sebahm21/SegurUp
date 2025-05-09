import { ScrollView, StyleSheet, View, Text } from 'react-native';
import  ReportesSection  from './reportes';
import  EmergenciasSection  from './emergencias';

export default function WebHome() {
  return (
    <ScrollView style={styles.container}>
      {/* Título del Dashboard */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      {/* Secciones */}
      <ReportesSection />
      <EmergenciasSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});